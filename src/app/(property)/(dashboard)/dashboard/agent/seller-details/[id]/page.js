"use client";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";


const SellerDetails = ({ params }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  const [localData, setLocalData] = useState({
    documentFile: {},
    fullname: "",
    email: "",
    mobile: "",
    emiratesId: "",
    documentUrl: "",
  });

  const { data, error, isLoading, isError } = useAxiosFetch(
    `/seller/getSellerById/${params.id}`
  );

  useEffect(() => {
    if (data) {
      setLocalData(data.data);
      console.log("PDF Data:", {
        url: data.data.documentUrl,
        isPDF: data.data.documentUrl?.endsWith(".pdf"),
        fullData: data.data
      });
    }
  }, [data]);

  const isPDF = localData.documentUrl?.endsWith(".pdf");

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

  const handlePdfPreview = () => {
    if (!localData.documentUrl) {
      console.error('No PDF URL available');
      return;
    }

    try {
      // Test if the URL is accessible
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') + localData.documentUrl)
        .then(response => {
          console.log('PDF URL response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });
          if (!response.ok) {
            throw new Error(`https error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          console.log('PDF blob:', {
            size: blob.size,
            type: blob.type
          });
        })
        .catch(error => {
          console.error('PDF URL fetch error:', error);
        });
    } catch (error) {
      console.error('Error testing PDF URL:', error);
    }
  };

  useEffect(() => {
    if (isPDF && localData.documentUrl) {
      handlePdfPreview();
    }
  }, [isPDF, localData.documentUrl]);

  // console.log(localData.documentUrl)
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '')
  return (
    <>
      {/* dashboard_content_wrapper */}
      <DashboardContentWrapper>
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
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    <h2>Seller's Details</h2>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12 min-h-[50vh]">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative space-y-10">
                    <div className="row">
                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Seller's Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name"
                            value={localData?.fullname}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            placeholder="Contact Number"
                            value={localData?.mobile}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Email Address
                          </label>
                          <input
                            type="text"
                            name="email"
                            value={localData?.email}
                            className="form-control"
                            placeholder="Email"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-sm-6 col-xl-4">
                        <div className="mb20">
                          <label className="heading-color ff-heading fw600 mb10">
                            Emirates ID Number
                          </label>
                          <input
                            type="text"
                            name="email"
                            value={localData?.emiratesId}
                            className="form-control"
                            placeholder="Email"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="heading-color ff-heading fw600 mb10">
                        Image of Document
                      </label>
                      {isPDF ? (
                        <a
                          href={backendBaseUrl + localData.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-[250px] text-center px-6 py-3 bg-[#0f8363] text-white bdrs12 font-semibold hover:bg-[#0d6e4f] transition-colors"
                        >
                          View PDF
                        </a>
                      ) : (
                        <button onClick={openModal} className="cursor-pointer w-[250px] h-[300px]">
                          <Image
                            src={backendBaseUrl + localData.documentUrl || "/images/agent/agent-1.jpg"}
                            alt="document"
                            width={250}
                            height={300}
                            className="w-[250px] h-[300px] object-cover bdrs12 border"
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/agent/create-seller-account/${params.id}`}
                        className="md:py-3 py-1 md:px-5 px-4 md:text-base text-sm bg-[#0f8363] text-white bdrs12 font-semibold"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

          </div>
          {/* End .dashboard__main */}
        </div>
      </DashboardContentWrapper>

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
                      {isPDF ? "PDF Document" : "Image Preview"}
                    </Dialog.Title>
                    <div className="flex items-center space-x-4">
                      {/* {isPDF && (
                        <a
                          href={localData.documentUrl}
                          download
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Download PDF
                        </a>
                      )} */}
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
                      cursor: !isPDF && scale > 1 ? "grab" : "default",
                      minHeight: "70vh",
                    }}
                  >
                    {!isPDF && (
                      <>
                        {imageError ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-red-500">Failed to load image</p>
                            <a
                              href={backendBaseUrl + localData.documentUrl}
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
                              src={backendBaseUrl + localData.documentUrl || "/images/agent/agent-1.jpg"}
                              alt="Document Preview"
                              width={250}
                              height={300}
                              className="w-[250px] h-[300px] object-cover bdrs12 border"
                              fill
                              style={{ objectFit: "contain" }}
                              quality={100}
                              priority
                              // onError={() => setImageError(true)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>


                  {!isPDF && !imageError && (
                    <div className="flex justify-center mt-4 space-x-4">
                      <button
                        onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}
                        disabled={scale >= 3}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        Zoom In (+)
                      </button>
                      <button
                        onClick={() => setScale((prev) => Math.max(prev - 0.2, 1))}
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
    </>
  );
};

export default SellerDetails;
