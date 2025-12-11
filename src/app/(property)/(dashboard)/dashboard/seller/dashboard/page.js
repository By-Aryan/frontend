"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import TopStateBlock from "@/components/property/dashboard/dashboard-home/TopStateBlock";
import { useAuth } from "@/hooks/useAuth";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// export const metadata = {
//   title: "Dashboard Home || ZeroBroker - Real Estate NextJS Template",
// };

const SellerDashboard = () => {
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErr,
  } = useAxiosFetch("/profile/me");
  const {
    data: sellerData,
    isLoading: sellerLoading,
    isError: sellerError,
    error: sellerErr,
  } = useAxiosFetch("/seller/me");
  const { auth } = useAuth();
  const [role, setRole] = useState("");
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [status, setStatus] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userRole = auth.roles[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  useEffect(() => {
    if (sellerError) {
      setStatus(false);
      setMessage("Failed to load seller data. Please try again later.");
      setState({ ...state, open: true });
    }
  }, [sellerError]);

  const isPDF = sellerData?.data?.documentUrl?.toLowerCase().endsWith(".pdf");

  const handleWheel = (e) => {
    if (!isPDF) {
      e.preventDefault();
      const newScale = scale + e.deltaY * -0.01;
      setScale(Math.min(Math.max(1, newScale), 3));
    }
  };

  function closeModal() {
    setIsOpen(false);
    setScale(1);
  }

  function openModal() {
    setIsOpen(true);
  }

  const onDocumentLoadError = (error) => {
    console.error("Document loading error:", error);
    if (isPDF) {
      setPdfError(true);
    } else {
      setImageError(true);
    }
  };
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/api\/v1\/?$/,
    ""
  );
  console.log("Backend Url:", backendBaseUrl);

  return (
    <>
      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                {/* End .col-12 */}

                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Hii, {profileData?.data?.user?.fullname}!</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
                {/* col-lg-12 */}
              </div>
              {/* End .row */}

              <div className="row">
                <TopStateBlock role={role} />
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <p className="text-xl font-bold">
                      Documents and Info Submitted By You.
                    </p>
                    <div className="row">
                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Emirates ID
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={
                              sellerData?.data?.emiratesId || "Not available"
                            }
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Passport
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={
                              sellerData?.data?.passport || "Not available"
                            }
                          />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb20">
                            Document Preview
                          </label>
                          {sellerLoading ? (
                            <div className="text-center p-4">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </div>
                          ) : sellerError ? (
                            <p className="text-danger">
                              Error loading document
                            </p>
                          ) : sellerData?.data?.documentUrl ? (
                            <div className="document-preview">
                              {isPDF ? (
                                <a
                                  href={sellerData.data.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-[250px] text-center mt-5 px-6 py-3 bg-[#0f8363] text-white bdrs12 font-semibold hover:bg-[#0d6e4f] transition-colors"
                                >
                                  View PDF
                                </a>
                              ) : (
                                <button
                                  onClick={openModal}
                                  className="cursor-pointer w-[250px] h-[300px]"
                                >
                                  <Image
                                    src={
                                      sellerData.data.documentUrl ||
                                      "/images/agent/agent-1.jpg"
                                    }
                                    alt="document"
                                    width={250}
                                    height={300}
                                    className="w-[250px] h-[300px] object-cover bdrs12 border"
                                    onError={onDocumentLoadError}
                                  />
                                </button>
                              )}
                              {(pdfError || imageError) && (
                                <p className="text-danger mt-2">
                                  Error loading document. Please try again
                                  later.
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-muted">No document available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End col-xl-8 */}

                {/* <div className="col-xl-4">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb25">Recent Activities</h4>
                    <RecentActivities />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      Image Preview
                    </Dialog.Title>
                    <div className="flex items-center space-x-4">
                      <a
                        href={
                          process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                            /\/api\/v1\/?$/,
                            ""
                          ) + sellerData?.data?.documentUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Open in new tab
                      </a>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={closeModal}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    className="mt-4 flex justify-center overflow-auto relative"
                    onWheel={handleWheel}
                    style={{
                      cursor: scale > 1 ? "grab" : "default",
                      minHeight: "70vh",
                    }}
                  >
                    {imageError ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-red-500">Failed to load image</p>
                        <a
                          href={
                            process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                              /\/api\/v1\/?$/,
                              ""
                            ) + sellerData?.data?.documentUrl
                          }
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open image in new tab
                        </a>
                      </div>
                    ) : (
                      <div
                        ref={imageRef}
                        className="relative"
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: "center center",
                          transition: "transform 0.1s ease-out",
                          width: "100%",
                          height: "70vh",
                        }}
                      >
                        <Image
                          src={
                            process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                              /\/api\/v1\/?$/,
                              ""
                            ) + sellerData?.data?.documentUrl ||
                            "/images/agent/agent-1.jpg"
                          }
                          alt="Document Preview"
                          fill
                          style={{ objectFit: "contain" }}
                          quality={100}
                          priority
                          // onError={() => setImageError(true)}
                        />
                      </div>
                    )}
                  </div>

                  {!imageError && (
                    <div className="flex justify-center mt-4 space-x-4">
                      <button
                        onClick={() =>
                          setScale((prev) => Math.min(prev + 0.2, 3))
                        }
                        disabled={scale >= 3}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Zoom In (+)
                      </button>
                      <button
                        onClick={() =>
                          setScale((prev) => Math.max(prev - 0.2, 1))
                        }
                        disabled={scale <= 1}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Zoom Out (-)
                      </button>
                      <button
                        onClick={() => setScale(1)}
                        disabled={scale === 1}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Reset Zoom
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default SellerDashboard;
