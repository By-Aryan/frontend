"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "../../../../utilis/imageHelpers"; // Import the helper function

const ProfileBox = ({ data, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  // Update preview when data changes
  useEffect(() => {
    if (data) {
      // If data is a File object, create a preview URL
      if (data instanceof File) {
        const fileUrl = URL.createObjectURL(data);
        setPreviewUrl(fileUrl);
        setProfilePhoto(data);
      } else {
        // If data is a URL string, use our helper function
        setPreviewUrl(null); // Reset preview first
        setProfilePhoto(data);
      }
    } else {
      setPreviewUrl(null);
      setProfilePhoto(null);
    }
  }, [data]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setProfilePhoto(file);
      onChange(file);
    }
  };

  // Get the proper image URL for display
  const displayImageUrl = previewUrl || (profilePhoto ? getImageUrl(profilePhoto) : null);

  return (
    <div className="profile-box position-relative profile-mobile-layout mobile-mb-6">
      <div className="profile-img new position-relative overflow-hidden bdrs12 mobile-mb-4">
        {displayImageUrl ? (
          <div className="profile-image-mobile responsive-image-container">
            <Image
              width={240}
              height={220}
              className="responsive-image profile-image-mobile"
              src={displayImageUrl}
              alt="profile avatar"
              unoptimized={displayImageUrl.startsWith('blob:') || displayImageUrl.startsWith('data:') || displayImageUrl.includes('localhost')}
              onError={(e) => {
                console.log('Profile image failed to load:', displayImageUrl);
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="profile-image-mobile d-flex align-items-center justify-content-center bg-light">
            <span className="fas fa-user text-muted" style={{ fontSize: '32px' }} />
          </div>
        )}

        {displayImageUrl && (
          <button
            className="tag-del touch-target"
            style={{ 
              border: "none",
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            data-tooltip-id="profile_del"
            onClick={() => {
              setProfilePhoto(null);
              setPreviewUrl(null);
              onChange(null);
            }}
          >
            <span className="fas fa-trash-can" style={{ fontSize: '14px' }} />
          </button>
        )}

        <ReactTooltip id="profile_del" place="top" content="Delete Image" />
      </div>
      {/* End .profile-img */}

      <div className="profile-content mobile-text-center tablet-text-left">
        <label className="upload-label pointer">
          <input
            type="file"
            name="profilePhoto"
            accept="image/jpeg,image/png"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <div className="ud-btn btn-white2 btn-mobile-full mobile-mb-3">
            Upload Profile Photo
            <i className="fal fa-arrow-right-long ms-2" />
          </div>
        </label>
        <p className="text mobile-px-2 tablet-px-0" style={{ fontSize: '14px', lineHeight: '1.4' }}>
          Photos must be JPEG or PNG format. Recommended size: 400x400px
        </p>
      </div>
    </div>
  );
};

export default ProfileBox;