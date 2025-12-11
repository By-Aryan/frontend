// "use client";
// import StatusSnackbar from "@/components/Snackbar/Snackbar";
// import { usePost } from "@/hooks/usePost";
// import { useUserStore } from "@/store/store";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import FreeListingAnimatedModal from "./free-listing-animated-modal";

// const Modal = dynamic(() => import("bootstrap"), { ssr: false });

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;

// const FreeListingForm = () => {
//   const modalRef = useRef(null);
//   const [showModal, setShowModal] = useState(false);
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState(true);
//   const [state, setState] = useState({
//     open: false,
//     vertical: "top",
//     horizontal: "center",
//   });

//   const [show, setShow] = useState(false);
//   const [data, setData] = useState({
//     fullname: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     titleDeedFile: null,
//     passportFile: null,
//     titleDeedFileName: "", // Add file name states
//     passportFileName: "", // Add file name states
//     emiratesId: "",
//   });
//   const [validationErrors, setValidationErrors] = useState({
//     fullname: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     titleDeedFile: "",
//     passportFile: "",
//     emiratesId: "",
//   });

//   // Document upload states
//   const [titleDeedPreview, setTitleDeedPreview] = useState(null);
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [isUploadingTitleDeed, setIsUploadingTitleDeed] = useState(false);
//   const [isUploadingPassport, setIsUploadingPassport] = useState(false);
//   const [uploadedTitleDeed, setUploadedTitleDeed] = useState(null);
//   const [uploadedPassport, setUploadedPassport] = useState(null);

//   const titleDeedInputRef = useRef(null);
//   const passportInputRef = useRef(null);
//   const [apiError, setApiError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [touchedFields, setTouchedFields] = useState({});

//   const router = useRouter();
//   const pathname = usePathname();
//   const mutation = usePost("/auth/signup");
//   const mutation1 = usePost("/auth/generate-otp");
//   const sellerMutation = usePost("/seller/register");
//   const freeListingMutation = usePost("/auth/free-listing"); // Add the free listing mutation
//   const { setUser } = useUserStore();

//   useEffect(() => {
//     if (pathname === "/register") {
//       const token = localStorage.getItem("accessToken");
//       const firstVisit = localStorage.getItem("firstVisit");
//       const role = localStorage.getItem("role");

//       const itemsToRemove = ["tempData", "formState", "registrationStep"];
//       itemsToRemove.forEach((item) => localStorage.removeItem(item));

//       const modalElement =
//         modalRef.current?.modalRef?.current ||
//         modalRef.current?.getElement?.() ||
//         modalRef.current;

//       if (modalElement && typeof window !== "undefined" && window.bootstrap) {
//         let modalInstance = window.bootstrap.Modal.getInstance(modalElement);
//         if (!modalInstance) {
//           modalInstance = new window.bootstrap.Modal(modalElement);
//         }
//         modalInstance.hide();

//         const modalBackdrops = document.querySelectorAll(".modal-backdrop");
//         modalBackdrops.forEach((backdrop) => backdrop.remove());

//         const handleHidden = () => {
//           document.body.classList.remove("modal-open");
//           document.body.style.overflow = "";
//           document.body.style.paddingRight = "";
//         };

//         modalElement.addEventListener("hidden.bs.modal", handleHidden);

//         return () => {
//           modalElement.removeEventListener("hidden.bs.modal", handleHidden);
//         };
//       }

//       if (true) {
//         setTimeout(() => {
//           setShowModal(true);
//         }, 1000);
//       } else {
//         setShowModal(false);
//       }
//     }
//   }, [pathname]);

//   const validateInput = (name, value, allValues = data) => {
//     let error = "";

//     switch (name) {
//       case "fullname":
//         if (!value.trim()) {
//           error = "Name is required.";
//         } else if (value.trim().length < 2) {
//           error = "Name should be at least 2 characters long.";
//         } else if (!/^[A-Za-z\s]+$/.test(value)) {
//           error = "Name should contain only alphabets.";
//         }
//         break;

//       case "email":
//         if (!value.trim()) {
//           error = "Email is required.";
//         } else if (
//           !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
//         ) {
//           error = "Enter a valid email address.";
//         }
//         break;

//       case "mobile":
//         if (!value.trim()) {
//           error = "Phone number is required.";
//         } else if (!/^[0-9]{10}$/.test(value)) {
//           error = "Enter a valid 10-digit phone number.";
//         }
//         break;

//       case "emiratesId":
//         if (!value.trim()) {
//           error = "Emirates ID is required.";
//         }
//         break;

//       case "password":
//         if (!value.trim()) {
//           error = "Password is required.";
//         } else if (value.length < 6) {
//           error = "Password must be at least 6 characters long.";
//         }
//         break;

//       case "confirmPassword":
//         if (!value.trim()) {
//           error = "Please confirm your password.";
//         } else if (value !== allValues.password) {
//           error = "Passwords do not match.";
//         }
//         break;

//       case "titleDeedFile":
//         if (!value && !uploadedTitleDeed && !allValues.titleDeedFileName) {
//           error = "Title Deed file is required.";
//         } else if (value && value.size > 5 * 1024 * 1024) {
//           error = "File size should not exceed 5MB.";
//         } else if (value) {
//           const acceptedTypes = [
//             "application/pdf",
//             "image/jpeg",
//             "image/png",
//             "image/jpg",
//           ];
//           if (!acceptedTypes.includes(value.type)) {
//             error = "Only PDF and images (JPEG, PNG) are allowed.";
//           }
//         }
//         break;

//       case "passportFile":
//         if (!value && !uploadedPassport && !allValues.passportFileName) {
//           error = "Passport file is required.";
//         } else if (value && value.size > 5 * 1024 * 1024) {
//           error = "File size should not exceed 5MB.";
//         } else if (value) {
//           const acceptedTypes = [
//             "application/pdf",
//             "image/jpeg",
//             "image/png",
//             "image/jpg",
//           ];
//           if (!acceptedTypes.includes(value.type)) {
//             error = "Only PDF and images (JPEG, PNG) are allowed.";
//           }
//         }
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;

//     // Only validate required fields for free listing including password
//     const requiredFields = [
//       "fullname",
//       "email",
//       "mobile",
//       "password",
//       "confirmPassword",
//       "emiratesId",
//       "titleDeedFile",
//       "passportFile",
//     ];

//     requiredFields.forEach((key) => {
//       const error = validateInput(key, data[key], data);
//       newErrors[key] = error;

//       if (error) {
//         isValid = false;
//       }
//     });

//     setValidationErrors(newErrors);
//     return isValid;
//   };

//   const markFieldAsTouched = (name) => {
//     setTouchedFields((prev) => ({ ...prev, [name]: true }));
//   };

//   const inputHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));

//     if (touchedFields[name] || value) {
//       const error = validateInput(name, value, { ...data, [name]: value });
//       setValidationErrors((prev) => ({ ...prev, [name]: error }));
//     }

//     if (apiError) setApiError(null);
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     markFieldAsTouched(name);

//     const error = validateInput(name, data[name], data);
//     setValidationErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   // Function to generate a file name similar to your example
//   const generateFileName = (originalName, type) => {
//     const timestamp = Date.now();
//     const randomId = Math.floor(Math.random() * 1000000000);
//     const extension = originalName.split(".").pop();
//     return `${timestamp}-${randomId}.${extension}`;
//   };

//   const handleFileChange = async (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Generate file name in the format you want
//       const generatedFileName = generateFileName(file.name, type);

//       setData((prev) => ({
//         ...prev,
//         [`${type}File`]: file,
//         [`${type}FileName`]: generatedFileName, // Store the generated file name
//       }));
//       markFieldAsTouched(`${type}File`);

//       const error = validateInput(`${type}File`, file, data);
//       setValidationErrors((prev) => ({ ...prev, [`${type}File`]: error }));

//       // Create file preview
//       if (file.type === "application/pdf" || file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           if (type === "titleDeed") {
//             setTitleDeedPreview(e.target.result);
//           } else {
//             setPassportPreview(e.target.result);
//           }
//         };
//         reader.readAsDataURL(file);
//       }

//       console.log(`Generated ${type} file name:`, generatedFileName);
//     }
//   };

//   const removeDocument = (type) => {
//     setData((prev) => ({
//       ...prev,
//       [`${type}File`]: null,
//       [`${type}FileName`]: "", // Clear the file name too
//     }));

//     if (type === "titleDeed") {
//       setTitleDeedPreview(null);
//       setUploadedTitleDeed(null);
//       if (titleDeedInputRef.current) titleDeedInputRef.current.value = "";
//     } else {
//       setPassportPreview(null);
//       setUploadedPassport(null);
//       if (passportInputRef.current) passportInputRef.current.value = "";
//     }

//     setValidationErrors((prev) => ({ ...prev, [`${type}File`]: "" }));
//   };

//   const renderDocumentUpload = (
//     type,
//     label,
//     preview,
//     isUploading,
//     inputRef
//   ) => (
//     <div className="sm:mb20 mb15">
//       <label className="form-label fw600 dark-color">
//         {label}
//         <span className="text-danger">*</span>
//       </label>

//       <div className="position-relative">
//         {isUploading && (
//           <div
//             className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}
//           >
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Uploading...</span>
//             </div>
//           </div>
//         )}

//         <input
//           type="file"
//           name={`${type}File`}
//           className={`form-control ${
//             touchedFields[`${type}File`] && validationErrors[`${type}File`]
//               ? "is-invalid"
//               : ""
//           }`}
//           onChange={(e) => handleFileChange(e, type)}
//           accept=".pdf,.jpg,.jpeg,.png"
//           required
//           ref={inputRef}
//           disabled={isUploading}
//         />
//       </div>

//       <small className="text-muted">
//         Please upload a PDF or image (max 5MB)
//       </small>

//       {/* Show generated file name */}
//       {data[`${type}FileName`] && (
//         <small className="d-block text-info mt-1">
//           Generated file name: {data[`${type}FileName`]}
//         </small>
//       )}

//       {touchedFields[`${type}File`] && validationErrors[`${type}File`] && (
//         <div className="invalid-feedback d-block">
//           {validationErrors[`${type}File`]}
//         </div>
//       )}

//       {/* Document Preview Section */}
//       {preview && (
//         <div className="mt-3">
//           <div className="d-flex align-items-center justify-content-between">
//             <span className="fw600">
//               Selected File: {data[`${type}File`]?.name}
//             </span>
//             <button
//               type="button"
//               className="btn btn-sm btn-danger"
//               onClick={() => removeDocument(type)}
//             >
//               Remove
//             </button>
//           </div>

//           <div className="mt-2 border p-2">
//             {data[`${type}File`]?.type === "application/pdf" ? (
//               <>
//                 <iframe
//                   src={preview}
//                   width="100%"
//                   height="300px"
//                   style={{ border: "none" }}
//                   title={`${label} Preview`}
//                 />
//                 <div className="text-center mt-2">
//                   <a
//                     href={preview}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="btn btn-sm btn-primary"
//                   >
//                     Open in New Tab
//                   </a>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center">
//                 <Image
//                   src={preview}
//                   alt={`${label} Preview`}
//                   style={{ maxWidth: "100%", maxHeight: "300px" }}
//                   className="img-fluid"
//                   width={100}
//                   height={100}
//                 />
//                 <div className="mt-2">
//                   <a
//                     href={preview}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="btn btn-sm btn-primary"
//                   >
//                     Open in New Tab
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Mark all fields as touched
//     const allTouched = {};
//     Object.keys(data).forEach((key) => {
//       console.log("🚀 ~ handleSubmit ~ data:", data);
//       allTouched[key] = true;
//     });
//     setTouchedFields(allTouched);

//     // Validate all fields
//     if (!validateForm()) {
//       setMessage("Please fix the errors before submitting.");
//       setStatus(false);
//       setState({ ...state, open: true });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const role = localStorage.getItem("role") || "seller";
//       const interest =
//         localStorage.getItem("interestedIn") || "property_listing";

//       // Create JSON payload instead of FormData
//       const jsonPayload = {
//         full_name: data.fullname,
//         email: data.email,
//         mobile: data.mobile,
//         password: data.password,
//         emirates_id: data.emiratesId,
//         role: role,
//         interest: interest,
//         title_deed: data.titleDeedFileName, // Send file name instead of file
//         passport: data.passportFileName, // Send file name instead of file
//       };

//       // Debug: Log JSON payload
//       console.log("JSON Payload:", jsonPayload);

//       freeListingMutation.mutate(jsonPayload, {
//         onSuccess: (response) => {
//           console.log("🚀 Free Listing Response:", response);

//           const data = response?.data || {};

//           if (response.success) {
//             router.push("/for-sale/properties/uae?purpose=buy");
//           }

//           // === Extract and store tokens ===
//           const accessToken =
//             data.accessToken ||
//             data.access_token ||
//             data.tokens?.accessToken ||
//             data.tokens?.access_token;

//           const refreshToken =
//             data.refreshToken ||
//             data.refresh_token ||
//             data.tokens?.refreshToken ||
//             data.tokens?.refresh_token;

//           if (accessToken) localStorage.setItem("accessToken", accessToken);
//           if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

//           // === Extract and store role ===
//           const roles = data.role ? [data.role] : [];
//           localStorage.setItem("roles", JSON.stringify(roles));

//           // === Store user object ===
//           const user = {
//             user_id: data.user_id,
//             full_name: data.fullname,
//             email: data.email,
//             role: data.role,
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//             isVerified: data.isVerified,
//             isPlanActive: data.isPlanActive,
//             contactsAllowed: data.contactsAllowed,
//           };
//           localStorage.setItem("user", JSON.stringify(user));

//           // === Additional values like in login ===
//           localStorage.setItem("name", data.fullname);
//           localStorage.setItem("id", data.user_id);
//           localStorage.setItem("loginSuccessfull", "true");
//           localStorage.setItem("isPlanActive", String(data.isPlanActive));
//           localStorage.setItem(
//             "remainingContacts",
//             String(data.contactsAllowed)
//           );

//           // === Set user in app state/store ===
//           setUser({
//             id: data.user_id,
//             fullname: data.fullname,
//             email: data.email,
//             mobile: data.mobile,
//             role: data.role,
//             isVerified: data.isVerified,
//             isPlanActive: data.isPlanActive,
//             contactsAllowed: data.contactsAllowed,
//           });

//           // === Call login() if tokens exist ===
//           if (accessToken && refreshToken) {
//             login({ accessToken, refreshToken }, data, roles);
//           }

//           // === Success UI feedback ===
//           setStatus(true);
//           setMessage(
//             "Details Submitted Successfully! Our Agent will contact you soon. Thank You."
//           );
//           setState({ ...state, open: true });

//           // === Reset form ===
//           setData({
//             fullname: "",
//             email: "",
//             mobile: "",
//             password: "",
//             confirmPassword: "",
//             titleDeedFile: null,
//             passportFile: null,
//             titleDeedFileName: "",
//             passportFileName: "",
//             emiratesId: "",
//           });

//           setTitleDeedPreview(null);
//           setPassportPreview(null);
//           setValidationErrors({
//             fullname: "",
//             email: "",
//             mobile: "",
//             password: "",
//             confirmPassword: "",
//             titleDeedFile: "",
//             passportFile: "",
//             emiratesId: "",
//           });

//           setTouchedFields({});
//           if (titleDeedInputRef.current) titleDeedInputRef.current.value = "";
//           if (passportInputRef.current) passportInputRef.current.value = "";

//           setTimeout(() => {
//             setState({ ...state, open: false });
//           }, 4000);

//           setIsSubmitting(false);
//         },

//         onError: (error) => {
//           console.error("Error submitting free listing:", error);
//           const errorMsg =
//             error?.response?.data?.message ||
//             error?.message ||
//             "Submission failed. Please try again.";
//           setMessage(errorMsg);
//           setState({ ...state, open: true });
//           setStatus(false);

//           if (error?.response?.data?.errors) {
//             setApiError(error.response.data.errors);
//           }

//           setIsSubmitting(false);
//         },
//       });
//     } catch (error) {
//       console.error("Form submission error:", error);
//       setMessage("An unexpected error occurred. Please try again.");
//       setStatus(false);
//       setState({ ...state, open: true });
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     setState({ ...state, open: false });
//   };

//   return (
//     <>
//       <form className="form-style1" onSubmit={handleSubmit} noValidate>
//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Full Name<span className="text-danger">*</span>
//           </label>
//           <input
//             type="text"
//             name="fullname"
//             className={`form-control ${
//               touchedFields.fullname && validationErrors.fullname
//                 ? "is-invalid"
//                 : ""
//             }`}
//             placeholder="Enter Full Name"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.fullname}
//             required
//           />
//           {touchedFields.fullname && validationErrors.fullname && (
//             <div className="invalid-feedback d-block">
//               {validationErrors.fullname}
//             </div>
//           )}
//         </div>

//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Password<span className="text-danger">*</span>
//           </label>
//           <input
//             type="password"
//             name="password"
//             className={`form-control ${
//               touchedFields.password && validationErrors.password
//                 ? "is-invalid"
//                 : ""
//             }`}
//             placeholder="Enter Password"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.password}
//             required
//           />
//           {touchedFields.password && validationErrors.password && (
//             <div className="invalid-feedback d-block">
//               {validationErrors.password}
//             </div>
//           )}
//         </div>

//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Confirm Password<span className="text-danger">*</span>
//           </label>
//           <input
//             type="password"
//             name="confirmPassword"
//             className={`form-control ${
//               touchedFields.confirmPassword && validationErrors.confirmPassword
//                 ? "is-invalid"
//                 : ""
//             }`}
//             placeholder="Confirm Password"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.confirmPassword}
//             required
//           />
//           {touchedFields.confirmPassword &&
//             validationErrors.confirmPassword && (
//               <div className="invalid-feedback d-block">
//                 {validationErrors.confirmPassword}
//               </div>
//             )}
//         </div>

//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Email<span className="text-danger">*</span>
//           </label>
//           <input
//             type="email"
//             name="email"
//             className={`form-control ${
//               touchedFields.email && validationErrors.email ? "is-invalid" : ""
//             }`}
//             placeholder="Enter Email"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.email}
//             required
//           />
//           {touchedFields.email && validationErrors.email && (
//             <div className="invalid-feedback d-block">
//               {validationErrors.email}
//             </div>
//           )}
//         </div>

//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Phone Number<span className="text-danger">*</span>
//           </label>
//           <input
//             type="tel"
//             name="mobile"
//             className={`form-control ${
//               touchedFields.mobile && validationErrors.mobile
//                 ? "is-invalid"
//                 : ""
//             }`}
//             placeholder="Enter Phone Number"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.mobile}
//             maxLength={10}
//             inputMode="tel"
//             pattern="[0-9]*"
//             required
//           />
//           {touchedFields.mobile && validationErrors.mobile && (
//             <div className="invalid-feedback d-block">
//               {validationErrors.mobile}
//             </div>
//           )}
//         </div>

//         <div className="sm:mb20 mb15">
//           <label className="form-label fw600 dark-color">
//             Emirates ID<span className="text-danger">*</span>
//           </label>
//           <input
//             type="text"
//             name="emiratesId"
//             className={`form-control ${
//               touchedFields.emiratesId && validationErrors.emiratesId
//                 ? "is-invalid"
//                 : ""
//             }`}
//             placeholder="Enter Emirates ID (e.g., 784-2000-1234567-8)"
//             onChange={inputHandler}
//             onBlur={handleBlur}
//             value={data.emiratesId}
//             required
//           />
//           {touchedFields.emiratesId && validationErrors.emiratesId && (
//             <div className="invalid-feedback d-block">
//               {validationErrors.emiratesId}
//             </div>
//           )}
//         </div>

//         {renderDocumentUpload(
//           "titleDeed",
//           "Title Deed Document",
//           titleDeedPreview,
//           isUploadingTitleDeed,
//           titleDeedInputRef
//         )}

//         {renderDocumentUpload(
//           "passport",
//           "Passport Document",
//           passportPreview,
//           isUploadingPassport,
//           passportInputRef
//         )}

//         {apiError && (
//           <div className="mb20 alert alert-danger">
//             {apiError.map((err, index) => (
//               <p key={index} className="mb-1">
//                 {err.msg || err}
//               </p>
//             ))}
//           </div>
//         )}

//         <div className="d-grid mb20">
//           <button
//             className="ud-btn btn-thm"
//             type="submit"
//             disabled={
//               isSubmitting || isUploadingTitleDeed || isUploadingPassport
//             }
//           >
//             {isSubmitting ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 Submit Free Listing <i className="fal fa-arrow-right-long" />
//               </>
//             )}
//           </button>
//         </div>

//         <div className="text-center">
//           <small className="text-muted">
//             * Required fields. Supported formats: PDF, JPG, PNG (Max 5MB each)
//           </small>
//         </div>
//       </form>
//       <StatusSnackbar
//         message={message}
//         state={state}
//         status={status}
//         onClose={handleClose}
//       />

//       <FreeListingAnimatedModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         ref={modalRef}
//       />
//     </>
//   );
// };

// export default FreeListingForm;

"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FreeListingAnimatedModal from "./free-listing-animated-modal";

const Modal = dynamic(() => import("bootstrap"), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;

const FreeListingForm = () => {
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  // Success Dialog State
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    titleDeedFile: null,
    passportFile: null,
    titleDeedFileName: "", // Add file name states
    passportFileName: "", // Add file name states
    emiratesId: "",
    otp: "", // Add OTP field
  });
  const [validationErrors, setValidationErrors] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    titleDeedFile: "",
    passportFile: "",
    emiratesId: "",
    otp: "", // Add OTP validation
  });

  // OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);

  // Document upload states
  const [titleDeedPreview, setTitleDeedPreview] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const [isUploadingTitleDeed, setIsUploadingTitleDeed] = useState(false);
  const [isUploadingPassport, setIsUploadingPassport] = useState(false);
  const [uploadedTitleDeed, setUploadedTitleDeed] = useState(null);
  const [uploadedPassport, setUploadedPassport] = useState(null);

  const titleDeedInputRef = useRef(null);
  const passportInputRef = useRef(null);
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const router = useRouter();
  const pathname = usePathname();
  const mutation = usePost("/auth/signup");
  const generateOtpMutation = usePost("/auth/generate-otp");
  const verifyOtpMutation = usePost("/auth/verify-otp");
  const sellerMutation = usePost("/seller/register");
  const freeListingMutation = usePost("/auth/free-listing"); // Add the free listing mutation
  const { setUser } = useUserStore();

  useEffect(() => {
    if (pathname === "/register") {
      const token = localStorage.getItem("accessToken");
      const firstVisit = localStorage.getItem("firstVisit");
      const role = localStorage.getItem("role");

      const itemsToRemove = ["tempData", "formState", "registrationStep"];
      itemsToRemove.forEach((item) => localStorage.removeItem(item));

      const modalElement =
        modalRef.current?.modalRef?.current ||
        modalRef.current?.getElement?.() ||
        modalRef.current;

      if (modalElement && typeof window !== "undefined" && window.bootstrap) {
        let modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (!modalInstance) {
          modalInstance = new window.bootstrap.Modal(modalElement);
        }
        modalInstance.hide();

        const modalBackdrops = document.querySelectorAll(".modal-backdrop");
        modalBackdrops.forEach((backdrop) => backdrop.remove());

        const handleHidden = () => {
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        };

        modalElement.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
          modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        };
      }

      if (true) {
        setTimeout(() => {
          setShowModal(true);
        }, 1000);
      } else {
        setShowModal(false);
      }
    }
  }, [pathname]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateInput = (name, value, allValues = data) => {
    let error = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (value.trim().length < 2) {
          error = "Name should be at least 2 characters long.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name should contain only alphabets.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = "Enter a valid email address.";
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Enter a valid 10-digit phone number.";
        }
        break;

      case "emiratesId":
        if (!value.trim()) {
          error = "Emirates ID is required.";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        break;

      case "confirmPassword":
        if (!value.trim()) {
          error = "Please confirm your password.";
        } else if (value !== allValues.password) {
          error = "Passwords do not match.";
        }
        break;

      case "titleDeedFile":
        if (!value && !uploadedTitleDeed && !allValues.titleDeedFileName) {
          error = "Title Deed file is required.";
        } else if (value && value.size > 5 * 1024 * 1024) {
          error = "File size should not exceed 5MB.";
        } else if (value) {
          const acceptedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
          ];
          if (!acceptedTypes.includes(value.type)) {
            error = "Only PDF and images (JPEG, PNG) are allowed.";
          }
        }
        break;

      case "passportFile":
        if (!value && !uploadedPassport && !allValues.passportFileName) {
          error = "Passport file is required.";
        } else if (value && value.size > 5 * 1024 * 1024) {
          error = "File size should not exceed 5MB.";
        } else if (value) {
          const acceptedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
          ];
          if (!acceptedTypes.includes(value.type)) {
            error = "Only PDF and images (JPEG, PNG) are allowed.";
          }
        }
        break;

      case "otp":
        if (!value.trim()) {
          error = "OTP is required.";
        } else if (!/^[0-9]{6}$/.test(value)) {
          error = "OTP must be a 6-digit number.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Only validate required fields for free listing including password
    const requiredFields = [
      "fullname",
      "email",
      "mobile",
      "password",
      "confirmPassword",
      "emiratesId",
      "titleDeedFile",
      "passportFile",
    ];

    requiredFields.forEach((key) => {
      const error = validateInput(key, data[key], data);
      newErrors[key] = error;

      if (error) {
        isValid = false;
      }
    });

    setValidationErrors(newErrors);
    return isValid;
  };

  const markFieldAsTouched = (name) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (touchedFields[name] || value) {
      const error = validateInput(name, value, { ...data, [name]: value });
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);

    const error = validateInput(name, data[name], data);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Function to generate a file name similar to your example
  const generateFileName = (originalName, type) => {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000000000);
    const extension = originalName.split(".").pop();
    return `${timestamp}-${randomId}.${extension}`;
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Set uploading state
      if (type === "titleDeed") {
        setIsUploadingTitleDeed(true);
      } else {
        setIsUploadingPassport(true);
      }

      // Validate file first
      markFieldAsTouched(`${type}File`);
      const error = validateInput(`${type}File`, file, data);
      setValidationErrors((prev) => ({ ...prev, [`${type}File`]: error }));

      if (error) {
        if (type === "titleDeed") {
          setIsUploadingTitleDeed(false);
        } else {
          setIsUploadingPassport(false);
        }
        return;
      }

      // Upload file to temp directory
      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload/temp/single`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const uploadData = await uploadResponse.json();

        if (uploadData.success && uploadData.file) {
          const uploadedFileName = uploadData.file.filename;

          setData((prev) => ({
            ...prev,
            [`${type}File`]: file,
            [`${type}FileName`]: uploadedFileName, // Store the uploaded file name from server
          }));

          // Create file preview
          if (file.type === "application/pdf" || file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (type === "titleDeed") {
                setTitleDeedPreview(e.target.result);
                setUploadedTitleDeed(uploadData.file);
              } else {
                setPassportPreview(e.target.result);
                setUploadedPassport(uploadData.file);
              }
            };
            reader.readAsDataURL(file);
          }

          console.log(`Uploaded ${type} file:`, uploadedFileName);
        } else {
          throw new Error("Upload response invalid");
        }
      } catch (error) {
        console.error(`Error uploading ${type} file:`, error);
        setValidationErrors((prev) => ({
          ...prev,
          [`${type}File`]: "Failed to upload file. Please try again.",
        }));
        // Clear file input
        if (type === "titleDeed" && titleDeedInputRef.current) {
          titleDeedInputRef.current.value = "";
        } else if (passportInputRef.current) {
          passportInputRef.current.value = "";
        }
      } finally {
        if (type === "titleDeed") {
          setIsUploadingTitleDeed(false);
        } else {
          setIsUploadingPassport(false);
        }
      }
    }
  };

  const removeDocument = (type) => {
    setData((prev) => ({
      ...prev,
      [`${type}File`]: null,
      [`${type}FileName`]: "", // Clear the file name too
    }));

    if (type === "titleDeed") {
      setTitleDeedPreview(null);
      setUploadedTitleDeed(null);
      if (titleDeedInputRef.current) titleDeedInputRef.current.value = "";
    } else {
      setPassportPreview(null);
      setUploadedPassport(null);
      if (passportInputRef.current) passportInputRef.current.value = "";
    }

    setValidationErrors((prev) => ({ ...prev, [`${type}File`]: "" }));
  };

  // Send OTP Function
  const handleSendOtp = async () => {
    // Validate email first
    const emailError = validateInput("email", data.email);
    if (emailError) {
      setValidationErrors((prev) => ({ ...prev, email: emailError }));
      markFieldAsTouched("email");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await generateOtpMutation.mutateAsync({
        email: data.email,
        otp_type: "free-listing",
      });

      if (response.status === "Success") {
        setOtpSent(true);
        setOtpTimer(180); // 3 minutes
        setCanResendOtp(false);
        setMessage("OTP sent successfully to your email!");
        setStatus(true);
        setState({ ...state, open: true });

        setTimeout(() => {
          setState({ ...state, open: false });
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send OTP";
      setMessage(errorMsg);
      setStatus(false);
      setState({ ...state, open: true });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP Function
  const handleVerifyOtp = async () => {
    // Validate OTP first
    const otpError = validateInput("otp", data.otp);
    if (otpError) {
      setValidationErrors((prev) => ({ ...prev, otp: otpError }));
      markFieldAsTouched("otp");
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: data.email,
        otp_number: data.otp,
        otp_type: "free-listing",
      });

      if (response.status === "Success") {
        setOtpVerified(true);
        setMessage("Email verified successfully!");
        setStatus(true);
        setState({ ...state, open: true });

        setTimeout(() => {
          setState({ ...state, open: false });
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Invalid OTP";
      setMessage(errorMsg);
      setStatus(false);
      setState({ ...state, open: true });
      setValidationErrors((prev) => ({ ...prev, otp: errorMsg }));
    }
  };

  // Resend OTP Function
  const handleResendOtp = () => {
    setData((prev) => ({ ...prev, otp: "" }));
    setValidationErrors((prev) => ({ ...prev, otp: "" }));
    handleSendOtp();
  };

  const renderDocumentUpload = (
    type,
    label,
    preview,
    isUploading,
    inputRef
  ) => (
    <div className="sm:mb20 mb15">
      <label className="form-label fw600 dark-color">
        {label}
        <span className="text-danger">*</span>
      </label>

      <div className="position-relative">
        {isUploading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        )}

        <input
          type="file"
          name={`${type}File`}
          className={`form-control ${touchedFields[`${type}File`] && validationErrors[`${type}File`]
            ? "is-invalid"
            : ""
            }`}
          onChange={(e) => handleFileChange(e, type)}
          accept=".pdf,.jpg,.jpeg,.png"
          required
          ref={inputRef}
          disabled={isUploading}
        />
      </div>

      <small className="text-muted">
        Please upload a PDF or image (max 5MB)
      </small>

      {/* Show generated file name */}
      {data[`${type}FileName`] && (
        <small className="d-block text-info mt-1">
          Generated file name: {data[`${type}FileName`]}
        </small>
      )}

      {touchedFields[`${type}File`] && validationErrors[`${type}File`] && (
        <div className="invalid-feedback d-block">
          {validationErrors[`${type}File`]}
        </div>
      )}

      {/* Document Preview Section */}
      {preview && (
        <div className="mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw600">
              Selected File: {data[`${type}File`]?.name}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => removeDocument(type)}
            >
              Remove
            </button>
          </div>

          <div className="mt-2 border p-2">
            {data[`${type}File`]?.type === "application/pdf" ? (
              <>
                <iframe
                  src={preview}
                  width="100%"
                  height="300px"
                  style={{ border: "none" }}
                  title={`${label} Preview`}
                />
                <div className="text-center mt-2">
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    Open in New Tab
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Image
                  src={preview}
                  alt={`${label} Preview`}
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                  className="img-fluid"
                  width={100}
                  height={100}
                />
                <div className="mt-2">
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Handle Success Dialog OK button click
  const handleSuccessDialogOk = () => {
    setShowSuccessDialog(false);

    // Verify tokens are stored before redirecting
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      console.error("⚠️ Tokens not found! Redirecting to login...");
      setMessage("Session expired. Please login again.");
      setStatus(false);
      setState({ ...state, open: true });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    console.log("✅ Tokens verified, redirecting to dashboard...");
    // Use router.push instead of window.location.href to prevent page reload
    router.push("/dashboard/seller/my-requests");
  };

  // Success Dialog Component
  const SuccessDialog = () => {
    if (!showSuccessDialog) return null;

    return (
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 text-center pb-0">
              <div className="w-100">
                <div className="mb-3">
                  <i
                    className="fas fa-check-circle text-success"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="modal-body text-center">
              <h4 className="modal-title mb-4 text-success fw-bold">
                Success!
              </h4>
              <div className="mb-4">
                <div className="mb-3 d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <i className="fas fa-check-circle text-success"></i>
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw600">
                      Details Submitted Successfully! Our Agent will contact you
                      soon. Thank You.
                    </p>
                  </div>
                </div>

                <div className="mb-3 d-flex align-items-start">
                  <div className="me-3 mt-1">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw600">
                      We send you a verification mail so please verify on mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <button
                type="button"
                className="ud-btn btn-thm px-5"
                onClick={handleSuccessDialogOk}
              >
                <i className="fas fa-thumbs-up me-2"></i>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(data).forEach((key) => {
      console.log("🚀 ~ handleSubmit ~ data:", data);
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);

    // Validate all fields
    if (!validateForm()) {
      setMessage("Please fix the errors before submitting.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    // Check if OTP is verified
    if (!otpVerified) {
      setMessage("Please verify your email with OTP before submitting.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const role = localStorage.getItem("role") || "seller";
      const interest =
        localStorage.getItem("interestedIn") || "property_listing";

      // Create JSON payload instead of FormData
      const jsonPayload = {
        full_name: data.fullname,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        emirates_id: data.emiratesId,
        role: role,
        interest: interest,
        title_deed: data.titleDeedFileName, // Send file name instead of file
        passport: data.passportFileName, // Send file name instead of file
        otp_number: data.otp, // Include OTP number
      };

      // Debug: Log JSON payload
      console.log("JSON Payload:", jsonPayload);

      freeListingMutation.mutate(jsonPayload, {
        onSuccess: (response) => {
          console.log("🚀 Free Listing Response:", response);

          const data = response?.data || {};

          // === Extract and store tokens ===
          const accessToken =
            data.accessToken ||
            data.access_token ||
            data.tokens?.accessToken ||
            data.tokens?.access_token;

          const refreshToken =
            data.refreshToken ||
            data.refresh_token ||
            data.tokens?.refreshToken ||
            data.tokens?.refresh_token;

          if (accessToken) localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

          // === Extract and store role ===
          const roles = data.role ? [data.role] : [];
          localStorage.setItem("roles", JSON.stringify(roles));

          // === Store user object ===
          const user = {
            user_id: data.user_id,
            full_name: data.fullname,
            email: data.email,
            role: data.role,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isVerified: data.isVerified,
            isPlanActive: data.isPlanActive,
            contactsAllowed: data.contactsAllowed,
          };
          localStorage.setItem("user", JSON.stringify(user));

          // === Additional values like in login ===
          localStorage.setItem("name", data.fullname);
          localStorage.setItem("id", data.user_id);
          localStorage.setItem("loginSuccessfull", "true");
          localStorage.setItem("isPlanActive", String(data.isPlanActive));
          localStorage.setItem(
            "remainingContacts",
            String(data.contactsAllowed)
          );

          // === Set user in app state/store ===
          setUser({
            id: data.user_id,
            fullname: data.fullname,
            email: data.email,
            mobile: data.mobile,
            role: data.role,
            isVerified: data.isVerified,
            isPlanActive: data.isPlanActive,
            contactsAllowed: data.contactsAllowed,
          });

          // === Call login() if tokens exist ===
          if (accessToken && refreshToken) {
            // Assuming login function exists
            // login({ accessToken, refreshToken }, data, roles);
          }

          // === Reset form ===
          setData({
            fullname: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
            titleDeedFile: null,
            passportFile: null,
            titleDeedFileName: "",
            passportFileName: "",
            emiratesId: "",
          });

          setTitleDeedPreview(null);
          setPassportPreview(null);
          setValidationErrors({
            fullname: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
            titleDeedFile: "",
            passportFile: "",
            emiratesId: "",
          });

          setTouchedFields({});
          if (titleDeedInputRef.current) titleDeedInputRef.current.value = "";
          if (passportInputRef.current) passportInputRef.current.value = "";

          setIsSubmitting(false);

          // Show success dialog instead of snackbar
          setShowSuccessDialog(true);
        },

        onError: (error) => {
          console.error("Error submitting free listing:", error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Submission failed. Please try again.";
          setMessage(errorMsg);
          setState({ ...state, open: true });
          setStatus(false);

          if (error?.response?.data?.errors) {
            setApiError(error.response.data.errors);
          }

          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setStatus(false);
      setState({ ...state, open: true });
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <form className="form-style1" onSubmit={handleSubmit} noValidate>
        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Full Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="fullname"
            className={`form-control ${touchedFields.fullname && validationErrors.fullname
              ? "is-invalid"
              : ""
              }`}
            placeholder="Enter Full Name"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.fullname}
            required
          />
          {touchedFields.fullname && validationErrors.fullname && (
            <div className="invalid-feedback d-block">
              {validationErrors.fullname}
            </div>
          )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            name="password"
            className={`form-control ${touchedFields.password && validationErrors.password
              ? "is-invalid"
              : ""
              }`}
            placeholder="Enter Password"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.password}
            required
          />
          {touchedFields.password && validationErrors.password && (
            <div className="invalid-feedback d-block">
              {validationErrors.password}
            </div>
          )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Confirm Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-control ${touchedFields.confirmPassword && validationErrors.confirmPassword
              ? "is-invalid"
              : ""
              }`}
            placeholder="Confirm Password"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.confirmPassword}
            required
          />
          {touchedFields.confirmPassword &&
            validationErrors.confirmPassword && (
              <div className="invalid-feedback d-block">
                {validationErrors.confirmPassword}
              </div>
            )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Email<span className="text-danger">*</span>
          </label>
          <input
            type="email"
            name="email"
            className={`form-control ${touchedFields.email && validationErrors.email ? "is-invalid" : ""
              }`}
            placeholder="Enter Email"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.email}
            required
          />
          {touchedFields.email && validationErrors.email && (
            <div className="invalid-feedback d-block">
              {validationErrors.email}
            </div>
          )}
        </div>

        {/* OTP Verification Section */}
        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Email Verification<span className="text-danger">*</span>
          </label>

          {!otpSent ? (
            <button
              type="button"
              className="ud-btn btn-thm2 w-100"
              onClick={handleSendOtp}
              disabled={isSendingOtp || !data.email || validationErrors.email}
            >
              {isSendingOtp ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="fas fa-envelope me-2"></i>
                  Send OTP to Email
                </>
              )}
            </button>
          ) : !otpVerified ? (
            <div>
              <div className="input-group mb-2">
                <input
                  type="text"
                  name="otp"
                  className={`form-control ${touchedFields.otp && validationErrors.otp ? "is-invalid" : ""}`}
                  placeholder="Enter 6-digit OTP"
                  onChange={inputHandler}
                  onBlur={handleBlur}
                  value={data.otp}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleVerifyOtp}
                  disabled={!data.otp || data.otp.length !== 6}
                >
                  <i className="fas fa-check me-2"></i>
                  Verify
                </button>
              </div>

              {touchedFields.otp && validationErrors.otp && (
                <div className="invalid-feedback d-block">
                  {validationErrors.otp}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  OTP sent to {data.email}
                </small>
                {otpTimer > 0 ? (
                  <small className="text-primary">
                    Resend in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                  </small>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    onClick={handleResendOtp}
                    disabled={!canResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-success d-flex align-items-center mb-0">
              <i className="fas fa-check-circle me-2"></i>
              <span>Email verified successfully!</span>
            </div>
          )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Phone Number<span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            className={`form-control ${touchedFields.mobile && validationErrors.mobile
              ? "is-invalid"
              : ""
              }`}
            placeholder="Enter Phone Number"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.mobile}
            maxLength={10}
            inputMode="tel"
            pattern="[0-9]*"
            required
          />
          {touchedFields.mobile && validationErrors.mobile && (
            <div className="invalid-feedback d-block">
              {validationErrors.mobile}
            </div>
          )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">
            Emirates ID<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="emiratesId"
            className={`form-control ${touchedFields.emiratesId && validationErrors.emiratesId
              ? "is-invalid"
              : ""
              }`}
            placeholder="Enter Emirates ID (e.g., 784-2000-1234567-8)"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.emiratesId}
            required
          />
          {touchedFields.emiratesId && validationErrors.emiratesId && (
            <div className="invalid-feedback d-block">
              {validationErrors.emiratesId}
            </div>
          )}
        </div>

        {renderDocumentUpload(
          "titleDeed",
          "Title Deed Document",
          titleDeedPreview,
          isUploadingTitleDeed,
          titleDeedInputRef
        )}

        {renderDocumentUpload(
          "passport",
          "Passport Document",
          passportPreview,
          isUploadingPassport,
          passportInputRef
        )}

        {apiError && (
          <div className="mb20 alert alert-danger">
            {apiError.map((err, index) => (
              <p key={index} className="mb-1">
                {err.msg || err}
              </p>
            ))}
          </div>
        )}

        <div className="d-grid mb20">
          <button
            className="ud-btn btn-thm"
            type="submit"
            disabled={
              isSubmitting || isUploadingTitleDeed || isUploadingPassport
            }
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              <>
                Submit Free Listing <i className="fal fa-arrow-right-long" />
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <small className="text-muted">
            * Required fields. Supported formats: PDF, JPG, PNG (Max 5MB each)
          </small>
        </div>
      </form>

      {/* Success Dialog */}
      <SuccessDialog />

      <StatusSnackbar
        message={message}
        state={state}
        status={status}
        onClose={handleClose}
      />

      <FreeListingAnimatedModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        ref={modalRef}
      />
    </>
  );
};

export default FreeListingForm;
