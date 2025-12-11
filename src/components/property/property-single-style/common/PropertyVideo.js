"use client";
import { usePropertyStore } from "@/store/store";
import React, { useState } from "react";
// import ModalVideo from "react-modal-video";

const PropertyVideo = ({property}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const openModal = (url) => {
    setVideoUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setVideoUrl("");
  };
  return (
    <>
      {/* <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="oqNZOOWF8qM"
        onClose={() => setOpen(false)}
      /> */}

      {/* <div className="col-md-12">
        <div className="property_video bdrs12 w-100">
          <button
            className="video_popup_btn mx-auto popup-img"
            onClick={() => setOpen(true)}
            style={{ border: "none", background: "transparent" }}
          >
            <span className="flaticon-play" />
          </button>
        </div>
      </div> */}
          <video
            src={property?.developer_notes?.videos[0]}
            autoPlay
            muted
            className="h-52"
            onClick={() => openModal(property?.developer_notes?.videos[0])}
          />
          {/* Modal */}
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
    </>
  );
};

export default PropertyVideo;
