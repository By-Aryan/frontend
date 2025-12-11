"use client";
import useAxiosPost from "@/hooks/useAxiosPost";
import { usePost } from "@/hooks/usePost";
import { Box, Snackbar } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Select = dynamic(() => import('react-select'), { ssr: false });

function RequestToAddNewProperty() {

    const [formData, setFormData] = useState({
        propertyName: "",
        propertyType: null,
        area: "",
        purpose: null,
        location: "",
        address: "",
        reason : ""
      });
     const [documents, setDocuments] = useState([]);
     const [errors, setErrors] = useState({});
     const [state, setState] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
      });
      const router = useRouter()
     
    
    const catergoryOptions = [
        { value: "Apartment", label: "Apartment" },
        { value: "Bungalow", label: "Bungalow" },
        { value: "Villa", label: "Villa" },
        { value: "House", label: "House" },
        { value: "Loft", label: "Loft" },
        { value: "Office", label: "Office" },
        { value: "Townhome", label: "Townhome" },
      ];
    const PurposeOptions = [
        { value: "Sale", label: "Sell" },
        { value: "Rent", label: "Rent" },
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

      const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setDocuments(files);
      };

      const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
      };

      const mutation = useAxiosPost("/requestproperty/create", {
        onSuccess: (data) => {
          console.log("Request created successfully:", data);
          setState((prev) =>({...prev, open: true}))
          router.push("/dashboard/seller/my-requests")
        },
        onError: (error) => {
          console.error("Error creating property:", error);
        },
      })
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
    
        Object.keys(formData).forEach((key) => {
          if (!formData[key]) {
            newErrors[key] = "This field is required";
          }
        });
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
          const propertyType = formData.propertyType.value
          const purpose = formData.purpose.value
          console.log(propertyType, purpose)
          
          // Create FormData for file upload
          const submitData = new FormData();
          submitData.append('propertyName', formData.propertyName);
          submitData.append('propertyType', propertyType);
          submitData.append('purpose', purpose);
          submitData.append('area', formData.area);
          submitData.append('location', formData.location);
          submitData.append('address', formData.address);
          submitData.append('reasonForSaleOrRent', formData.reason);
          
          // Append documents
          documents.forEach((file) => {
            submitData.append('documents', file);
          });

          console.log("Form submitted with documents:", documents.length);

          // Use fetch instead of mutation for FormData
          try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requestproperty/create`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: submitData,
            });

            const data = await response.json();

            if (response.ok) {
              console.log("Request created successfully:", data);
              setState((prev) => ({ ...prev, open: true }));
              router.push("/dashboard/seller/my-requests");
            } else {
              console.error("Error creating property:", data);
              alert(data.message || "Failed to create property request");
            }
          } catch (error) {
            console.error("Error creating property:", error);
            alert("Failed to create property request");
          }
        }
      };
      const handleClose = () => {
        setState({ ...state, open: false });
      };
  return (
    <>
      <form className="form-style1 p-3" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Property Name
              </label>
              <input
                type="text"
                className="form-control"
                name="propertyName"
                placeholder="Property Name"
                value={formData.propertyName}
                onChange={handleChange}
                required
              />
              {errors.propertyName && <p className="text-danger">{errors.propertyName}</p>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Select Category
            </label>
            <div className="location-area">
              <Select
                key={Date.now()}
                defaultValue={formData.propertyType}
                name="propertyType"
                options={catergoryOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                required
                onChange={(selected) => handleSelectChange(selected, "propertyType")}
              />
              {errors.propertyType && <p className="text-danger">{errors.propertyType}</p>}
            </div>
          </div>
        </div>
          {/* End .col */}

          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
              Area in sqft
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="form-control"
                placeholder="Area of Property"
                required
              />
               {errors.area && <p className="text-danger">{errors.area}</p>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Purpose
            </label>
            <div className="location-area">
              <Select
                key={Date.now()}
                defaultValue={formData.purpose}
                name="colors"
                options={PurposeOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                required
                onChange={(selected) => handleSelectChange(selected, "purpose")}
              />
              {errors.purpose && <p className="text-danger">{errors.purpose}</p>}
            </div>
          </div>
        </div>
          

          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Location
              </label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                value={formData.location}
                className="form-control"
                placeholder="Property Location"
                required
              />
              {errors.location && <p className="text-danger">{errors.location}</p>}
            </div>
          </div>

          <div className="col-xl-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                placeholder="Property Address"
                required
              />
              {errors.location && <p className="text-danger">{errors.location}</p>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-12">
            <div className="mb10">
              <label className="heading-color ff-heading fw600 mb10">
                Reason
              </label>
              <textarea
              name="reason"
                cols={20}
                rows={2}
                maxLength={500}
                onChange={handleChange}
                value={formData.reason}
                placeholder="Reason"
                defaultValue={""}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-12">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                Upload Documents (Optional)
              </label>
              <p className="text-muted mb-2" style={{ fontSize: "12px" }}>
                Upload property documents (Title deed, Emirates ID, etc.). Max 10 files, 10MB each.
              </p>
              <input
                type="file"
                className="form-control"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleDocumentChange}
              />
              {documents.length > 0 && (
                <div className="mt-3">
                  <p className="fw-bold">Selected Documents ({documents.length}):</p>
                  <ul className="list-unstyled">
                    {documents.map((file, index) => (
                      <li key={index} className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
                        <span>
                          <i className="fas fa-file-alt me-2"></i>
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeDocument(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

export default RequestToAddNewProperty;
