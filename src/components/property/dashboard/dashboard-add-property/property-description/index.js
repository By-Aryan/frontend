// "use client";
// import dynamic from "next/dynamic";
// import { useState } from "react";

// const Select = dynamic(() => import("react-select"), { ssr: false });

// const PropertyDescription = ({ setData,  }) => {
//   const [saved, setSaved] = useState(false)
//   const [description, setDescription] = useState({
//     name: "",
//     title: "",
//     description: "",
//     price: "",
//     currency: null,
//   });

//   const currencyOptions = [
//     { value: "USD", label: "Dollar" },
//     { value: "AED", label: "Dirham" },
//   ];

//   const customStyles = {
//     option: (styles, { isFocused, isSelected }) => ({
//       ...styles,
//       backgroundColor: isSelected
//       ? "#0f8363"
//       : isFocused
//       ? "#ebfff9"
//         : undefined,
//     }),
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSaved(false)
//     setDescription((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (selectedOption) => {
//     setDescription((prev) => ({ ...prev, currency: selectedOption }));
//     setSaved(false)
//   };

//   const handleDescriptionSubmit = (e) => {
//     console.log("🚀 ~ handleDescriptionSubmit ~ e:", e)
//     e.preventDefault();
//     const currency = description.currency.value
//     setData((prev)=>({...prev, ...description, currency}))
//     setSaved(true)
//   };

//   return (
//     <>
//       <form className="form-style1" onSubmit={handleDescriptionSubmit}>
//         <div className="row">
//           {/* Property Name */}
//           <div className="col-sm-6 ">
//             <div className="mb20">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Property Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={description.name}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Property Name"
//                 required
//               />
//             </div>
//           </div>

//           {/* Property Title */}
//           <div className="col-sm-6">
//             <div className="mb20">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Property Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={description.title}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Property Title"
//                 required
//               />
//             </div>
//           </div>

//           {/* Price */}
//           <div className="col-sm-6 col-xl-4">
//             <div className="mb30">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Price in {description?.currency?.value}
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={description.price}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Property Price"
//               />
//             </div>
//           </div>

//           {/* Currency Select */}
//           <div className="col-sm-6 col-xl-4">
//             <div className="mb20">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Currency
//               </label>
//               <div className="location-area">
//                 <Select
//                   name="currency"
//                   value={description.currency} // Select expects an object
//                   onChange={handleSelectChange}
//                   options={currencyOptions}
//                   styles={customStyles}
//                   className="select-custom pl-0"
//                   classNamePrefix="select"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="col-sm-12">
//             <div className="mb20">
//               <label className="heading-color ff-heading fw600 mb10">
//                 Description <span className="text-gray-500">(optional)</span>
//               </label>
//               <textarea
//                 cols={30}
//                 rows={5}
//                 name="description"
//                 value={description.description}
//                 onChange={handleInputChange}
//                 placeholder="Property Description"
//                 required
//               />
//             </div>
//           </div>

//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button type="submit" disabled={saved} className={`ud-btn ${saved ? "btn-thm" : "btn-white2"} duration-200 flex`}>
//            {saved?<>Saved Description <i className="fa fa-check-circle rotate-45"></i></>: <> Save Description </>}
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default PropertyDescription;

"use client";
import dynamic from "next/dynamic";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Select = dynamic(() => import("react-select"), { ssr: false });

const PropertyDescription = ({ onSubmit, isCompleted, isLoading }) => {
  const currencyOptions = [
    { value: "USD", label: "Dollar" },
    { value: "AED", label: "Dirham" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#0f8363"
        : isFocused
        ? "#ebfff9"
        : undefined,
    }),
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Property name is required"),
    title: Yup.string().required("Property title is required"),
    description: Yup.string(),
    price: Yup.number().positive("Price must be positive"),
    currency: Yup.object().nullable().required("Currency is required"),
  });

  const initialValues = {
    name: "",
    title: "",
    description: "",
    price: "",
    currency: null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const submitData = {
          name: values.name,
          title: values.title,
          description: values.description,
          price: parseInt(values.price),
          currency: values.currency.value,
        };
        
        await onSubmit(submitData);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isSubmitting, handleChange, handleBlur }) => (
        <Form className="form-style1">
          <div className="row">
            {/* Property Name */}
            <div className="col-sm-6">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Property Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Property Name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>
            </div>

            {/* Property Title */}
            <div className="col-sm-6">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Property Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Property Title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500" />
              </div>
            </div>

            {/* Price */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb30">
                <label className="heading-color ff-heading fw600 mb10">
                  Price in {values?.currency?.value}
                </label>
                <Field
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="Property Price"
                />
                <ErrorMessage name="price" component="div" className="text-red-500" />
              </div>
            </div>

            {/* Currency Select */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Currency
                </label>
                <div className="location-area">
                  <Select
                    name="currency"
                    value={values.currency}
                    onChange={(selectedOption) => setFieldValue("currency", selectedOption)}
                    options={currencyOptions}
                    styles={customStyles}
                    className="select-custom pl-0"
                    classNamePrefix="select"
                  />
                  <ErrorMessage name="currency" component="div" className="text-red-500" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-sm-12">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Description <span className="text-gray-500">(optional)</span>
                </label>
                <Field
                  as="textarea"
                  cols={30}
                  rows={5}
                  name="description"
                  placeholder="Property Description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isCompleted || isLoading || isSubmitting} 
              className={`ud-btn ${isCompleted ? "btn-thm" : "btn-white2"} duration-200 flex`}
            >
              {isLoading || isSubmitting ? (
                "Saving..."
              ) : isCompleted ? (
                <>Saved Description <i className="fa fa-check-circle rotate-45"></i></>
              ) : (
                <>Save Description</>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyDescription;