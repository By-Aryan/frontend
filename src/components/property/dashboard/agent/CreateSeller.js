"use client"
import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Image from "next/image";
import Snackbar from "@/components/Snackbar/Snackbar";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import useAxiosPost from "@/hooks/useAxiosPost";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { usePost } from "@/hooks/usePost";
import { useRouter } from "next/navigation";

const CreateSeller = ({params}) => {
    const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState(null);
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState(true)
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("")
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [localData, setLocalData] = useState({
    fullname : "",
    email : "",
    mobile : "",
    password : "",
    confirmPassword : "",
    role : "seller"
  });

  const {data, isLoading, isError} = useAxiosFetch(`/seller/getSellerById/${params.id}`);
  useEffect(() =>{
    setLocalData((prev)=>({
        ...prev,
        fullname : data?.data?.fullname,
        email : data?.data?.email,
        mobile : data?.data?.mobile,
    }))
  },[data])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Update local state without triggering onChange
    setLocalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  const validateForm = () => {
    let newErrors = {};

    if (!localData.fullname) newErrors.fullname = "Name is required";
    if (!localData.email) newErrors.email = "Email is required";
    if (localData.mobile && !/^\d+$/.test(localData.mobile))
      newErrors.mobile = "Phone must contain only numbers";
    const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(localData.password))
      newErrors.password =
        "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.";
    if (localData.password !== localData.confirmPassword)
      newErrors.confirmPassword = "Password and Confirm Password does not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { confirmPassword, ...dataToSubmit} = localData; // Exclude confirmPassword

  const mutation = usePost("/agents/create");

 const handleLocalSubmit = (e) => {
    
    e.preventDefault();
    
    if (validateForm()) {


      mutation.mutate(
        {fullname: localData.fullname, ...dataToSubmit, role: "seller"},
        {
          onSuccess: (details) => {
            // Show success snackbar
            setStatus(true);
            setMessage("Account created successfully!");
            setState({ ...state, open: true });
            setTimeout(() => {
                setState({ ...state, open:false });
                router.push(`/dashboard/agent/seller-account-requests`)
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
            }, 3000);

          },
          onError: (error) => {
            console.error("Error creating user", error.response.data.error.message);
            const errorMsg = error.response?.data?.error?.message || "Account Creation failed. Please try again.";
            setMessage(errorMsg);
            setState({ ...state, open: true });
            setStatus(false);
            if (error.response?.data?.errors) {
                setError(error.response.data.errors);
            }
            setTimeout(() => {
                setState({ ...state, open: false });
            }, 3000);
          },
        }
      );
    }
  };

  return (
    <>
    <form className="form-style1" onSubmit={handleLocalSubmit}>
        {/* <div className="profile-box position-relative d-md-flex align-items-end mb50">
              {uploadedImage&&<div className="profile-img new position-relative overflow-hidden bdrs12 mb20-sm">
                <Image
                  width={240}
                  height={220}
                  className="w-100 cover h-100"
                  src={uploadedImage || "/images/listings/profile-1.jpg"}
                  alt="profile Photo"
                />
        
                <button
                  className="tag-del"
                  style={{ border: "none" }}
                  data-tooltip-id="profile_del"
                  onClick={() => setUploadedImage(null)}
                >
                  <span className="fas fa-trash-can" />
                </button>
        
                <ReactTooltip id="profile_del" place="right" content="Delete Image" />
              </div>}
        
              <div className="profile-content ml30 ml0-sm">
                <label className="upload-label pointer">
                  <input
                    type="file"
                    name="profile_photo"
                    accept="image/jpeg,image/png"
                    onChange={handleUpload}
                    style={{ display: "none" }}
                  />
                  <div className="ud-btn btn-white2 mb30">
                    Upload Seller's Profile Photo
                    <i className="fal fa-arrow-right-long" />
                  </div>
                </label>
              </div>
            </div> */}
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
            Seller Name
            </label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              placeholder="Name"
              value={localData?.fullname}
              onChange={handleInputChange}
              
            />
            {errors.fullname && <p className="text-danger">{errors.fullname}</p>}
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Contact Number</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              placeholder="Contact Number"
              value={localData?.mobile}
              onChange={handleInputChange}
              
            />
            {errors.mobile && <p className="text-danger">{errors.mobile}</p>}
          </div>
        </div>
        

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={localData?.email}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Email"
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>
        </div>
        
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Password
            </label>
            <div className="form-control d-flex justify-between items-center">
            <input
              type={`${show ? "text" : "password"}`}
              name="password"
              value={localData?.password}
              onChange={handleInputChange}
              className="w-[100%]"
              placeholder="Password"
              style={{ border: "none", outline: "none" }}
              required
            />
            <p
              className="border-none pointer mt-3"
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? "Hide" : "Show"}
            </p>
            </div>
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>
        </div>
        

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Confirm Password
            </label>
            <div className="form-control d-flex justify-between items-center">
            <input
              type={`${showConfirm ? "text" : "password"}`}
              name="confirmPassword"
              value={localData?.confirmPassword}
              onChange={handleInputChange}
              className="w-[100%]"
              autoComplete="false"
              placeholder="Confirm Password"
              style={{ border: "none", outline: "none" }}
              required
            />
             <p
              className="border-none pointer mt-3"
              onClick={() => {
                setShowConfirm(!showConfirm);
              }}
            >
              {showConfirm ? "Hide" : "Show"}
            </p>
            </div>
            {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="col-md-12">
          <div className="text-end">
            <button type="submit" className="ud-btn btn-dark">
              Create Seller Account
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
     </form>
     <StatusSnackbar  message={message} state={state} status={status}/>
     </>
  );
};

export default CreateSeller;
