// "use client";
// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import PhotoUpload from "./PhotoUpload";
// import VideoUpload from "./VideoUpload";
// import MapPin from "./MapPin";
// import { ApiPostRequest, ApiPutRequest } from "@/axios/apiRequest";
// import StatusSnackbar from "@/components/Snackbar/Snackbar";
// import { useRouter } from "next/navigation";

// const UploadMedia = ({ params }) => {
//   const [saved, setSaved] = useState(false);
//   const [snackMessage, setSnackMessage] = useState("Media and Location Uploaded Successfully")
//   const [status, setStatus] = useState(true)
//   const [images, setImages] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [locations, setLocations] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [files, setFiles] = useState({
//     images: [],
//     videos: [],
//   });
//   // Random Forest
//   const [state, setState] = useState({
//     open: false,
//     vertical: "top",
//     horizontal: "center",
//   });
//   const router = useRouter()
//   // Random Forest

//   useEffect(() => {
//     setFiles((prev) => ({
//       ...prev,
//       images,
//       videos,
//     }));
//   }, [images, videos]);

//   // Random Forest
//   const handleFilesSubmit = async (e) => {
//     e.preventDefault();
//     console.log("my", files);
//     if (!files) {
//       console.error("Files object is missing.");
//       return;
//     }
//     if (!locations.latitude && !locations.longitude) {
//       console.error("Please fill Longitude and Latitude.");
//       return;
//     }

//     setSaved(true);

//     // const data = {
//     //   assignmentId: params.id, 
//     //   media: files, 
//     //   longitude: locations.longitude, 
//     //   latitude: locations.latitude
//     // }

//     // console.log("my data:",data);

//     const formData = new FormData();
//     formData.append("assignmentId", params.id);
//     formData.append("longitude", locations.longitude);
//     formData.append("latitude", locations.latitude);

//     images.forEach((img) => {
//       formData.append("media[images]", img);
//     });

//     videos.forEach((vid) => {
//       formData.append("media[videos]", vid);
//     });



//     const response = await ApiPostRequest(`/driver/assignments/media`, formData);

//     if (response.status !== 200) {
//       setState((prev) => ({ ...prev, open: true }));
//       setStatus(false);
//       setSnackMessage("Failed to upload Media and Location. Please try again");
//       console.log(formData);
//       router.push(`/dashboard/driver/uploaded-media`);
//       return;
//     }
//     setStatus(true);
//     setState((prev) => ({ ...prev, open: true }));
//     router.push(`/dashboard/driver/uploaded-media`);
//   };


//   // Random Forest

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocations((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="ps-widget bgc-white bdrs12 p30 bg-[#ebfff9] overflow-hidden position-relative">
//       <h4 className="title fz17 mb30">Upload photos of your property</h4>
//       <form className="form-style1" onSubmit={handleFilesSubmit}>
//         <div className="row">
//           <div className="col-lg-12">
//             <PhotoUpload setImages={setImages} />
//           </div>
//         </div>
//         {/* End col-12 */}

//         <div className="row">
//           <h4 className="title fz17 mb30">
//             Upload videos of your property <>{"(required*)"}</>
//           </h4>
//           <div className="col-lg-12">
//             <VideoUpload setVideos={setVideos} />
//           </div>
//         </div>
//         {/* End .row */}
//         <div className="col-sm-12">
//           <div className="mb20 mt30">
//             <label className="heading-color ff-heading fw600 mb30">
//               Select the Location on the map or fill Latitude and Longitude field
//             </label>
//             <MapPin setLocations={setLocations} locations={locations} />
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-sm-6 col-xl-4">
//             <div className="mb30">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Latitude
//               </label>
//               <input
//                 type="text"
//                 name="latitude"
//                 // Random Forest
//                 value={locations.latitude || ""}
//                 // Random Forest
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Latitude"
//               />
//             </div>
//           </div>

//           <div className="col-sm-6 col-xl-4">
//             <div className="mb30">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Longitude
//               </label>
//               <input
//                 type="text"
//                 name="longitude"
//                 // Random Forest
//                 value={locations.longitude || ""}
//                 // Random Forest
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Longitude"
//               />
//             </div>
//           </div>
//         </div>

//         {images.length !== 0 && videos.length !== 0 && (
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className={`ud-btn ${saved ? "btn-thm" : "btn-white2"
//                 } duration-200 flex`}
//             >
//               Submit
//             </button>
//           </div>
//         )}
//       </form>
//       <StatusSnackbar message={snackMessage} state={state} status={status} />
//     </div>
//   );
// };

// export default UploadMedia;
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PhotoUpload from "./PhotoUpload";
import VideoUpload from "./VideoUpload";
import MapPin from "./MapPin";
import { ApiPostRequest } from "@/axios/apiRequest";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { useRouter } from "next/navigation";

const UploadMedia = ({ params }) => {
  const [saved, setSaved] = useState(false);
  const [snackMessage, setSnackMessage] = useState("Media and Location Uploaded Successfully");
  const [status, setStatus] = useState(true);
  const [images, setImages] = useState([]); // temp filenames from PhotoUpload
  const [videos, setVideos] = useState([]); // temp filenames from VideoUpload
  const [locations, setLocations] = useState({
    latitude: null,
    longitude: null,
  });

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const router = useRouter();

  const handleFilesSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      console.error("Please upload images or videos.");
      return;
    }
    if (!locations.latitude || !locations.longitude) {
      console.error("Please fill Longitude and Latitude.");
      return;
    }

    setSaved(true);

    // Send only filenames to backend
    const payload = {
      assignmentId: params.id,
      media: {
        images,
        videos,
      },
      longitude: locations.longitude,
      latitude: locations.latitude,
    };

    try {
      const response = await ApiPostRequest(`/driver/assignments/media`, payload);

      if (response.status !== 200) {
        setState((prev) => ({ ...prev, open: true }));
        setStatus(false);
        setSnackMessage("Failed to upload Media and Location. Please try again");
        router.push(`/dashboard/driver/uploaded-media`);
        return;
      }

      setStatus(true);
      setState((prev) => ({ ...prev, open: true }));
      router.push(`/dashboard/driver/uploaded-media`);
    } catch (err) {
      console.error("Error submitting media:", err);
      setState((prev) => ({ ...prev, open: true }));
      setStatus(false);
      setSnackMessage("Server error while uploading Media and Location.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocations((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 bg-primary-50 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">Upload photos of your property</h4>
      <form className="form-style1" onSubmit={handleFilesSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <PhotoUpload setImages={setImages} />
          </div>
        </div>

        <div className="row">
          <h4 className="title fz17 mb30">
            Upload videos of your property
          </h4>
          <div className="col-lg-12">
            <VideoUpload setVideos={setVideos} />
          </div>
        </div>

        <div className="col-sm-12">
          <div className="mb20 mt30">
            <label className="heading-color ff-heading fw600 mb30">
              Select the Location on the map or fill Latitude and Longitude field
            </label>
            <MapPin setLocations={setLocations} locations={locations} />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={locations.latitude || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Latitude"
              />
            </div>
          </div>

          <div className="col-sm-6 col-xl-4">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={locations.longitude || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Longitude"
              />
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              className={`ud-btn ${saved ? "btn-thm" : "btn-white2"} duration-200 flex`}
            >
              Submit
            </button>
          </div>
        )}
      </form>
      <StatusSnackbar message={snackMessage} state={state} status={status} />
    </div>
  );
};

export default UploadMedia;
