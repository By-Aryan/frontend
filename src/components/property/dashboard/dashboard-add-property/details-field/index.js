"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import dynamic from "next/dynamic";
import { data } from "autoprefixer";

const Select = dynamic(() => import("react-select"), { ssr: false });

const structureTypeOptions = [
  { value: "Apartments", label: "Apartments" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Houses", label: "Houses" },
  { value: "Loft", label: "Loft" },
  { value: "Office", label: "Office" },
  { value: "Townhome", label: "Townhome" },
  { value: "Villa", label: "Villa" },
];

const purposeOptions = [
  { value: "Rent", label: "Rent" },
  { value: "Sell", label: "Sell" },
];

const parkingOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const completionOptions = [
  { value: "completed", label: "Completed" },
  { value: "underConstruction", label: "Under Construction" },
];

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

const DetailsFiled = ({ onSubmit, isCompleted, isLoading }) => {
  return (
    <Formik
      initialValues={{
        property_type: "",
        purpose: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        completion_status: "",
        furnishing: "",
        ownership: "",
        usage: "",
        parking_available: "",
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          details: {
            property_type: values.property_type,
            purpose: values.purpose,
            bedrooms: values.bedrooms,
            bathrooms: values.bathrooms,
            size: values.size,
            completion_status: values.completion_status,
            furnishing: values.furnishing,
            ownership: values.ownership,
            usage: values.usage,
            parking_available: values.parking_available === "true" ? true : false,
          },
        };
        await onSubmit(payload);
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, setFieldValue, isSubmitting }) => (
        <Form className="form-style1">
          <div className="row">
            {/* Property Type */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Property Type
                </label>
                <Select
                  name="property_type"
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  options={structureTypeOptions}
                  value={structureTypeOptions.find(
                    (opt) => opt.value === values.property_type
                  )}
                  onChange={(option) =>
                    setFieldValue("property_type", option?.value || "")
                  }
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Purpose
                </label>
                <Select
                  name="purpose"
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  options={purposeOptions}
                  value={purposeOptions.find(
                    (opt) => opt.value === values.purpose
                  )}
                  onChange={(option) =>
                    setFieldValue("purpose", option?.value || "")
                  }
                />
              </div>
            </div>

            {/* Size */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Size (sqft)
                </label>
                <Field
                  type="number"
                  name="size"
                  placeholder="e.g., 1000"
                  className="form-control"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Bedrooms
                </label>
                <Field
                  type="number"
                  name="bedrooms"
                  placeholder="Number of Bedrooms"
                  className="form-control"
                />
              </div>
            </div>

            {/* Bathrooms */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Bathrooms
                </label>
                <Field
                  type="number"
                  name="bathrooms"
                  placeholder="Number of Bathrooms"
                  className="form-control"
                />
              </div>
            </div>

            {/* Completion Status */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Completion Status
                </label>
                <Select
                  name="completion_status"
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  options={completionOptions}
                  value={completionOptions.find(
                    (opt) => opt.value === values.completion_status
                  )}
                  onChange={(option) =>
                    setFieldValue("completion_status", option?.value || "")
                  }
                />
              </div>
            </div>

            {/* Furnishing */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Furnishing
                </label>
                <Field
                  type="text"
                  name="furnishing"
                  className="form-control"
                  placeholder="e.g., Furnished"
                />
              </div>
            </div>

            {/* Parking Available */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Parking Available
                </label>
                <Select
                  name="parking_available"
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  options={parkingOptions}
                  value={parkingOptions.find(
                    (opt) => opt.value === values.parking_available
                  )}
                  onChange={(option) =>
                    setFieldValue("parking_available", option?.value || "")
                  }
                />
              </div>
            </div>

            {/* Ownership */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Ownership
                </label>
                <Field
                  type="text"
                  name="ownership"
                  className="form-control"
                  placeholder="e.g., Freehold"
                />
              </div>
            </div>

            {/* Usage */}
            <div className="col-sm-6 col-xl-4">
              <div className="mb20">
                <label className="heading-color ff-heading fw600 mb10">
                  Usage
                </label>
                <Field
                  type="text"
                  name="usage"
                  className="form-control"
                  placeholder="e.g., Residential"
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
              } duration-200 flex items-center gap-2`}
            >
              {isSubmitting || isLoading ? (
                "Saving..."
              ) : isCompleted ? (
                <>
                  Saved Details <i className="fa fa-check-circle rotate-45"></i>
                </>
              ) : (
                <>Save Property Details</>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DetailsFiled;
