"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Map from "@/components/property/dashboard/dashboard-add-property/LocationField/Map";
import PropertyGallery from "@/components/property/property-single-style/single-v1/PropertyGallery";

const DriverRequestDetail = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [propertyId, setPropertyId] = useState("");
  const [processedImages, setProcessedImages] = useState([]);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [snackState, setSnackState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [snackMessage, setSnackMessage] = useState("");
  const [snackStatus, setSnackStatus] = useState(true);

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/api\/v1\/?$/,
    ""
  );

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      const id = pathParts[pathParts.length - 1];
      if (id && id !== "driver-request-detail") {
        setPropertyId(id);
        return;
      }
    }

    const id = searchParams?.get("id") || searchParams?.get("propertyId");
    if (id) setPropertyId(id);
  }, [pathname, searchParams]);

  const {
    data: propertyData,
    isLoading: loading,
    error,
  } = useAxiosFetch(
    propertyId ? `/agents/propertiesreview?propertyId=${propertyId}` : null
  );

  const approveMutation = useAxiosPost(
    `/agents/review?propertyId=${propertyId}`
  );
  const rejectMutation = useAxiosPost(
    `/agents/review?propertyId=${propertyId}`
  );

  useEffect(() => {
    if (propertyData?.data?.developer_notes?.images) {
      const fullPathImages = propertyData.data.developer_notes.images.map(
        (image) => {
          if (image.full_url?.startsWith("https")) {
            return image.full_url;
          }
          // Fix double /uploads/ issue by removing duplicate if present
          let cleanUrl = image.full_url || '';
          cleanUrl = cleanUrl.replace(/\/uploads\/+uploads\//g, '/uploads/');
          return `${backendBaseUrl}${cleanUrl}`;
        }
      );
      setProcessedImages(fullPathImages);
    }
  }, [propertyData, backendBaseUrl]);

  const handleApprove = () => {
    approveMutation.mutate(
      { status: "approved", feedback: "" },
      {
        onSuccess: () => {
          setSnackStatus(true);
          setSnackMessage("Driver's request approved successfully.");
          setSnackState((prev) => ({ ...prev, open: true }));
          router.push('/dashboard/agent/drivers-requests')
        },
        onError: () => {
          setSnackStatus(false);
          setSnackMessage("Failed to approve driver's request.");
          setSnackState((prev) => ({ ...prev, open: true }));
        },
      }
    );
  };

  const handleRejectClick = () => {
    setShowReasonBox(true);
  };

  const handleReject = () => {
    if (!reason) {
      setSnackStatus(false);
      setSnackMessage("Please provide a reason for rejection.");
      setSnackState((prev) => ({ ...prev, open: true }));
      return;
    }

    rejectMutation.mutate(
      { status: "rejected", feedback: reason },
      {
        onSuccess: () => {
          setSnackStatus(true);
          setSnackMessage("Driver's request rejected.");
          setSnackState((prev) => ({ ...prev, open: true }));
          router.push('/dashboard/agent/drivers-requests')
        },
        onError: () => {
          setSnackStatus(false);
          setSnackMessage("Failed to reject driver's request.");
          setSnackState((prev) => ({ ...prev, open: true }));
        },
      }
    );
  };

  const openModal = (url) => {
    // Fix double /uploads/ issue
    let cleanUrl = url || '';
    cleanUrl = cleanUrl.replace(/\/uploads\/+uploads\//g, '/uploads/');
    setVideoUrl(cleanUrl.startsWith("https") ? cleanUrl : `${backendBaseUrl}${cleanUrl}`);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setVideoUrl("");
  };

  const property = propertyData?.data?.propertyDetails;
  const developerNotes = propertyData?.data?.developer_notes;
  const videos = developerNotes?.videos || [];

  const latitude = property?.location?.latitude;
  const longitude = property?.location?.longitude;

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        <div className="row align-items-center pb40">
          <div className="col-xxl-3">
            <div className="dashboard_title_area">
              <h2>Details</h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12 min-h-[50vh]">
            {loading ? (
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 flex justify-center items-center">
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading property details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 text-center text-red-500">
                <p>
                  {error.message ||
                    "Failed to load property details. Please try again later."}
                </p>
                <button
                  className="mt-4 py-2 px-4 bg-primary text-white bdrs12 font-semibold"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden space-y-10">
                {/* Only show Images section if images exist */}
                {processedImages.length > 0 && (
                  <div>
                    <label className="heading-color ff-heading fw600 mb10">
                      Images of Property Uploaded by Driver
                    </label>
                    <PropertyGallery property={propertyData?.data} />
                  </div>
                )}

                {/* Only show Videos section if videos exist */}
                {videos.length > 0 && (
                  <div>
                    <label className="heading-color ff-heading fw600 mb10">
                      Videos of Property Uploaded by Driver
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {videos.map((video, index) => {
                        // Fix double /uploads/ issue
                        let cleanVideoUrl = video.full_url || '';
                        cleanVideoUrl = cleanVideoUrl.replace(/\/uploads\/+uploads\//g, '/uploads/');
                        const videoSrc = cleanVideoUrl.startsWith("https")
                          ? cleanVideoUrl
                          : `${backendBaseUrl}${cleanVideoUrl}`;

                        return (
                          <div
                            key={index}
                            className="relative w-32 h-48 cursor-pointer hover:scale-105 transition rounded-lg overflow-hidden"
                            onClick={() => openModal(cleanVideoUrl)}
                          >
                            <video
                              src={videoSrc}
                              className="w-full h-full object-cover"
                            />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center">
                              <svg
                                xmlns="https://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    {/* Video Modal */}
                    {isOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
                          <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-700 text-lg font-bold"
                          >
                            ✕
                          </button>
                          <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full rounded-md h-96"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="heading-color ff-heading fw600 mb10">
                    Location of Property Pinned by Driver
                  </label>
                  <Map latitude={latitude} longitude={longitude} />
                </div>

                {showReasonBox ? (
                  <div className="col-sm-12">
                    <label className="heading-color ff-heading fw600 mb10">
                      Reason for Rejection
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded"
                      rows={4}
                      placeholder="Enter reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <button
                      className="mt-3 py-2 px-5 bg-red-500 text-white bdrs12 font-semibold"
                      onClick={handleReject}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="py-2 px-5 bg-[#0f8363] text-white bdrs12 font-semibold"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                    <button
                      className="py-2 px-5 bg-red-400 text-white bdrs12 font-semibold"
                      onClick={handleRejectClick}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardContentWrapper>

      <StatusSnackbar
        message={snackMessage}
        state={snackState}
        status={snackStatus}
      />
    </>
  );
};

export default DriverRequestDetail;
