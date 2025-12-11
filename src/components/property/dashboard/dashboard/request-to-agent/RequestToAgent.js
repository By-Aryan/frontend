"use client";
import { usePost } from "@/hooks/usePost";
import { Box, Snackbar } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const Select = dynamic(() => import('react-select'), { ssr: false });

function RequestAgent() {

    const [formData, setFormData] = useState({
        propertyName: "",
        category: null,
        area: "",
        purpose: null,
        location: "",
        address: "",
      });
     const [errors, setErrors] = useState({});
     const [state, setState] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
      });
     const mutation = usePost("/property/create");
    
    const catergoryOptions = [
        { value: "Edit", label: "Edit" },
        { value: "Delete", label: "Delete" },
      ];


    const customStyles = {
        option: (styles, { isFocused, isSelected, isHovered }) => {
          return {
            ...styles,
            backgroundColor: isSelected
              ? "#0f8363"
              : isHovered
              ? "#eb675312"
              : isFocused
              ? "#eb675312"
              : undefined,
          };
        },
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: value ? "" : "This field is required" }));
      };
    
      const handleSelectChange = (selectedOption, name) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption }));
        setErrors((prev) => ({ ...prev, [name]: selectedOption ? "" : "This field is required" }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
    
        Object.keys(formData).forEach((key) => {
          if (!formData[key]) {
            newErrors[key] = "This field is required";
          }
        });
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
          console.log("Form submitted", formData);
          mutation.mutate(
            formData ,
            {
              onSuccess: (details) => {
                setState({ ...state, open: true });
              },
              onError: (error) => {
                console.error("Error creating user", error);
                setError(error.response.data.error.message)
              },
            }
          );
        }
      };
      const handleClose = () => {
        setState({ ...state, open: false });
      };
  return (
    <>
      <form className="form-style1 p-3" onSubmit={handleSubmit}>
        <div className="row">
          {/* End .col */}

          <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Select Category
            </label>
            <div className="location-area">
              <Select
                key={Date.now()}
                defaultValue={formData.category}
                name="colors"
                options={catergoryOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                required
                onChange={(selected) => handleSelectChange(selected, "category")}
              />
            </div>
          </div>
        </div>
          {/* End .col */}


          <div className="col-md-12">
            <div className="mb10">
              <label className="heading-color ff-heading fw600 mb10">
                Reason
              </label>
              <textarea
                cols={20}
                rows={2}
                maxLength={500}
                placeholder="Reason"
                defaultValue={""}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-12">
            <div className="text-end">
              <button type="submit" className="ud-btn btn-dark">
                Request
                <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          </div>
          {/* End .col */}
        </div>
      </form>

      <Box>
        <Snackbar
          anchorOrigin={{
            vertical: state.vertical,
            horizontal: state.horizontal,
          }}
          open={state.open}
          onClose={handleClose}
          key={state.vertical + state.horizontal}
          autoHideDuration={5000}
          message={
            <div>
              Request Send Successfully{" "}
              <i className="fa fa-check-circle"></i>
            </div>
          }
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "#068662",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </>
  );
}

export default RequestAgent;
