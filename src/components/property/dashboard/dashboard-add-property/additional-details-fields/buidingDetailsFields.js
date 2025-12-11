"use client";
import React, { useState } from "react";

const BuildingDetails = ({ setData }) => {
  const [savedDetails, setSavedDetails] = useState(false);
  const [buildingDetails, setBuildingDetails] = useState({
    name: "",
    year_of_completion: "",
    total_floors: "",
    total_building_area: {
      unit: "square feet",
      value: "",
    },
    offices: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuildingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSavedDetails(false);
  };

  const handleBuildingAreaChange = (e) => {
    setBuildingDetails((prev) => ({
      ...prev,
      total_building_area: {
        unit: "square feet",
        value: e.target.value || "",
      },
    }));
    setSavedDetails(false);
  };

  const handleBuildingSubmit = (e) => {
    e.preventDefault();
    setData(buildingDetails);
    setSavedDetails(true);
  };

  return (
    <form className="form-style1" onSubmit={handleBuildingSubmit}>
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Name</label>
            <input
              type="text"
              name="name"
              value={buildingDetails.name}
              className="form-control"
              placeholder="Name"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Year of Completion
            </label>
            <input
              type="number"
              name="year_of_completion"
              value={buildingDetails.year_of_completion}
              className="form-control"
              placeholder="eg... 2023"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Total Floors
            </label>
            <input
              type="number"
              name="total_floors"
              value={buildingDetails.total_floors}
              className="form-control"
              placeholder="eg... 10"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Total Building Area
            </label>
            <input
              type="number"
              value={buildingDetails.total_building_area.value}
              className="form-control"
              placeholder="eg... 500 sqft"
              onChange={handleBuildingAreaChange}
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Offices</label>
            <input
              type="number"
              name="offices"
              value={buildingDetails.offices}
              className="form-control"
              placeholder="Number of offices"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={savedDetails}
          className={`ud-btn ${savedDetails ? "btn-thm" : "btn-white2"} duration-200 flex`}
        >
          {savedDetails ? (
            <>
              Saved <i className="fa fa-check-circle rotate-45"></i>
            </>
          ) : (
            <>Save Building Details</>
          )}
        </button>
      </div>
    </form>
  );
};

export default BuildingDetails;
