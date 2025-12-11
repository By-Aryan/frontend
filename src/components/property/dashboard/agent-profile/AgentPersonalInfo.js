"use client"
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import useAxiosPost from "@/hooks/useAxiosPost";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const AgentPersonalInfo = ({ create, data, role }) => {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("")
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [localData, setLocalData] = useState({
    profile_photo: {},
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: role
  });


  const handleUpload = (event) => {
    const file = event.target.files[0];
    const name = event.target.name
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      console.log(file)
      setLocalData((prev) => ({ ...prev, [name]: file }));
    }
  };



  useEffect(() => {
    setLocalData(data);
  }, [data]);

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
    if (localData.mobile && !/^\d{10}$/.test(localData.mobile))
      newErrors.mobile = "Phone number must be exactly 10 digits";
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


  const mutation = useAxiosPost("/agents/create", {
    onSuccess: (details) => {
      console.log("Request created successfully:", details);
      setState((prev) => ({ ...prev, open: true }))
      setStatus(true);
      setMessage(`${create} Created Successfully`);
      setLocalData({
        profile_photo: {},
        fullname: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: role
      })
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
        router.push("/dashboard/admin/all-users")
        window.location.reload()
      }, 3000);
    },
    onError: (error) => {
      console.error("Error creating agent:", error.response.data.error.message);
      setMessage(error.response.data.error.message);
      setStatus(false);
      setState((prev) => ({ ...prev, open: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
      }, 4000);
    },
  })

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { confirmPassword, ...dataToSubmit } = localData; // Exclude confirmPassword

      mutation.mutate({ ...dataToSubmit, role: role })
    }
  };

  return (
    <>
      <form className="form-style1" onSubmit={handleLocalSubmit}>
        <div className="profile-box position-relative d-md-flex align-items-end mb50">
          <div className="profile-img new position-relative overflow-hidden bdrs12 mb20-sm">
            {uploadedImage ? (
              <div className="sm:w-[240px] w-[200px] sm:h-[220px] h-[150px]">
                <Image
                  width={240}
                  height={220}
                  className="w-full cover object-top h-full bg-black"
                  src={uploadedImage}
                  alt="profile avatar"
                  unoptimized={uploadedImage.startsWith('blob:') || uploadedImage.startsWith('data:')}
                />
              </div>
            ) : (
              <div className="sm:w-[240px] w-[200px] sm:h-[220px] h-[150px] d-flex align-items-center justify-content-center bg-light">
                <span className="fas fa-user text-muted" style={{ fontSize: '48px' }} />
              </div>
            )}

            {uploadedImage && (
              <button
                className="tag-del"
                style={{ border: "none" }}
                data-tooltip-id="profile_del"
                onClick={(e) => {
                  e.preventDefault();
                  setUploadedImage(null);
                  setLocalData((prev) => ({ ...prev, profile_photo: {} }));
                }}
              >
                <span className="fas fa-trash-can" />
              </button>
            )}

            <ReactTooltip id="profile_del" place="right" content="Delete Image" />
          </div>

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
                Upload {create}'s Profile Photo
                <i className="fal fa-arrow-right-long" />
              </div>
            </label>
            <p className="text">
              Photos must be JPEG or PNG format and at least 2048x768
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-4">
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {create} Name
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
                maxLength={10}
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
              Create {create}
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </form>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default AgentPersonalInfo;
