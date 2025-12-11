"use client"
import React, { useEffect, useState } from "react";

const PersonalInfo = ({ data, onChange, handleSubmit }) => {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   phone: "",
  //   whatsapp: "",
  //   profession: "",
  //   address: "",
  //   about: "",
  // });

  const [errors, setErrors] = useState({});

  // // 🔹 Handle Input Change
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // // 🔹 Validate Form
  // const validateForm = () => {
  //   let newErrors = {};

  //   if (!formData.username) newErrors.username = "Username is required";
  //   if (!formData.phone || !/^\d+$/.test(formData.phone)) 
  //     newErrors.phone = "Phone must contain only numbers";
  //   if (formData.whatsapp && !/^\d+$/.test(formData.whatsapp)) 
  //     newErrors.whatsapp = "WhatsApp number must be numeric";
  //   if (formData.about.length > 500) 
  //     newErrors.about = "About Me cannot exceed 500 characters";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // // 🔹 Handle Form Submit
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // if (validateForm()) {
  //     console.log("Form Submitted Successfully", formData);
  //   // }
  // };

  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...localData, [name]: value };
    setLocalData(updatedData);
    onChange(updatedData); // 🔹 Send data back to parent
  };

  const validateForm = () => {
    let newErrors = {};

    if (localData.phone && !/^\d+$/.test(localData.phone)) 
      newErrors.phone = "Phone must contain only numbers";
    if (localData.whatsapp && !/^\d+$/.test(localData.whatsapp)) 
      newErrors.whatsapp = "WhatsApp number must be numeric";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalSubmit = (e)=>{
    e.preventDefault()
  if(validateForm()){
    handleSubmit()
  }
  }

  return (
    <form className="form-style1 responsive-form" onSubmit={handleLocalSubmit}>
      <div className="mobile-form-row">
        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              className="form-control responsive-form .form-input"
              placeholder="Your Name"
              readOnly
              value={localData?.fullname}
              style={{ 
                minHeight: '48px',
                fontSize: '16px',
                backgroundColor: '#f8f9fa',
                cursor: 'not-allowed'
              }}
            />
          </div>
        </div>

        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">Phone</label>
            <input
              type="text"
              className="form-control responsive-form .form-input"
              name="mobile"
              placeholder="Your Phone"
              readOnly
              value={localData?.mobile}
              style={{ 
                minHeight: '48px',
                fontSize: '16px',
                backgroundColor: '#f8f9fa',
                cursor: 'not-allowed'
              }}
            />
            {errors.phone && <p className="text-danger mobile-mt-1">{errors.mobile}</p>}
          </div>
        </div>

        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              Email
            </label>
            <input
              type="email"
              readOnly
              value={localData?.email}
              className="form-control responsive-form .form-input"
              placeholder="Your Email"
              style={{ 
                minHeight: '48px',
                fontSize: '16px',
                backgroundColor: '#f8f9fa',
                cursor: 'not-allowed'
              }}
            />
          </div>
        </div>

        {/* <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
              
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Position
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
              
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Language
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
              
            />
          </div>
        </div> */}
        {/* End .col */}

        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              WhatsApp Number
            </label>
            <input
              type="text"
              className="form-control responsive-form .form-input"
              name="whatsappNumber"
              placeholder="Your WhatsApp Number"
              value={localData?.whatsappNumber || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
            {errors.whatsappNumber && <p className="text-danger mobile-mt-1">{errors.whatsappNumber}</p>}
          </div>
        </div>

        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              Profession
            </label>
            <input
              type="text"
              className="form-control responsive-form .form-input"
              name="profession"
              placeholder="Your Profession"
              value={localData?.profession || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
          </div>
        </div>

        <div className="form-col-full">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              Address
            </label>
            <input
              type="text"
              className="form-control responsive-form .form-input"
              name="address"
              placeholder="Your Address"
              value={localData?.address || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
          </div>
        </div>

        <div className="form-col-full">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              About Me
            </label>
            <textarea
              className="form-control responsive-form .form-input"
              rows={4}
              maxLength={500}
              name="aboutMe"
              placeholder="Tell us about yourself..."
              value={localData?.aboutMe || ''}
              onChange={handleInputChange}
              style={{ 
                minHeight: '120px', 
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
            <small className="text-muted mobile-mt-1 d-block">
              {(localData?.aboutMe || '').length}/500 characters
            </small>
          </div>
        </div>

        <div className="form-col-full">
          <div className="mobile-text-center tablet-text-right mobile-mt-4">
            <button 
              type="submit" 
              className="ud-btn btn-dark btn-mobile-full"
              style={{ minHeight: '48px', fontSize: '16px', fontWeight: '600' }}
            >
              Update Profile
              <i className="fal fa-arrow-right-long ms-2" />
            </button>
          </div>
        </div>
      </div>
     </form>
  );
};

export default PersonalInfo;
