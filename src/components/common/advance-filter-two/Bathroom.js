'use client'

const Bathroom = ({filterFunctions}) => {
  const bathOptions = [
    { id: "any", label: "Any", value: "" },
    { id: "1", label: "1+", value: "1" },
    { id: "2", label: "2+", value: "2" },
    { id: "3", label: "3+", value: "3" },
    { id: "4", label: "4+", value: "4" },
    { id: "5", label: "5+", value: "5" },
    { id: "6", label: "6+", value: "6" },
  ];

  return (
    <>
      {bathOptions.map((option, index) => (
        <div className="selection" key={option.id}>
          <input
            id={`bathroom-two-${option.id}`}
            type="radio"
            checked={filterFunctions?.bathrooms == option.value}
            onChange={()=>filterFunctions?.handlebathrooms(option.value)}
          />
          <label htmlFor={`bathroom-two-${option.id}`}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bathroom;
