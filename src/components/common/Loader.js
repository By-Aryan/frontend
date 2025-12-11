import React from "react";
import "../../../public/css/Loader.css"; // Import CSS file

const Loader = () => {
    return (
      <svg className="svg-loader justify-self-center" viewBox="25 25 50 50">
        <circle className="svg-circle" cx="50" cy="50" r="20"></circle>
      </svg>
    );
  };

export default Loader;
