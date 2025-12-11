"use client";
import React from "react";
import { Formik, Form, Field } from "formik";

const AdditionalDetailsFields = ({ onSubmit, isCompleted, isLoading }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        year_of_completion: "",
        total_floors: "",
        total_building_area: "",
        offices: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        const payload = {
          additional_details: {
            name: values.name,
            year_of_completion: Number(values.year_of_completion),
            total_floors: Number(values.total_floors),
            total_building_area: Number(values.total_building_area),
            offices: Number(values.offices),
          },
        };
        onSubmit(payload);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form-style1">
          <div className="row mt10">
            <h5 className="mb15">Building Info</h5>

            <div className="col-sm-6 col-xl-4 mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
              />
            </div>

            <div className="col-sm-6 col-xl-4 mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Year of Completion
              </label>
              <Field
                type="number"
                name="year_of_completion"
                className="form-control"
                placeholder="eg... 2023"
              />
            </div>

            <div className="col-sm-6 col-xl-4 mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Total Floors
              </label>
              <Field
                type="number"
                name="total_floors"
                className="form-control"
                placeholder="eg... 10"
              />
            </div>

            <div className="col-sm-6 col-xl-4 mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Total Building Area (sqft)
              </label>
              <Field
                type="number"
                name="total_building_area"
                className="form-control"
                placeholder="eg... 500 sqft"
              />
            </div>

            <div className="col-sm-6 col-xl-4 mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Offices
              </label>
              <Field
                type="number"
                name="offices"
                className="form-control"
                placeholder="Number of offices"
              />
            </div>
          </div>

          <div className="flex justify-end mt20">
            <button
              type="submit"
              disabled={isCompleted || isLoading || isSubmitting}
              className={`ud-btn ${
                isCompleted ? "btn-thm" : "btn-white2"
              } duration-200 flex`}
            >
              {isLoading || isSubmitting ? (
                "Saving..."
              ) : isCompleted ? (
                <>
                  Saved <i className="fa fa-check-circle rotate-45"></i>
                </>
              ) : (
                <>Save Building Info</>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AdditionalDetailsFields;
