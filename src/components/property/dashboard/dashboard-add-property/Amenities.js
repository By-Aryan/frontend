"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";

const amenitiesData = {
  column1: [
    { label: "Attic" },
    { label: "Basketball court" },
    { label: "Air Conditioning" },
    { label: "Lawn" },
    { label: "Swimming Pool" },
    { label: "Barbeque" },
    { label: "Microwave" },
  ],
  column2: [
    { label: "TV Cable" },
    { label: "Dryer" },
    { label: "Outdoor Shower" },
    { label: "Washer" },
    { label: "Gym" },
    { label: "Ocean view" },
    { label: "Private space" },
  ],
  column3: [
    { label: "Lake view" },
    { label: "Wine cellar" },
    { label: "Front yard" },
    { label: "Refrigerator" },
    { label: "WiFi" },
    { label: "Laundry" },
    { label: "Sauna" },
  ],
};

const Amenities = ({ onSubmit, isCompleted, isLoading }) => {
  const [saved, setSaved] = useState(false);

  return (
    <Formik
      initialValues={{
        selected: [],
        others: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        const trimmedOthers = values.others.trim();

        const payload = {
          amenities: {
            selected: values.selected, // ✅ this was missing
            others: trimmedOthers,
          },
        };

        console.log("Payload:", payload); // ✅ you'll now see the correct structure
        onSubmit(payload);
        setSaved(true);
        setSubmitting(false);
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <div className="row">
            {Object.keys(amenitiesData).map((columnKey, index) => (
              <div key={index} className="col-sm-6 col-lg-3 col-xxl-2">
                <div className="checkbox-style1">
                  {amenitiesData[columnKey].map((amenity, amenityIndex) => (
                    <label key={amenityIndex} className="custom_checkbox">
                      {amenity.label}
                      <Field
                        type="checkbox"
                        name="selected"
                        value={amenity.label}
                      />
                      <span className="checkmark" />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="row">
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10 mt50">
                    Other Amenities (Comma separated)
                  </label>
                  <Field
                    as="textarea"
                    name="others"
                    rows={5}
                    className="form-control"
                    placeholder="Community Park, Elevator, Pet Zone"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saved || isLoading}
                className={`ud-btn ${
                  saved || isCompleted ? "btn-thm" : "btn-white2"
                } duration-200 flex`}
              >
                {isLoading ? (
                  "Saving..."
                ) : saved || isCompleted ? (
                  <>
                    Saved <i className="fa fa-check-circle rotate-45"></i>
                  </>
                ) : (
                  <>Save Amenities</>
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Amenities;
