'use client'

const Bedroom = ({filterFunctions}) => {
  const bedOptions = [
    { id: "any", label: "Any", value: "" },
    { id: "studio", label: "Studio", value: "studio" },
    { id: "1", label: "1", value: "1" },
    { id: "2", label: "2", value: "2" },
    { id: "3", label: "3", value: "3" },
    { id: "4", label: "4", value: "4" },
    { id: "5", label: "5", value: "5" },
    { id: "6", label: "6", value: "6" },
    { id: "7", label: "7", value: "7" },
    { id: "8", label: "8", value: "8" },
    { id: "8plus", label: "8+", value: "8+" },
  ];

  return (
    <>
      {bedOptions.map((option, index) => (
        <div className="selection" key={option.id}>
          <input
            id={`bedroom-two-${option.id}`}
            type="radio"
            onChange={(e)=>filterFunctions?.handlebedrooms(option.value)}
            checked={filterFunctions?.bedrooms == option.value}
          />
          <label htmlFor={`bedroom-two-${option.id}`}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bedroom;
