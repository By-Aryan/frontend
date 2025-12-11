// "use client";
// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import UploadPhotoGallery from "./UploadPhotoGallery";
// import VideoOptionFiled from "./VideoOptionFiled";
// import dynamic from "next/dynamic";
// import useAxiosFetch from "@/hooks/useAxiosFetch";
// import useAxiosPost from "@/hooks/useAxiosPost";

// const Select = dynamic(() => import("react-select"), { ssr: false });

// const UploadMedia = ({
//   onSubmit,
//   isCompleted,
//   isLoading,
//   setDriver,
//   driver,
//   requested_id,
// }) => {
//   const [driversOptions, setDriversOptions] = useState([]);
//   const [images, setImages] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [visitingDate, setVisitingDate] = useState("");
//   const [visitingTime, setVisitingTime] = useState("");
//   const [locationDetails, setLocationDetails] = useState({
//     country: "",
//     emirate: "",
//     city: "",
//     landmark: "",
//     address: "",
//     latitude: "",
//     longitude: "",
//     neighborhood: "",
//     street: "",
//     building_name: "",
//     apartment_number: "",
//     floor_number: "",
//   });
//   const [isDriverLoading, setIsDriverLoading] = useState(false);

//   const virtualTourOptions = [
//     { value: "true", label: "Yes" },
//     { value: "false", label: "No" },
//   ];

//   const {
//     data,
//     error,
//     isLoading: driversLoading,
//     isError,
//   } = useAxiosFetch(`/agents/role/driver`);
//   const {
//     mutate: postDriverData,
//     isLoading: postLoading,
//     error: postError,
//   } = useAxiosPost("/driver/assign-driver");

//   useEffect(() => {
//     if (data) {
//       setDriversOptions(
//         data?.data?.data?.map((driver) => ({
//           value: driver._id,
//           label: driver.fullname,
//         })) || []
//       );
//     }
//   }, [data]);

//   const customStyles = {
//     option: (styles, { isFocused, isSelected, isHovered }) => ({
//       ...styles,
//       backgroundColor: isSelected
//         ? "#0f8363"
//         : isHovered || isFocused
//         ? "#ebfff9"
//         : undefined,
//     }),
//   };

//   const validationSchema = Yup.object({
//     virtual_tour_available: Yup.object().nullable(),
//     // Add other validations as needed
//   });

//   const driverValidationSchema = Yup.object({
//     address: Yup.string().required("Address is required"),
//     city: Yup.string().required("City is required"),
//     visitingDate: Yup.date().required("Visiting date is required"),
//     visitingTime: Yup.string().required("Visiting time is required"),
//   });

//   const handleDriverSelect = (selectedOption) => {
//     setDriver(selectedOption);
//   };

//   const handleRemoveDriver = () => {
//     setDriver(null);
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setLocationDetails((prevLocation) => ({
//       ...prevLocation,
//       [name]: value,
//     }));
//   };

//   const handleSendToServer = async (values) => {
//     if (!driver || !driver.value) {
//       alert("No driver selected");
//       return;
//     }

//     const payload = {
//       driverId: driver.value,
//       propertyId: requested_id,
//       locationDetails: locationDetails,
//       visitingDate: visitingDate,
//       visitingTime: visitingTime,
//     };

//     postDriverData(payload, {
//       onSuccess: async (response) => {
//         console.log("Driver assigned successfully:", response);
//         // Call onSubmit to trigger auto-next step functionality
//         const submitData = {
//           driver_assigned: true,
//           driver_id: driver.value,
//           location_details: locationDetails,
//           visiting_date: visitingDate,
//           visiting_time: visitingTime,
//         };
        
//         try {
//           await onSubmit(submitData);
//         } catch (error) {
//           console.error("Error calling onSubmit:", error);
//         }
//       },
//       onError: (error) => {
//         console.error(
//           "Failed to assign driver:",
//           error.message || "Unknown error"
//         );
//         alert("Failed to assign driver. Please try again.");
//       },
//     });
//   };

//   // Function to clear media after successful API call
//   const clearMediaFiles = () => {
//     setImages([]);
//     setVideos([]);
//   };

//   const handleMediaSubmit = async (values) => {
//     console.log("🚀 ~ handleMediaSubmit ~ values:", values);
//     const submitData = {
//       photos: images, // Use actual uploaded images
//       videos: videos, // Use actual uploaded videos
//       virtual_tour: values.virtual_tour_available?.value === "true",
//     };

//     try {
//       await onSubmit(submitData);
//       // Clear media files after successful submission
//       clearMediaFiles();
//     } catch (error) {
//       console.error("Error submitting media:", error);
//     }
//   };

//   return (
//     <div className="ps-widget bgc-white bdrs12 p30 bg-[#ebfff9] min-h-[70vh] overflow-hidden position-relative">
//       {/* Driver Assignment Section */}
//       <div className="col-12 my-3">
//         <label className="heading-color ff-heading fw600 mb10">
//           Assign to Driver
//         </label>
//         <div className="flex items-center gap-2 mb-4">
//           <Select
//             key={
//               driversOptions.length > 0 ? "drivers-loaded" : "loading-drivers"
//             }
//             defaultValue={driver}
//             name="driver_select"
//             value={driver}
//             options={driversOptions}
//             styles={customStyles}
//             onChange={handleDriverSelect}
//             className="select-custom pl-0 w-full"
//             classNamePrefix="select"
//             placeholder="Select a driver..."
//             isDisabled={driversLoading}
//           />
//           {driver && (
//             <button
//               type="button"
//               onClick={handleRemoveDriver}
//               className="text-gray-500 hover:text-red-500"
//             >
//               <i className="fa fa-times" aria-hidden="true"></i>
//             </button>
//           )}
//         </div>

//         {driver && (
//           <Formik
//             initialValues={{
//               address: locationDetails.address,
//               city: locationDetails.city,
//               visitingDate: visitingDate,
//               visitingTime: visitingTime,
//             }}
//             validationSchema={driverValidationSchema}
//             onSubmit={handleSendToServer}
//             enableReinitialize
//           >
//             {({ values, handleChange, handleBlur, isSubmitting }) => (
//               <Form className="driver-assignment-form mb-4">
//                 <div className="row">
//                   <div className="col-sm-12">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         Address
//                       </label>
//                       <Field
//                         type="text"
//                         className="form-control"
//                         name="address"
//                         placeholder="Property Address"
//                         onChange={(e) => {
//                           handleChange(e);
//                           handleLocationChange(e);
//                         }}
//                       />
//                       <ErrorMessage
//                         name="address"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-6 col-xl-4">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         Street
//                       </label>
//                       <input
//                         type="text"
//                         name="street"
//                         value={locationDetails.street}
//                         onChange={handleLocationChange}
//                         className="form-control"
//                         placeholder="Street"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-6 col-xl-4">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         Building Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="building_name"
//                         value={locationDetails.building_name}
//                         onChange={handleLocationChange}
//                         placeholder="Building Name"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-6 col-xl-4">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         City
//                       </label>
//                       <Field
//                         type="text"
//                         className="form-control"
//                         name="city"
//                         placeholder="City"
//                         onChange={(e) => {
//                           handleChange(e);
//                           handleLocationChange(e);
//                         }}
//                       />
//                       <ErrorMessage
//                         name="city"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-6 col-xl-4">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         Visiting Date
//                       </label>
//                       <Field
//                         type="date"
//                         className="form-control"
//                         name="visitingDate"
//                         min={new Date().toISOString().split("T")[0]}
//                         onChange={(e) => {
//                           handleChange(e);
//                           setVisitingDate(e.target.value);
//                         }}
//                       />
//                       <ErrorMessage
//                         name="visitingDate"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-6 col-xl-4">
//                     <div className="mb20">
//                       <label className="heading-color ff-heading fw600 mb10">
//                         Visiting Time
//                       </label>
//                       <Field
//                         type="time"
//                         className="form-control"
//                         name="visitingTime"
//                         onChange={(e) => {
//                           handleChange(e);
//                           setVisitingTime(e.target.value);
//                         }}
//                       />
//                       <ErrorMessage
//                         name="visitingTime"
//                         component="div"
//                         className="text-red-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-end mt-3">
//                   <button
//                     type="submit"
//                     className="ud-btn btn-thm px-4 py-2 rounded hover:bg-blue-600"
//                     disabled={postLoading || isSubmitting}
//                   >
//                     {postLoading || isSubmitting
//                       ? "Assigning..."
//                       : `Assign ${driver.label}`}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         )}
//       </div>

//       {!driver && (
//         <>
//           <h4 className="title fz17 mb30">OR</h4>
//           <h4 className="title fz17 mb30">Upload photos of your property</h4>
//           <Formik
//             initialValues={{
//               virtual_tour_available: null,
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleMediaSubmit}
//           >
//             {({ values, setFieldValue, isSubmitting }) => (
//               <Form className="form-style1">
//                 <div className="row">
//                   <div className="col-lg-12">
//                     <UploadPhotoGallery 
//                       setImages={setImages} 
//                       clearImages={images.length === 0} // Pass prop to clear component state when needed
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-6 col-xl-4">
//                   <div className="mb20">
//                     <label className="heading-color ff-heading fw600 mb10">
//                       Virtual Tour
//                     </label>
//                     <div className="location-area">
//                       <Select
//                         name="virtual_tour_available"
//                         value={values.virtual_tour_available}
//                         options={virtualTourOptions}
//                         styles={customStyles}
//                         onChange={(selectedOption) =>
//                           setFieldValue(
//                             "virtual_tour_available",
//                             selectedOption
//                           )
//                         }
//                         className="select-custom pl-0"
//                         classNamePrefix="select"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <h4 className="title fz17 mb30">
//                     Upload videos of your property <span>{"(required*)"}</span>
//                   </h4>
//                   <div className="col-lg-12">
//                     <VideoOptionFiled 
//                       setVideos={setVideos} 
//                       clearVideos={videos.length === 0} // Pass prop to clear component state when needed
//                     />
//                   </div>
//                 </div>

//                 {images.length !== 0 && videos.length !== 0 && (
//                   <div className="d-flex justify-content-end mt-4">
//                     <button
//                       type="submit"
//                       disabled={isCompleted || isLoading || isSubmitting}
//                       className={`ud-btn ${
//                         isCompleted ? "btn-thm" : "btn-white2"
//                       } px-4 py-2 d-flex align-items-center gap-2`}
//                     >
//                       {isLoading || isSubmitting ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                           Saving...
//                         </>
//                       ) : isCompleted ? (
//                         <>
//                           Files Saved
//                           <i className="fa fa-check-circle ms-2"></i>
//                         </>
//                       ) : (
//                         <>Save Files</>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </Form>
//             )}
//           </Formik>
//         </>
//       )}
//     </div>
//   );
// };

// export default UploadMedia;
"use client";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import UploadPhotoGallery from "./UploadPhotoGallery";
import VideoOptionFiled from "./VideoOptionFiled";

const Select = dynamic(() => import("react-select"), { ssr: false });

const UploadMedia = ({
  onSubmit,
  isCompleted,
  isLoading,
  setDriver,
  driver,
  requested_id,
  onNextStep, // New prop to handle next step navigation without API call
}) => {
  const [driversOptions, setDriversOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [visitingDate, setVisitingDate] = useState("");
  const [visitingTime, setVisitingTime] = useState("");
  const [locationDetails, setLocationDetails] = useState({
    country: "",
    emirate: "",
    city: "",
    landmark: "",
    address: "",
    latitude: "",
    longitude: "",
    neighborhood: "",
    street: "",
    building_name: "",
    apartment_number: "",
    floor_number: "",
  });
  const [isDriverLoading, setIsDriverLoading] = useState(false);

  const virtualTourOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const {
    data,
    error,
    isLoading: driversLoading,
    isError,
  } = useAxiosFetch(`/agents/role/driver`);
  const {
    mutate: postDriverData,
    isLoading: postLoading,
    error: postError,
  } = useAxiosPost("/driver/assign-driver");

  useEffect(() => {
    if (data) {
      setDriversOptions(
        data?.data?.data?.map((driver) => ({
          value: driver._id,
          label: driver.fullname,
        })) || []
      );
    }
  }, [data]);

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#0f8363"
        : isHovered || isFocused
        ? "#ebfff9"
        : undefined,
    }),
  };

  const validationSchema = Yup.object({
    virtual_tour_available: Yup.object().nullable(),
    // Add other validations as needed
  });

  const driverValidationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    visitingDate: Yup.date().required("Visiting date is required"),
    visitingTime: Yup.string().required("Visiting time is required"),
  });

  const handleDriverSelect = (selectedOption) => {
    setDriver(selectedOption);
  };

  const handleRemoveDriver = () => {
    setDriver(null);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationDetails((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  const handleSendToServer = async (values) => {
    if (!driver || !driver.value) {
      alert("No driver selected");
      return;
    }

    const payload = {
      driverId: driver.value,
      propertyId: requested_id,
      locationDetails: locationDetails,
      visitingDate: visitingDate,
      visitingTime: visitingTime,
    };

    postDriverData(payload, {
      onSuccess: async (response) => {
        console.log("Driver assigned successfully:", response);
        
        // Just move to next step without calling property creation API
        if (onNextStep) {
          onNextStep(); // Call the next step handler directly
        }
      },
      onError: (error) => {
        console.error(
          "Failed to assign driver:",
          error.message || "Unknown error"
        );
        alert("Failed to assign driver. Please try again.");
      },
    });
  };

  // Function to clear media after successful API call
  const clearMediaFiles = () => {
    setImages([]);
    setVideos([]);
  };

  const handleMediaSubmit = async (values) => {
    console.log("🚀 ~ handleMediaSubmit ~ values:", values);
    const submitData = {
      photos: images, // Use actual uploaded images
      videos: videos, // Use actual uploaded videos
      virtual_tour: values.virtual_tour_available?.value === "true",
    };

    try {
      await onSubmit(submitData);
      // Clear media files after successful submission
      clearMediaFiles();
    } catch (error) {
      console.error("Error submitting media:", error);
    }
  };

  return (
    <div className="ps-widget bgc-white bdrs12 p30 bg-primary-50 min-h-[70vh] overflow-hidden position-relative">
      {/* Driver Assignment Section */}
      <div className="col-12 my-3">
        <label className="heading-color ff-heading fw600 mb10">
          Assign to Driver
        </label>
        <div className="flex items-center gap-2 mb-4">
          <Select
            key={
              driversOptions.length > 0 ? "drivers-loaded" : "loading-drivers"
            }
            defaultValue={driver}
            name="driver_select"
            value={driver}
            options={driversOptions}
            styles={customStyles}
            onChange={handleDriverSelect}
            className="select-custom pl-0 w-full"
            classNamePrefix="select"
            placeholder="Select a driver..."
            isDisabled={driversLoading}
          />
          {driver && (
            <button
              type="button"
              onClick={handleRemoveDriver}
              className="text-gray-500 hover:text-red-500"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          )}
        </div>

        {driver && (
          <Formik
            initialValues={{
              address: locationDetails.address,
              city: locationDetails.city,
              visitingDate: visitingDate,
              visitingTime: visitingTime,
            }}
            validationSchema={driverValidationSchema}
            onSubmit={handleSendToServer}
            enableReinitialize
          >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
              <Form className="driver-assignment-form mb-4">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        Address
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Property Address"
                        onChange={(e) => {
                          handleChange(e);
                          handleLocationChange(e);
                        }}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-4">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={locationDetails.street}
                        onChange={handleLocationChange}
                        className="form-control"
                        placeholder="Street"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-4">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        Building Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="building_name"
                        value={locationDetails.building_name}
                        onChange={handleLocationChange}
                        placeholder="Building Name"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-4">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        City
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        name="city"
                        placeholder="City"
                        onChange={(e) => {
                          handleChange(e);
                          handleLocationChange(e);
                        }}
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-4">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        Visiting Date
                      </label>
                      <Field
                        type="date"
                        className="form-control"
                        name="visitingDate"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          handleChange(e);
                          setVisitingDate(e.target.value);
                        }}
                      />
                      <ErrorMessage
                        name="visitingDate"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-4">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">
                        Visiting Time
                      </label>
                      <Field
                        type="time"
                        className="form-control"
                        name="visitingTime"
                        onChange={(e) => {
                          handleChange(e);
                          setVisitingTime(e.target.value);
                        }}
                      />
                      <ErrorMessage
                        name="visitingTime"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="ud-btn btn-thm px-4 py-2 rounded hover:bg-blue-600"
                    disabled={postLoading || isSubmitting}
                  >
                    {postLoading || isSubmitting
                      ? "Assigning..."
                      : `Assign ${driver.label}`}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>

      {!driver && (
        <>
          <h4 className="title fz17 mb30">OR</h4>
          <h4 className="title fz17 mb30">Upload photos of your property</h4>
          <Formik
            initialValues={{
              virtual_tour_available: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleMediaSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="form-style1">
                <div className="row">
                  <div className="col-lg-12">
                    <UploadPhotoGallery 
                      setImages={setImages} 
                      clearImages={images.length === 0} // Pass prop to clear component state when needed
                    />
                  </div>
                </div>

                <div className="col-sm-6 col-xl-4">
                  <div className="mb20">
                    <label className="heading-color ff-heading fw600 mb10">
                      Virtual Tour
                    </label>
                    <div className="location-area">
                      <Select
                        name="virtual_tour_available"
                        value={values.virtual_tour_available}
                        options={virtualTourOptions}
                        styles={customStyles}
                        onChange={(selectedOption) =>
                          setFieldValue(
                            "virtual_tour_available",
                            selectedOption
                          )
                        }
                        className="select-custom pl-0"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <h4 className="title fz17 mb30">
                    Upload videos of your property <span>{"(optional)"}</span>
                  </h4>
                  <div className="col-lg-12">
                    <VideoOptionFiled 
                      setVideos={setVideos} 
                      clearVideos={videos.length === 0} // Pass prop to clear component state when needed
                    />
                  </div>
                </div>

                {images.length !== 0 && (
                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      disabled={isCompleted || isLoading || isSubmitting}
                      className={`ud-btn ${
                        isCompleted ? "btn-thm" : "btn-white2"
                      } px-4 py-2 d-flex align-items-center gap-2`}
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : isCompleted ? (
                        <>
                          Files Saved
                          <i className="fa fa-check-circle ms-2"></i>
                        </>
                      ) : (
                        <>Save Files</>
                      )}
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default UploadMedia;