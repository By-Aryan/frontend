"use client";

import useAxiosPost from "@/hooks/useAxiosPost";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PropertyTitleDeedUpload from "./fileUploadoptioncompo";

const AskAgentToListProperty = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContactMethod: "email",
    urgency: "normal",
    propertyPDF: null,
    filePath: null,
    existingDocumentPath: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [touched, setTouched] = useState({});

  // Initialize the mutation hook at the component level
  const { mutate, isLoading } = useAxiosPost("/requestproperty/property-listings-by-agent", {
    onSuccess: (data) => {
      console.log("Request created successfully:", data);
      setSubmitSuccess(true);
      setShowNotification(true);
      setIsButtonDisabled(false); // Re-enable button after success
      router.push("/dashboard/seller/my-requests");
    },
    onError: (error) => {
      console.error("Error creating property:", error);
      setSubmitError(error.response?.data?.message || error.message || "An error occurred");
      setIsButtonDisabled(false); // Re-enable button on error
      setSubmitting(false);
    },
  });

  // Validate specific field
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "name":
        if (value.trim() === "") {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === "") {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      
      case "phone":
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (value.trim() === "") {
          error = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          error = "Please enter a valid phone number";
        } else if (value.replace(/[^0-9]/g, "").length < 8) {
          error = "Phone number must have at least 8 digits";
        }
        break;
      
      case "propertyType":
        if (!value) {
          error = "Property type is required";
        }
        break;
      
      case "propertyLocation":
        if (value.trim() === "") {
          error = "Property location is required";
        } else if (value.length < 5) {
          error = "Please enter a more specific location";
        }
        break;

      case "title":
        if (value.trim() === "") {
          error = "Property title is required";
        } else if (value.length < 5) {
          error = "Title must be at least 5 characters";
        }
        break;

      case "propertySize":
        if (value && !/^\d+(\.\d+)?$/.test(value)) {
          error = "Please enter a valid number";
        }
        break;

      case "emiratesId":
      case "passportNumber":
        // No individual validation, as they're validated together
        break;
    }

    return error;
  };

  // Check ID fields together
  const validateIdFields = () => {
    if (!formData.emiratesId && !formData.passportNumber) {
      return "Please provide either Emirates ID or Passport Number";
    }
    
    if (formData.emiratesId && !/^(\d{3}-\d{4}-\d{7}-\d{1}|\d{15}|\d{3}\s\d{4}\s\d{7}\s\d{1})$/.test(formData.emiratesId)) {
      return "Please enter a valid Emirates ID format";
    }
    
    if (formData.passportNumber && formData.passportNumber.length < 6) {
      return "Passport number should be at least 6 characters";
    }
    
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Validate on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    
    if (error) {
      setFormErrors({
        ...formErrors,
        [name]: error
      });
    } else {
      // Clear error if now valid
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }

    // Special case for ID fields
    if (name === "emiratesId" || name === "passportNumber") {
      const idError = validateIdFields();
      if (idError) {
        setFormErrors({
          ...formErrors,
          idValidation: idError
        });
      } else {
        const newErrors = { ...formErrors };
        delete newErrors.idValidation;
        setFormErrors(newErrors);
      }
    }
  };

  // File upload handler - receives file from PropertyTitleDeedUpload component
  const handleFileSelect = (file, existingPath = null) => {
    if (file) {
      // New file selected
      console.log("New file selected:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      setFormData({
        ...formData,
        propertyPDF: file,
        filePath: file.name,
        existingDocumentPath: null
      });

      // Clear error if file is valid
      const newErrors = { ...formErrors };
      delete newErrors.propertyPDF;
      setFormErrors(newErrors);
    } else if (existingPath) {
      // Existing document selected
      console.log("Existing document selected:", existingPath);

      setFormData({
        ...formData,
        propertyPDF: null,
        filePath: null,
        existingDocumentPath: existingPath
      });

      // Clear error
      const newErrors = { ...formErrors };
      delete newErrors.propertyPDF;
      setFormErrors(newErrors);
    } else {
      // File cleared/cancelled
      setFormData({
        ...formData,
        propertyPDF: null,
        filePath: null,
        existingDocumentPath: null
      });
    }
  };

  // Validate all fields before submission
  const validateForm = () => {
    const errors = {};
    
    // Only validate the required simplified form fields
    const requiredFields = ['name', 'email', 'phone', 'preferredContactMethod', 'urgency'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prevent multiple submissions
    if (isButtonDisabled) {
      return;
    }
    
    // Mark all fields as touched for validation
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
  
    // Disable button immediately
    setIsButtonDisabled(true);
    setSubmitting(true);
    
    try {
      // Create FormData object to send to server
      const formDataToSend = new FormData();

      // Add all text fields (exclude file-related fields)
      Object.keys(formData).forEach(key => {
        if (key !== 'propertyPDF' && key !== 'filePath' && key !== 'existingDocumentPath') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add the PDF file if a new file was selected
      if (formData.propertyPDF) {
        formDataToSend.append('propertyPDF', formData.propertyPDF);
        console.log("Appending new PDF file:", formData.propertyPDF.name);
      }

      // Add existing document path if an existing document was selected
      if (formData.existingDocumentPath) {
        formDataToSend.append('existingDocumentPath', formData.existingDocumentPath);
        console.log("Using existing document:", formData.existingDocumentPath);
      }

      console.log("Submitting form data:", {
        ...formData,
        propertyPDF: formData.propertyPDF ? formData.propertyPDF.name : null
      });

      // Use the mutation function from the hook
      mutate(formDataToSend);

    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitError(`Error: ${error.message}`);
      setIsButtonDisabled(false); // Re-enable button on error
      setSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredContactMethod: "email",
      urgency: "normal",
      propertyPDF: null,
      filePath: null,
      existingDocumentPath: null,
    });
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsButtonDisabled(false);
    setFormErrors({});
    setTouched({});
  };

  return (
    <div className="ps-widget p30" style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <h4 className="title mb30 text-center">Agent Listing Request</h4>
            
            {submitSuccess && (
              <div className="alert alert-success mb30">
                Your property listing has been submitted successfully!
              </div>
            )}
            
            {submitError && (
              <div className="alert alert-danger mb30">
                Failed to submit: {submitError}. Please try again.
              </div>
            )}
            
            <form className="form" onSubmit={handleSubmit}>
              <div className="row justify-content-center">
                {/* Contact Information Section */}
                <div className="col-lg-12">
                  <div className="card mb-4">
                    <div className="card-header" style={{background: 'linear-gradient(135deg, #0f8363 0%, #0a6b52 100%)', color: 'white'}}>
                      <h5 className="mb-0" style={{color: 'white'}}>Contact Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Full Name*</label>
                            <input
                              type="text"
                              className={`form-control ${touched.name && formErrors.name ? "is-invalid" : ""}`}
                              name="name"
                              placeholder="Your Name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.name && formErrors.name && (
                              <div className="invalid-feedback">{formErrors.name}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Email*</label>
                            <input
                              type="email"
                              className={`form-control ${touched.email && formErrors.email ? "is-invalid" : ""}`}
                              name="email"
                              placeholder="Your Email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.email && formErrors.email && (
                              <div className="invalid-feedback">{formErrors.email}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Phone Number*</label>
                            <input
                              type="tel"
                              className={`form-control ${touched.phone && formErrors.phone ? "is-invalid" : ""}`}
                              name="phone"
                              placeholder="Your Phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.phone && formErrors.phone && (
                              <div className="invalid-feedback">{formErrors.phone}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-6">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Preferred Contact Method</label>
                            <div className="ui-element">
                              <div className="radio-element">
                                <div className="form-check mb10">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="preferredContactMethod"
                                    id="contactEmail"
                                    value="email"
                                    checked={formData.preferredContactMethod === "email"}
                                    onChange={handleInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="contactEmail">
                                    Email
                                  </label>
                                </div>
                                <div className="form-check mb10">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="preferredContactMethod"
                                    id="contactPhone"
                                    value="phone"
                                    checked={formData.preferredContactMethod === "phone"}
                                    onChange={handleInputChange}
                                  />
                                  <label className="form-check-label" htmlFor="contactPhone">
                                    Phone
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-6">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Urgency Level</label>
                            <select
                              className="form-select"
                              name="urgency"
                              value={formData.urgency}
                              onChange={handleInputChange}
                            >
                              <option value="urgent">Urgent - Need to sell quickly</option>
                              <option value="normal">Normal - Within a few months</option>
                              <option value="relaxed">Relaxed - Just exploring options</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Information Section */}
                {/* <div className="col-lg-12">
                  <div className="card mb-4">
                    <div className="card-header" style={{background: 'linear-gradient(135deg, #0f8363 0%, #0a6b52 100%)', color: 'white'}}>
                      <h5 className="mb-0" style={{color: 'white'}}>Property Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12 mb-3">
                          <p className="text-info mb-0">Please provide either Emirates ID or Passport Number</p>
                          {formErrors.idValidation && (
                            <p className="text-danger mt-1">{formErrors.idValidation}</p>
                          )}
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Emirates ID</label>
                            <input
                              type="text"
                              className={`form-control ${touched.emiratesId && formErrors.emiratesId ? "is-invalid" : ""}`}
                              name="emiratesId"
                              placeholder="XXXX XXXX XXXX XXX"
                              value={formData.emiratesId}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.emiratesId && formErrors.emiratesId && (
                              <div className="invalid-feedback">{formErrors.emiratesId}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Passport Number</label>
                            <input
                              type="text"
                              className={`form-control ${touched.passportNumber && formErrors.passportNumber ? "is-invalid" : ""}`}
                              name="passportNumber"
                              placeholder="XXXX XXXX"
                              value={formData.passportNumber}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.passportNumber && formErrors.passportNumber && (
                              <div className="invalid-feedback">{formErrors.passportNumber}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Property Title*</label>
                            <input
                              type="text"
                              className={`form-control ${touched.title && formErrors.title ? "is-invalid" : ""}`}
                              name="title"
                              placeholder="Property Title (e.g., Luxury Villa with Pool)"
                              required
                              value={formData.title}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.title && formErrors.title && (
                              <div className="invalid-feedback">{formErrors.title}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Property Name</label>
                            <input
                              type="text"
                              className={`form-control ${touched.propertyName && formErrors.propertyName ? "is-invalid" : ""}`}
                              name="propertyName"
                              placeholder="Property Name"
                              value={formData.propertyName}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.propertyName && formErrors.propertyName && (
                              <div className="invalid-feedback">{formErrors.propertyName}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Property Type*</label>
                            <select
                              className={`form-select ${touched.propertyType && formErrors.propertyType ? "is-invalid" : ""}`}
                              name="propertyType"
                              required
                              value={formData.propertyType}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Property Type</option>
                              <option value="apartment">Apartment</option>
                              <option value="house">House</option>
                              <option value="villa">Villa</option>
                              <option value="commercial">Commercial</option>
                              <option value="land">Land</option>
                            </select>
                            {touched.propertyType && formErrors.propertyType && (
                              <div className="invalid-feedback">{formErrors.propertyType}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Property Location*</label>
                            <input
                              type="text"
                              className={`form-control ${touched.propertyLocation && formErrors.propertyLocation ? "is-invalid" : ""}`}
                              name="propertyLocation"
                              placeholder="Address"
                              required
                              value={formData.propertyLocation}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.propertyLocation && formErrors.propertyLocation && (
                              <div className="invalid-feedback">{formErrors.propertyLocation}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Bedrooms</label>
                            <select
                              className={`form-select ${touched.bedrooms && formErrors.bedrooms ? "is-invalid" : ""}`}
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5+</option>
                            </select>
                            {touched.bedrooms && formErrors.bedrooms && (
                              <div className="invalid-feedback">{formErrors.bedrooms}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Bathrooms</label>
                            <select
                              className={`form-select ${touched.bathrooms && formErrors.bathrooms ? "is-invalid" : ""}`}
                              name="bathrooms"
                              value={formData.bathrooms}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4+</option>
                            </select>
                            {touched.bathrooms && formErrors.bathrooms && (
                              <div className="invalid-feedback">{formErrors.bathrooms}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-sm-6 col-lg-4">
                          <div className="mb20">
                            <label className="heading-color ff-heading fw600 mb10">Property Size (sq ft)</label>
                            <input
                              type="text"
                              className={`form-control ${touched.propertySize && formErrors.propertySize ? "is-invalid" : ""}`}
                              name="propertySize"
                              placeholder="Size in sq ft"
                              value={formData.propertySize}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                            />
                            {touched.propertySize && formErrors.propertySize && (
                              <div className="invalid-feedback">{formErrors.propertySize}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
          <PropertyTitleDeedUpload
            onFileSelect={handleFileSelect}
            externalFormErrors={formErrors}
          />

          {/* Additional Information Section */}
          <div className="col-lg-12">
            <div className="card mb-4">
              {/* <div className="card-header" style={{background: 'linear-gradient(135deg, #0f8363 0%, #0a6b52 100%)', color: 'white'}}>
                <h5 className="mb-0" style={{color: 'white'}}>Additional Information</h5>
              </div> */}
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 col-lg-6">
                    {/* <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">Availability for Property Visit</label>
                      <input
                        type="text"
                        className={`form-control ${touched.availabilityForVisit && formErrors.availabilityForVisit ? "is-invalid" : ""}`}
                        name="availabilityForVisit"
                        placeholder="E.g., Weekdays after 5pm, Weekends"
                        value={formData.availabilityForVisit}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      />
                      {touched.availabilityForVisit && formErrors.availabilityForVisit && (
                        <div className="invalid-feedback">{formErrors.availabilityForVisit}</div>
                      )}
                    </div> */}
                  </div>

                  {/* <div className="col-lg-12">
                    <div className="mb20">
                      <label className="heading-color ff-heading fw600 mb10">Additional Information</label>
                      <textarea
                        name="additionalInfo"
                        className={`form-control ${touched.additionalInfo && formErrors.additionalInfo ? "is-invalid" : ""}`}
                        rows="5"
                        placeholder="Share any details about your property or specific requirements"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {touched.additionalInfo && formErrors.additionalInfo && (
                        <div className="invalid-feedback">{formErrors.additionalInfo}</div>
                      )}
                    </div>
                  </div> */}

                  <div className="col-md-12">
                    <div className="mb20">
                      <button
                        type="submit"
                        className="btn btn-lg w-100 fw-bold position-relative overflow-hidden transition-all duration-300 hover:bg-opacity-90 active:transform active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #0f8363 0%, #0a6b52 100%)",
                          boxShadow: "0 4px 12px rgba(15, 131, 99, 0.3)",
                          borderRadius: "8px",
                          height: "56px",
                          fontSize: "18px",
                          border: "none",
                          opacity: isButtonDisabled ? 0.7 : 1,
                          cursor: isButtonDisabled ? "not-allowed" : "pointer"
                        }}
                        disabled={isButtonDisabled || submitting || isLoading}
                      >
                        <span className="flex items-center justify-center">
                          {isButtonDisabled || submitting || isLoading ? (
                            <>
                              <svg 
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                xmlns="https://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                ></circle>
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="https://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                              Submit Request
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAgentToListProperty;