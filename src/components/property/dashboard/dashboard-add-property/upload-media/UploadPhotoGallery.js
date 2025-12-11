"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '');
// Use API_BASE_URL as fallback for assets since they're served from the same server
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || API_BASE_URL || '';

const UploadPhotoGallery = ({ setImages, clearImages = false }) => {
  const [uploaded, setUploaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // [{ filename, path, originalName, size }]
  const [isUploading, setIsUploading] = useState(false); // loader state
  const fileInputRef = useRef(null);

  // Clear component state when parent requests it
  useEffect(() => {
    if (clearImages) {
      setUploadedImages([]);
      setUploaded(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearImages]);

  const uploadToTemp = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true); // start loader
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file); // match backend field name
    }

    try {
      const res = await fetch(`${API_BASE_URL}/upload/temp/multiple`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.success) {
        setUploadedImages((prev) => [...prev, ...data.files]);
        setUploaded(false);
      }
    } catch (err) {
      console.error("Error uploading files:", err);
      alert("Failed to upload files.");
    } finally {
      setIsUploading(false); // stop loader
    }
  };

  const handleFileChange = (e) => {
    uploadToTemp(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    uploadToTemp(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDelete = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setUploaded(false);
    // Optional: call backend to delete from /uploads/temp
  };

  const handleSave = () => {
    if (uploadedImages.length < 3) {
      alert("Please upload at least 3 images for the property.");
      return;
    }
    setImages(uploadedImages.map((file) => file.filename)); // store filenames only
    setUploaded(true);
  };

  return (
    <>
      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2 min-h-56"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="icon mb5">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb1">Upload/Drag photos of your property</h4>
        <p className="text fz-10 mb10">
          Photos must be JPEG or PNG format and at least 2048×768
        </p>
        <p className="text-danger fz-10 mb10 fw-bold">
          Minimum 3 images required per property
        </p>
        <label className="ud-btn btn-white">
          Browse Files
          <input
            ref={fileInputRef}
            type="file"
            name="files"
            accept="image/jpeg, image/png"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={isUploading} // disable while uploading
          />
        </label>
      </div>

      {/* Preview images */}
      <div className="row profile-box position-relative d-md-flex align-items-end mb50">
        {uploadedImages.map((file, index) => (
          <div className="col-2" key={index}>
            <div className="profile-img mb20 position-relative sm:w-[100px] w-[70px]">
              <Image
                width={212}
                height={194}
                className="w-100 bdrs12 cover"
                src={
                  file.path 
                    ? `${ASSETS_BASE_URL || ''}${file.path.startsWith('/') ? file.path : `/${file.path}`}` 
                    : '/images/home/property-image.jpeg'
                }
                alt={file.originalName || 'Uploaded image'}
              />
              <button
                className="tag-del position-absolute top-0 start-0 m-2 btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{width: '32px', height: '32px'}}
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <i className="fas fa-trash-can" style={{fontSize: '12px'}}></i>
              </button>

              <ReactTooltip id={`delete-${index}`} place="right" content="Delete Image" />
            </div>
          </div>
        ))}
      </div>

      {uploadedImages.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className={`text-sm ${uploadedImages.length >= 3 ? 'text-success' : 'text-warning'} fw-bold`}>
            {uploadedImages.length} / 3 images uploaded
            {uploadedImages.length < 3 && (
              <span className="ms-2 text-danger">
                (Upload {3 - uploadedImages.length} more)
              </span>
            )}
          </div>
          <button
            type="button"
            className={`ud-btn ${uploaded ? "btn-thm" : "btn-white2"} px-4 py-2 d-flex align-items-center gap-2`}
            onClick={handleSave}
            disabled={isUploading} // prevent saving mid-upload
          >
            {uploaded ? (
              <>
                Saved
                <i className="fa fa-check-circle ms-2"></i>
              </>
            ) : (
              <>Save Images</>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default UploadPhotoGallery;