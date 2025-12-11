// "use client";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import React, { useState, useRef, useEffect } from "react";
// import Image from "next/image";

// const PhotoUpload = ({setImages}) => {
//   const [uploaded, setUploaded] = useState(false)
//   const [uploadedImages, setUploadedImages] = useState([]); // Stores both file & preview
//   const fileInputRef = useRef(null);

//   const handleUpload = (e) => {
//     const files = e.target.files || e; // Support both input & drag/drop
//     const newImages = [...uploadedImages];
    
//     for (const file of files) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         newImages.push({ file, preview: event.target.result });
//         setUploadedImages([...newImages]); // Ensure state updates properly
//       };
//       reader.readAsDataURL(file);
//     }
//     setUploaded(false)
//   };
  
//   const handleDrop = (event) => {
//     event.preventDefault();
//     handleUpload(event.dataTransfer.files);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleDelete = (index) => {
//     const newImages = [...uploadedImages];
//     newImages.splice(index, 1);
//     setUploadedImages(newImages);
//     setUploaded(false)
//   };

//   const handleSubmit = () => {
//     const filesArray = uploadedImages.map(({ file }) => file); // Extract only file objects
//     setImages([...filesArray]); 
//     console.log(filesArray); // Debugging to ensure correct values
//     setUploaded(true);
//   };


//   return (
//     <>
//       <div
//         className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2 min-h-56"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         <div className="icon mb5">
//           <span className="flaticon-upload" />
//         </div>
//         <h4 className="title fz17 mb1">Upload/Drag photos of your property</h4>
//         <p className="text fz-10 mb10">
//           Photos must be JPEG or PNG format and at least 2048x768
//         </p>
//         <label className="ud-btn btn-white">
//           Browse Files
//           <input
//             ref={fileInputRef}
//             id="fileInput"
//             type="file"
//             name="images"
//             multiple
//             className="ud-btn btn-white"
//             onChange={handleUpload}
//             style={{ display: "none" }}
//             required
//           />
//         </label>
//       </div>

//       {/* Display uploaded images */}
//       <div className="row profile-box position-relative d-md-flex align-items-end mb50">
//         {uploadedImages.map(({ preview }, index) => (
//           <div className="col-2" key={index}>
//             <div className="profile-img mb20 position-relative sm:w-[100px] w-[70px]">
//               <Image
//                 width={212}
//                 height={194}
//                 className="w-100 bdrs12 cover"
//                 src={preview}
//                 alt={`Uploaded Image ${index + 1}`}
//               />
//               <button
//                 style={{ border: "none" }}
//                 className="tag-del sm:h-[45px] rounded-lg sm:w-[45px] h-[25px] w-[25px] absolute sm:top-[10px] top-[3px] sm:left-[10px] left-[2px]"
//                 title="Delete Image"
//                 onClick={() => handleDelete(index)}
//                 type="button"
//                 data-tooltip-id={`delete-${index}`}
//               >
//                 <span className="fas fa-trash-can sm:text-base text-xs sm:mt-0 mt-[-10px]" />
//               </button>

//               <ReactTooltip
//                 id={`delete-${index}`}
//                 place="right"
//                 content="Delete Image"
//               />
//             </div>
//           </div>
//         ))}
//       {uploadedImages.length !== 0 &&<div className="flex justify-end">
//           <button type="button" disabled={uploadedImages.length === 0} className={`ud-btn ${uploaded ? "btn-thm" : "btn-white2"} duration-200 flex`} onClick={(e)=>{e.stopPropagation(); handleSubmit()}}>
//            {uploaded?<>Saved <i className="fa fa-check-circle rotate-45"></i></>: <> Save Images </>}
//           </button>
//         </div>}
//       </div>

//       {/* Submit Button */}
//     </>
//   );
// };

// export default PhotoUpload;
"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '');
// Use API_BASE_URL as fallback for assets since they're served from the same server
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || API_BASE_URL || '';

const PhotoUpload = ({ setImages, clearImages = false }) => {
  const [uploaded, setUploaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // [{ filename, path, originalName, size }]
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
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
      setIsUploading(false);
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
    setImages(uploadedImages.map((file) => file.filename));
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
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
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
            disabled={isUploading}
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
                style={{ width: '32px', height: '32px' }}
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <i className="fas fa-trash-can" style={{ fontSize: '12px' }}></i>
              </button>
              <ReactTooltip id={`delete-${index}`} place="right" content="Delete Image" />
            </div>
          </div>
        ))}
      </div>

      {uploadedImages.length > 0 && (
        <div className="d-flex justify-content-end mb-4">
          <button
            type="button"
            className={`ud-btn ${uploaded ? "btn-thm" : "btn-white2"} px-4 py-2 d-flex align-items-center gap-2`}
            onClick={handleSave}
            disabled={isUploading}
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

export default PhotoUpload;