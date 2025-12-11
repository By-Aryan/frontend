"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AnimatedModal from "../AnimatedModal";
import GoogleAuth from "../google-oauth/GoogleOauth";

const Modal = dynamic(() => import("bootstrap"), { ssr: false });

const SignUp = () => {
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [show, setShow] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [data, setData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "", // Added confirm password field
    otp_number: "", // Added OTP field
    documentFile: null,
    emiratesId: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "", // Added validation for confirm password
    otp_number: "", // Added OTP validation
    documentFile: "",
    emiratesId: "",
  });
  const [documentPreview, setDocumentPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({}); // Track which fields have been touched
  const router = useRouter();
  const pathname = usePathname();
  const mutation = usePost("/auth/signup");
  const mutation1 = usePost("/auth/generate-otp");
  const sellerMutation = usePost("/seller/register");
  const { setUser } = useUserStore();
  const { login } = useAuth();

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    if (pathname === "/register") {
      const token = localStorage.getItem("accessToken");
      const firstVisit = localStorage.getItem("firstVisit");
      const role = localStorage.getItem("role");

      const itemsToRemove = ['tempData', 'formState', 'registrationStep'];
      itemsToRemove.forEach(item => localStorage.removeItem(item));

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
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
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

      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter.";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number.";
        } else if (!/(?=.*[@$!%*?&#])/.test(value)) {
          error = "Password must contain at least one special character (@$!%*?&#).";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password.";
        } else if (value !== allValues.password) {
          error = "Passwords do not match.";
        }
        break;

      case "otp_number":
        if (!value.trim()) {
          error = "OTP is required.";
        } else if (!/^[0-9]{6}$/.test(value)) {
          error = "OTP must be exactly 6 digits.";
        }
        break;

      case "emiratesId":
        if (!value.trim()) {
          error = "Emirates ID is required.";
        } else if (!/^[0-9]{15}$/.test(value)) {
          error = "Enter a valid 15-digit Emirates ID.";
        }
        break;

      case "documentFile":
        if (!value) {
          error = "Document file is required.";
        } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
          error = "File size should not exceed 5MB.";
        } else {
          const acceptedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
            "image/jpg"
          ];

          if (!acceptedTypes.includes(value.type)) {
            error = "Only PDF, Word documents, and images (JPEG, PNG) are allowed.";
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(data).forEach((key) => {
      if (key === "documentFile" && localStorage.getItem("role") !== "seller") {
        return; // Skip document validation for non-sellers
      }

      if (key === "emiratesId" && localStorage.getItem("role") !== "seller") {
        return; // Skip Emirates ID validation for non-sellers
      }

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
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));

    // Only validate if the field has been touched or has a value
    if (touchedFields[name] || value) {
      const error = validateInput(name, value, { ...data, [name]: value });
      setValidationErrors(prev => ({ ...prev, [name]: error }));
    }

    // Clear API errors when user starts typing
    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    markFieldAsTouched(name);

    // Validate field on blur
    const error = validateInput(name, data[name], data);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({ ...prev, documentFile: file }));
      markFieldAsTouched("documentFile");

      const error = validateInput("documentFile", file, data);
      setValidationErrors(prev => ({ ...prev, documentFile: error }));

      // Create file preview
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeDocument = () => {
    setData((prev) => ({ ...prev, documentFile: null }));
    setDocumentPreview(null);
    setValidationErrors((prev) => ({ ...prev, documentFile: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    // Validate email first
    const emailError = validateInput("email", data.email);
    if (emailError) {
      setValidationErrors(prev => ({ ...prev, email: emailError }));
      setMessage("Please enter a valid email address.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    setOtpLoading(true);
    const role = localStorage.getItem("role");
    const otpType = role === "seller" ? "seller-register" : "signup";

    mutation1.mutate(
      { email: data.email, otp_type: otpType },
      {
        onSuccess: (response) => {
          console.log("OTP sent:", response);
          setOtpSent(true);
          setOtpTimer(180); // 3 minutes countdown
          setMessage("OTP sent successfully to your email!");
          setStatus(true);
          setState({ ...state, open: true });
          setOtpLoading(false);
        },
        onError: (error) => {
          console.error("OTP send error:", error);
          const errorMsg = error.response?.data?.error?.message || "Failed to send OTP. Please try again.";
          setMessage(errorMsg);
          setStatus(false);
          setState({ ...state, open: true });
          setOtpLoading(false);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(data).forEach(key => {
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

    // Check if OTP was sent and entered
    if (!otpSent) {
      setMessage("Please request and verify OTP before creating account.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    if (!data.otp_number) {
      setMessage("Please enter the OTP sent to your email.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const role = localStorage.getItem("role");
      const interest = localStorage.getItem("interestedIn");

      // Remove confirmPassword from the data before sending to API
      const { confirmPassword, ...submitData } = data;

      if (role === "seller") {
        // Create FormData for seller registration
        const formData = new FormData();
        formData.append("fullname", submitData.fullname);
        formData.append("email", submitData.email);
        formData.append("mobile", submitData.mobile);
        formData.append("password", submitData.password);
        formData.append("otp_number", submitData.otp_number); // ✅ Include OTP
        formData.append("documentFile", submitData.documentFile);
        formData.append("emiratesId", submitData.emiratesId);
        formData.append("role", role);
        formData.append("interest", interest);

        sellerMutation.mutate(formData, {
          onSuccess: (details) => {
            console.log(details);
            localStorage.removeItem("user", "ot");
            setUser(details.data);

            // Extract tokens and call login function to save them in localStorage
            const accessToken = details.data?.accessToken || details.data?.access_token;
            const refreshToken = details.data?.refreshToken || details.data?.refresh_token;

            if (accessToken && refreshToken) {
              const tokens = { accessToken, refreshToken };
              const userRoles = details.data.role ? [details.data.role] : [];
              login(tokens, details.data, userRoles);
            }

            // Store additional user data in localStorage
            localStorage.setItem("name", details.data.full_name);
            localStorage.setItem("id", details.data.user_id);
            localStorage.setItem("loginSuccessfull", "true");
            localStorage.setItem("role", details.data.role);
            localStorage.setItem("isPlanActive", String(details.data.isPlanActive || false));
            localStorage.setItem("remainingContacts", String(details.data.contactsAllowed || details.data.remainingContacts || 0));

            setStatus(true);
            setMessage("Account created successfully! Redirecting...");
            setState({ ...state, open: true });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push("/");
            }, 2000);
          },
          onError: (error) => {
            console.error("Error creating seller", error.response?.data?.error?.message);
            const errorMsg = error.response?.data?.error?.message || "Signup failed. Please check your details.";
            setMessage(errorMsg);
            setState({ ...state, open: true });
            setStatus(false);
            if (error.response?.data?.errors) {
              setApiError(error.response.data.errors);
            }
            setIsSubmitting(false);
          },
        });
      } else {
        // For buyer registration - include OTP
        mutation.mutate(
          { ...submitData, role, interest },
          {
            onSuccess: (details) => {
              console.log(details);
              localStorage.removeItem("user", "ot");
              setUser(details.data);

              // Extract tokens and call login function to save them in localStorage
              const accessToken = details.data?.accessToken || details.data?.access_token;
              const refreshToken = details.data?.refreshToken || details.data?.refresh_token;

              if (accessToken && refreshToken) {
                const tokens = { accessToken, refreshToken };
                const userRoles = details.data.role ? [details.data.role] : [];
                login(tokens, details.data, userRoles);
              }

              // Store additional user data in localStorage
              localStorage.setItem("name", details.data.full_name);
              localStorage.setItem("id", details.data.user_id);
              localStorage.setItem("loginSuccessfull", "true");
              localStorage.setItem("role", details.data.role);
              localStorage.setItem("isPlanActive", String(details.data.isPlanActive || false));
              localStorage.setItem("remainingContacts", String(details.data.contactsAllowed || details.data.remainingContacts || 0));

              // Show success snackbar
              setStatus(true);
              setMessage("Account created successfully! Redirecting...");
              setState({ ...state, open: true });

              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push("/");
              }, 2000);
            },
            onError: (error) => {
              console.error("Error creating user", error.response?.data?.error?.message);
              const errorMsg = error.response?.data?.error?.message || "Signup failed. Please check your details.";
              setMessage(errorMsg);
              setState({ ...state, open: true });
              setStatus(false);
              if (error.response?.data?.errors) {
                setApiError(error.response.data.errors);
              }
              setIsSubmitting(false);
            },
          }
        );
      }
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
          <label className="form-label fw600 dark-color">Full Name<span className="text-danger">*</span></label>
          <input
            type="text"
            name="fullname"
            className={`form-control ${touchedFields.fullname && validationErrors.fullname ? 'is-invalid' : ''}`}
            placeholder="Enter Full Name"
            onChange={inputHandler}
            onBlur={handleBlur}
            value={data.fullname}
            required
          />
          {touchedFields.fullname && validationErrors.fullname && (
            <div className="invalid-feedback d-block">{validationErrors.fullname}</div>
          )}
        </div>

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">Email<span className="text-danger">*</span></label>
          <div className="d-flex gap-2">
            <input
              type="email"
              name="email"
              className={`form-control ${touchedFields.email && validationErrors.email ? 'is-invalid' : ''}`}
              placeholder="Enter Email"
              onChange={inputHandler}
              onBlur={handleBlur}
              value={data.email}
              required
              disabled={otpSent}
            />
            <button
              type="button"
              className="btn btn-primary text-nowrap"
              onClick={handleSendOtp}
              disabled={otpLoading || otpTimer > 0 || !data.email}
              style={{ minWidth: '120px' }}
            >
              {otpLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Sending...
                </>
              ) : otpTimer > 0 ? (
                `Resend (${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')})`
              ) : otpSent ? (
                'Resend OTP'
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
          {touchedFields.email && validationErrors.email && (
            <div className="invalid-feedback d-block">{validationErrors.email}</div>
          )}
        </div>

        {otpSent && (
          <div className="sm:mb20 mb15">
            <label className="form-label fw600 dark-color">
              Enter OTP<span className="text-danger">*</span>
              <small className="text-muted ms-2">(Check your email)</small>
            </label>
            <input
              type="text"
              name="otp_number"
              className={`form-control ${touchedFields.otp_number && validationErrors.otp_number ? 'is-invalid' : ''}`}
              placeholder="Enter 6-digit OTP"
              onChange={inputHandler}
              onBlur={handleBlur}
              value={data.otp_number}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />
            {touchedFields.otp_number && validationErrors.otp_number && (
              <div className="invalid-feedback d-block">{validationErrors.otp_number}</div>
            )}
          </div>
        )}

        <div className="sm:mb20 mb15">
          <label className="form-label fw600 dark-color">Phone Number<span className="text-danger">*</span></label>
          <input
            type="tel"
            name="mobile"
            className={`form-control ${touchedFields.mobile && validationErrors.mobile ? 'is-invalid' : ''}`}
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
            <div className="invalid-feedback d-block">{validationErrors.mobile}</div>
          )}
        </div>

        <div className="mb20">
          <label className="form-label fw600 dark-color">Password<span className="text-danger">*</span></label>
          <div className={`form-control d-flex align-items-center ${touchedFields.password && validationErrors.password ? 'is-invalid' : ''}`}>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="w-100 border-0"
              onChange={inputHandler}
              onBlur={handleBlur}
              value={data.password}
              required
              style={{ outline: "none" }}
            />
            <button
              type="button"
              className="pointer bg-transparent border-0"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {touchedFields.password && validationErrors.password && (
            <div className="invalid-feedback d-block">{validationErrors.password}</div>
          )}
        </div>

        {/* New Confirm Password Field */}
        <div className="mb20">
          <label className="form-label fw600 dark-color">Confirm Password<span className="text-danger">*</span></label>
          <div className={`form-control d-flex align-items-center ${touchedFields.confirmPassword && validationErrors.confirmPassword ? 'is-invalid' : ''}`}>
            <input
              type={show ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Your Password"
              className="w-100 border-0"
              onChange={inputHandler}
              onBlur={handleBlur}
              value={data.confirmPassword}
              required
              style={{ outline: "none" }}
            />
          </div>
          {touchedFields.confirmPassword && validationErrors.confirmPassword && (
            <div className="invalid-feedback d-block">{validationErrors.confirmPassword}</div>
          )}
        </div>

        {localStorage.getItem("role") === "seller" && (
          <>
            <div className="sm:mb20 mb15">
              <label className="form-label fw600 dark-color">Emirates ID<span className="text-danger">*</span></label>
              <input
                type="text"
                name="emiratesId"
                className={`form-control ${touchedFields.emiratesId && validationErrors.emiratesId ? 'is-invalid' : ''}`}
                placeholder="784-YYYY-XXXXXXXX"
                onChange={inputHandler}
                onBlur={handleBlur}
                value={data.emiratesId}
                required
              />
              {touchedFields.emiratesId && validationErrors.emiratesId && (
                <div className="invalid-feedback d-block">{validationErrors.emiratesId}</div>
              )}
            </div>

            <div className="sm:mb20 mb15">
              <label className="form-label fw600 dark-color">Document File<span className="text-danger">*</span></label>
              <input
                type="file"
                name="documentFile"
                className={`form-control ${touchedFields.documentFile && validationErrors.documentFile ? 'is-invalid' : ''}`}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                required
                ref={fileInputRef}
              />
              <small className="text-muted">
                Please upload a PDF, Word document, or image (max 5MB)
              </small>
              {touchedFields.documentFile && validationErrors.documentFile && (
                <div className="invalid-feedback d-block">{validationErrors.documentFile}</div>
              )}

              {/* Document Preview Section */}
              {documentPreview && (
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw600">Selected File: {data.documentFile?.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={removeDocument}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 border p-2">
                    {data.documentFile?.type === "application/pdf" ? (
                      <>
                        <iframe
                          src={documentPreview}
                          width="100%"
                          height="300px"
                          style={{ border: "none" }}
                          title="Document Preview"
                        />
                        <div className="text-center mt-2">
                          <a
                            href={documentPreview}
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
                          src={documentPreview}
                          alt="Document Preview"
                          style={{ maxWidth: "100%", maxHeight: "300px" }}
                          className="img-fluid"
                          width={100}
                          height={100}
                        />
                        <div className="mt-2">
                          <a
                            href={documentPreview}
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
          </>
        )}

        {apiError && (
          <div className="mb20 alert alert-danger">
            {apiError.map((err, index) => (
              <p key={index} className="mb-1">
                {err.msg}
              </p>
            ))}
          </div>
        )}

        <div className="d-grid mb20">
          <button
            className="ud-btn btn-thm"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating account...
              </>
            ) : (
              <>
                Create account <i className="fal fa-arrow-right-long" />
              </>
            )}
          </button>
        </div>

        <div className="hr_content mb20">
          <hr />
          <span className="hr_top_text">OR</span>
        </div>

        <div className="d-grid mb10">
          <GoogleAuth />
        </div>

        <p className="dark-color text-center mb0 mt10">
          Already Have an Account?{" "}
          <Link className="dark-color fw600" href="/login">
            Login
          </Link>
        </p>
      </form>
      <StatusSnackbar message={message} state={state} status={status} />

      <AnimatedModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        ref={modalRef}
      />
    </>
  );
};

export default SignUp;