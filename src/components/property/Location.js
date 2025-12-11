"use client";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });


const Location = ({filterFunctions}) => {
  const locationOptions = [
    { value: "", label: "All Cities" },
    { value: "Dubai", label: "Dubai" },
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Marina Gate", label: "Marina Gate" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : isFocused
          ? "#eb675312"
          : undefined,
      };
    },
  };

  return (
    <Select
      key={Date.now()}
      defaultValue={locationOptions[0]}
      name="colors"
      styles={customStyles}
      options={locationOptions}
      value={locationOptions.find(option => option.value === filterFunctions.location) || locationOptions[0]}
      className="select-custom"
      classNamePrefix="select"
      required
      onChange={(e)=>filterFunctions?.handlelocation(e.value)}
    />
  );
};

export default Location;
