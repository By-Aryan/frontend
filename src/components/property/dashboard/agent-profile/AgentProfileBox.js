"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState } from "react";
import Image from "next/image";

const AgentProfileBox = ({ data, onChange}) => {
  const [uploadedImage, setUploadedImage] = useState(null || data);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const name = event.target.name
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      console.log(file)
      const uploadedImage = {[name] : file}
      onChange({[name] : file})
    }
  };

  return (
    <div className="profile-box position-relative d-md-flex align-items-end mb50">
      {uploadedImage&&<div className="profile-img new position-relative overflow-hidden bdrs12 mb20-sm">
        <Image
          width={240}
          height={220}
          className="w-100 cover h-100"
          src={uploadedImage || "/images/listings/profile-1.jpg"}
          alt="profile avatar"
        />

        <button
          className="tag-del"
          style={{ border: "none" }}
          data-tooltip-id="profile_del"
          onClick={() => setUploadedImage(null)}
        >
          <span className="fas fa-trash-can" />
        </button>

        <ReactTooltip id="profile_del" place="right" content="Delete Image" />
      </div>}
      {/* End .profile-img */}

      <div className="profile-content ml30 ml0-sm">
        <label className="upload-label pointer">
          <input
            type="file"
            name="userprofile"
            accept="image/jpeg,image/png"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <div className="ud-btn btn-white2 mb30">
            Upload Agent's Profile Photo
            <i className="fal fa-arrow-right-long" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default AgentProfileBox;
