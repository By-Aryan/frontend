"use client";
import React from "react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

const options = {
  emirate: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  city: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
  country: ["UAE"],
};

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#0f8363" : isFocused ? "#ebfff9" : undefined,
  }),
};

const SelectMultiField = ({ values = {}, setFieldValue = () => {} }) => {
  return (
    <>
      {Object.keys(options).map((key) => (
        <div className="col-sm-6 col-xl-4" key={key}>
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <div className="location-area">
              <Select
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                name={key}
                options={options[key].map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  values?.[key]
                    ? { value: values[key], label: values[key] }
                    : null
                }
                onChange={(selectedOption) =>
                  setFieldValue(key, selectedOption?.value || "")
                }
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};


export default SelectMultiField;