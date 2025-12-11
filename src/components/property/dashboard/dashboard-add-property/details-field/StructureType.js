"use client";
import React from "react";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });


const structureTypeOptions = [
    { value: "Apartments", label: "Apartments" },
    { value: "Bungalow", label: "Bungalow" },
    { value: "Houses", label: "Houses" },
    { value: "Loft", label: "Loft" },
    { value: "Office", label: "Office" },
    { value: "Townhome", label: "Townhome" },
    { value: "Villa", label: "Villa" },
  ];

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#0f8363"
      : isHovered
      ? "#eb675312"
      : isFocused
      ? "#eb675312"
      : undefined,
  }),
};

const StructureType = () => {
  return (
    <div className="col-sm-6 col-xl-4">
      <div className="mb20">
        <label className="heading-color ff-heading fw600 mb10">
          Structure type
        </label>
        <div className="location-area">
          <Select
            key={Date.now()}
            styles={customStyles}
            className="select-custom pl-0"
            classNamePrefix="select"
            required
            defaultValue={""}
            name="structureType"
            options={structureTypeOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default StructureType;
