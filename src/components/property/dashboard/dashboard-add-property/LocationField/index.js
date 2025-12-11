// import React, { useState } from "react";
// import SelectMulitField from "./SelectMulitField";
// import Map from "./Map";

// const LocationField = ({setData}) => {
//   const [saved, setSaved] = useState(false)
//   const [location, setLocation] = useState({
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

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocation((prevLocation) => ({
//       ...prevLocation,
//       [name]: value,
//     }));
//   };

//   const handleLocationSubmit =(e) =>{
//     e.preventDefault();
//     setData((prev)=>({...prev, location}))
//     setSaved(true)

//   }
//   return (
//     <form className="form-style1" onSubmit={handleLocationSubmit} >
//       <div className="row">
//         <div className="col-sm-12">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Address
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               name="address"
//               value={location.address}
//               onChange={handleChange}
//               placeholder="Property Address"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">Street</label>
//             <input
//               type="text"
//               name="street"
//               value={location.street}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Street"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Building Name
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               name="building_name"
//               value={location.building_name}
//               onChange={handleChange}
//               placeholder="Building Name"
//             />
//           </div>
//         </div>

//         <SelectMulitField location={location} setLocation={setLocation}/>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Neighborhood
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               name="neighborhood"
//               value={location.neighborhood}
//               onChange={handleChange}
//               placeholder="Neighborhood"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Landmark
//             </label>
//             <input
//               type="text"
//               name="landmark"
//               value={location.landmark}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Landmark"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Apartment Number
//             </label>
//             <input
//               type="number"
//               name="apartment_number"
//               value={location.apartment_number}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Apartment Number"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb20">
//             <label className="heading-color ff-heading fw600 mb10">
//               Floor Number
//             </label>
//             <input
//               type="number"
//               name="floor_number"
//               value={location.floor_number}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Floor Number eg 02..."
//             />
//           </div>
//         </div>

//         <div className="col-sm-12">
//           <div className="mb20 mt30">
//             <label className="heading-color ff-heading fw600 mb30">
//               Place the listing pin on the map
//             </label>
//             <Map />
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-sm-6 col-xl-4">
//           <div className="mb30">
//             <label className="heading-color ff-heading fw600 mb10">
//               Latitude
//             </label>
//             <input
//               type="text"
//               name="latitude"
//               value={location.latitude}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Latitude"
//             />
//           </div>
//         </div>

//         <div className="col-sm-6 col-xl-4">
//           <div className="mb30">
//             <label className="heading-color ff-heading fw600 mb10">
//               Longitude
//             </label>
//             <input
//               type="text"
//               name="longitude"
//               value={location.longitude}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Longitude"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-end">
//           <button type="submit" disabled={saved} className={`ud-btn ${saved ? "btn-thm" : "btn-white2"} duration-200 flex`}>
//            {saved?<>Saved Description <i className="fa fa-check-circle rotate-45"></i></>: <> Save Location Details </>}
//           </button>
//         </div>
//     </form>
//   );
// };

// export default LocationField;

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import SelectMultiField from "./SelectMulitField";
import SelectMultiField from "./SelectMulitField";
import Map from "./Map";

const LocationField = ({ onSubmit, isCompleted, isLoading }) => {
  const initialValues = {
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
  };

  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    emirate: Yup.string().required("Emirate is required"),
    latitude: Yup.string(),
    longitude: Yup.string(),
    neighborhood: Yup.string(),
    street: Yup.string(),
    building_name: Yup.string(),
    landmark: Yup.string(),
    apartment_number: Yup.string(),
    floor_number: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          location: {
            country: values.country,
            emirate: values.emirate,
            city: values.city,
            landmark: values.landmark,
            address: values.address,
            latitude: values.latitude,
            longitude: values.longitude,
            neighborhood: values.neighborhood,
            street: values.street,
            building_name: values.building_name,
            apartment_number: values.apartment_number,
            floor_number: values.floor_number,
          },
        };
        await onSubmit(payload);
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
        <Form className="form-style1">
          <div className="row">
            {/* Address */}
            <div className="col-sm-12">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Address
                </label>
                <Field
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Property Address"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Street */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Street
                </label>
                <Field
                  type="text"
                  name="street"
                  className="form-control"
                  placeholder="Street"
                />
                <ErrorMessage
                  name="street"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Building Name */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Building Name
                </label>
                <Field
                  type="text"
                  name="building_name"
                  className="form-control"
                  placeholder="Building Name"
                />
                <ErrorMessage
                  name="building_name"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Custom Location Dropdowns (City, Emirate, Country) */}
            {/* <SelectMulitField location={values} setLocation={handleChange} /> */}
            <SelectMultiField values={values} setFieldValue={setFieldValue} />

            {/* Neighborhood */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Neighborhood
                </label>
                <Field
                  type="text"
                  name="neighborhood"
                  className="form-control"
                  placeholder="Neighborhood"
                />
                <ErrorMessage
                  name="neighborhood"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Landmark */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Landmark
                </label>
                <Field
                  type="text"
                  name="landmark"
                  className="form-control"
                  placeholder="Landmark"
                />
                <ErrorMessage
                  name="landmark"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Apartment Number */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Apartment Number
                </label>
                <Field
                  type="text"
                  name="apartment_number"
                  className="form-control"
                  placeholder="Apartment Number"
                />
                <ErrorMessage
                  name="apartment_number"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Floor Number */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Floor Number
                </label>
                <Field
                  type="text"
                  name="floor_number"
                  className="form-control"
                  placeholder="Floor Number"
                />
                <ErrorMessage
                  name="floor_number"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Map */}
            <div className="col-sm-12">
              <div className="mb20 mt30">
                <label className="heading-color ff-heading fw600 mb30">
                  Place the listing pin on the map
                </label>
                <Map />
              </div>
            </div>

            {/* Latitude */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb30">
                <label className="heading-color ff-heading fw600 mb10">
                  Latitude
                </label>
                <Field
                  type="text"
                  name="latitude"
                  className="form-control"
                  placeholder="Latitude"
                />
                <ErrorMessage
                  name="latitude"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Longitude */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb30">
                <label className="heading-color ff-heading fw600 mb10">
                  Longitude
                </label>
                <Field
                  type="text"
                  name="longitude"
                  className="form-control"
                  placeholder="Longitude"
                />
                <ErrorMessage
                  name="longitude"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCompleted || isSubmitting || isLoading}
              className={`ud-btn ${
                isCompleted ? "btn-thm" : "btn-white2"
              } duration-200 flex`}
            >
              {isSubmitting || isLoading ? (
                "Saving..."
              ) : isCompleted ? (
                <>
                  Saved Location{" "}
                  <i className="fa fa-check-circle rotate-45"></i>
                </>
              ) : (
                <>Save Location Details</>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LocationField;
