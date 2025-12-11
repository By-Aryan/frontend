const Bedroom = ({ filterFunctions }) => {
  const bedOptions = [
    { id: "xany", label: "Any", value: "any" },
    { id: "xstudio", label: "Studio", value: "studio" },
    { id: "xone", label: "1", value: "1" },
    { id: "xtwo", label: "2", value: "2" },
    { id: "xthree", label: "3", value: "3" },
    { id: "xfour", label: "4", value: "4" },
    { id: "xfive", label: "5", value: "5" },
    { id: "xsix", label: "6", value: "6" },
    { id: "xseven", label: "7", value: "7" },
    { id: "xeightplus", label: "8+", value: "8+" },
  ];

  return (
    <>
      {bedOptions.map((option, index) => (
        <div className="selection" key={option.id}>
          <input
            id={option.id}
            name="xbeds"
            type="radio"
            checked={filterFunctions?.bedrooms === option.value}
            onChange={() => filterFunctions?.handlebedrooms(option.value)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bedroom;
