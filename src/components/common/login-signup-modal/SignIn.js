// "use client";
// import { useAuth } from "@/hooks/useAuth";
// import { usePost } from "@/hooks/usePost";
// import { useUserStore } from "@/store/store";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import GoogleAuth from "../google-oauth/GoogleOauth";
// import Loader from "../Loader";
// const Modal = dynamic(() => import("bootstrap"), { ssr: false });

// const SignIn = () => {
//   const modalRef = useRef(null);
//   const modalInstanceRef = useRef(null);
//   const [show, setShow] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [validationError, setValidationError] = useState("");
//   const [error, setError] = useState("");
//   const [data, setData] = useState({
//     email: "",
//     mobile: "",
//     password: "",
//   });
//   const router = useRouter();
//   const { setUser, user } = useUserStore();
//   const { login } = useAuth();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       import("bootstrap").then(({ Modal }) => {
//         const modalElement = document.getElementById("loginSignupModal");
//         if (modalElement) {
//           modalRef.current = modalElement;
//           modalInstanceRef.current = Modal.getOrCreateInstance(modalElement);
//         }
//       });
//     }
//   }, []);

//   const mutation = usePost("/auth/login");
//   const verifyMutation = usePost("/auth/generate-otp");

//   const inputHandler = (e) => {
//     const { name, value } = e.target;

//     // Special validation for the email/mobile field
//     if (name === "userInput") {
//       if (/^\d{10}$/.test(value)) {
//         setData((prev) => ({ ...prev, email: "", mobile: value }));
//         setValidationError(""); // Clear error if valid
//       } else if (/^\S+@\S+\.\S+$/.test(value)) {
//         setData((prev) => ({ ...prev, email: value, mobile: "" }));
//         setValidationError(""); // Clear error if valid
//       } else {
//         setData((prev) => ({ ...prev, email: "", mobile: "" }));
//         setValidationError(
//           "Please enter a valid email or 10-digit mobile number."
//         );
//       }
//     } else {
//       // Handle password normally
//       setData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Send verification email and redirect to OTP verification page
//   const sendVerificationEmail = (email) => {
//     setIsLoading(true);
//     verifyMutation.mutate(
//       { email: email, otp_type: "varification" },
//       {
//         onSuccess: () => {
//           // Close modal if open
//           if (modalInstanceRef.current) {
//             modalInstanceRef.current.hide();

//             // Cleanup backdrop manually
//             const modalBackdrops = document.querySelectorAll(".modal-backdrop");
//             modalBackdrops.forEach((backdrop) => backdrop.remove());

//             // Remove modal classes
//             document.body.classList.remove("modal-open");
//             document.body.style.overflow = "";
//             document.body.style.paddingRight = "";
//           }

//           // Redirect to OTP verification page
//           router.push("/verification/verify-otp");
//           setIsLoading(false);
//         },
//         onError: (error) => {
//           setIsLoading(false);
//           setError(error.response?.data?.error?.message || "Failed to send verification email.");
//         }
//       }
//     );
//   };

//   const handlePostLoginRedirect = (router, role) => {
//     const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");

//     if (redirectAfterLogin) {
//       sessionStorage.removeItem("redirectAfterLogin");
//       router.replace(redirectAfterLogin);
//       return;
//     }

//     switch (role) {
//       case "seller":
//         router.replace("/dashboard/seller/my-properties");
//         break;
//       case "buyer":
//         router.replace("/dashboard/my-profile");
//         break;
//       case "agent":
//         router.replace("/dashboard/agent/property-listed-by-me");
//         break;
//       case "admin":
//         router.replace("/dashboard/admin/all-users");
//         break;
//       case "driver":
//         router.replace("/dashboard/driver/assigned-properties");
//         break;
//       default:
//         router.replace("/dashboard/my-profile");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(""); // Clear previous errors

//     mutation.mutate(data, {
//       onSuccess: (details) => {
//         localStorage.removeItem("id");
//         setUser(details.data);

//         if (!details.data.isVerified) {
//           // User is not verified - store email in session storage and send verification email
//           const userEmail = data.email || details.data.email;
//           sessionStorage.setItem("e", userEmail);
//           sessionStorage.setItem("ot", "varification");

//           // Automatically trigger email verification process
//           sendVerificationEmail(userEmail);
//         } else {
//           // User is verified - proceed with normal login

//           let accessToken =
//             details.data?.accessToken ||
//             details.data?.access_token ||
//             details.accessToken ||
//             details.access_token ||
//             details.data?.tokens?.accessToken ||
//             details.data?.tokens?.access_token;

//           let refreshToken =
//             details.data?.refreshToken ||
//             details.data?.refresh_token ||
//             details.refreshToken ||
//             details.refresh_token ||
//             details.data?.tokens?.refreshToken ||
//             details.data?.tokens?.refresh_token;

//           if (!accessToken || !refreshToken) {
//             setTimeout(() => {
//               accessToken = localStorage.getItem("accessToken") || getCookieValue("accessToken");
//               refreshToken = localStorage.getItem("refreshToken") || getCookieValue("refreshToken");

//               if (accessToken && refreshToken) {
//                 const tokens = { accessToken, refreshToken };
//                 const userRoles = details.data.role ? [details.data.role] : [];
//                 login(tokens, details.data, userRoles);
//               } else {
//                 const tokens = { accessToken: "", refreshToken: "" };
//                 const userRoles = details.data.role ? [details.data.role] : [];
//                 login(tokens, details.data, userRoles);
//               }
//             }, 100);
//           } else {
//             const tokens = { accessToken, refreshToken };
//             const userRoles = details.data.role ? [details.data.role] : [];
//             login(tokens, details.data, userRoles);
//           }

//           if (modalInstanceRef.current) {
//             modalInstanceRef.current.hide();
//           }

//           // Cleanup backdrop manually
//           const modalBackdrops = document.querySelectorAll(".modal-backdrop");
//           modalBackdrops.forEach((backdrop) => backdrop.remove());

//           // Store user data in localStorage
//           localStorage.setItem("name", details.data.full_name);
//           localStorage.setItem("id", details.data.user_id);
//           localStorage.setItem("loginSuccessfull", "true");
//           localStorage.setItem("isPlanActive", String(details.data.isPlanActive));
//           localStorage.setItem("remainingContacts", String(details.data.remainingContacts));

//           handlePostLoginRedirect(router, details.data.role);
//           setIsLoading(false);
//         }
//       },
//       onError: (error) => {
//         setIsLoading(false);
//         console.error("Login error:", error);
//         setError(
//           error.response?.data?.error?.message || "Something went wrong."
//         );
//       },
//     });
//   };

//   const getCookieValue = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   return (
//     <form className="form-style1" onSubmit={handleSubmit}>
//       <div className="sm:mb25 mb15">
//         <label className="form-label fw600 dark-color">Email</label>
//         <input
//           type="text"
//           name="userInput"
//           className="form-control"
//           placeholder="Enter Email or Mobile Number"
//           onChange={inputHandler}
//           required
//         />
//         {validationError && (
//           <p style={{ color: "red", fontSize: "14px" }}>{validationError}</p>
//         )}
//       </div>

//       <div className="sm:mb15 mb15">
//         <label className="form-label fw600 dark-color">Password</label>
//         <div
//           className="form-control"
//           style={{ display: "flex", alignItems: "center" }}
//         >
//           <input
//             type={`${show ? "text" : "password"}`}
//             name="password"
//             placeholder="Enter Password"
//             className="w-100"
//             onChange={inputHandler}
//             required
//             style={{ border: "none", outline: "none" }}
//           />
//           <p
//             className="border-none pointer mt-3"
//             onClick={() => {
//               setShow(!show);
//             }}
//           >
//             {show ? "Hide" : "Show"}
//           </p>
//         </div>
//       </div>

//       <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
//         <label className="custom_checkbox fz14 ff-heading">
//           Remember me
//           <input type="checkbox" defaultChecked="checked" />
//           <span className="checkmark" />
//         </label>
//         <Link className="fz14 ff-heading" href="/verification/verify-email">
//           Lost your password?
//         </Link>
//       </div>

//       {error && <p style={{ color: "red", fontSize: "16px" }}>{error}</p>}

//       <div className="d-grid mb20">
//         <button
//           className="ud-btn btn-thm"
//           type="submit"
//           disabled={isLoading || validationError !== ""}
//         >
//           {isLoading ? (
//             <Loader />
//           ) : (
//             <>
//               Sign in <i className="fal fa-arrow-right-long" />
//             </>
//           )}
//         </button>
//       </div>

//       <div className="hr_content mb20">
//         <hr />
//         <span className="hr_top_text">OR</span>
//       </div>

//       <div className="d-grid mb10">
//         <GoogleAuth />
//       </div>

//       <p className="dark-color text-center text-nowrap mb0 mt10">
//         Not signed up?{" "}
//         <Link
//           className="dark-color fw600"
//           href="/register"
//           onClick={() => {
//             const modalElement = document.getElementById("loginSignupModal");
//             if (modalElement) {
//               const modalInstance = Modal.getInstance(modalElement);
//               if (modalInstance) {
//                 modalInstance.hide();
//               }
//             }
//             // Remove all modal backdrops
//             const modalBackdrops = document.querySelectorAll(".modal-backdrop");
//             modalBackdrops.forEach((backdrop) => backdrop.remove());
//             // Clean up modal-open class and styles
//             document.body.classList.remove("modal-open");
//             document.body.style.overflow = "";
//             document.body.style.paddingRight = "";
//           }}
//         >
//           Create an account.
//         </Link>
//       </p>
//     </form>
//   );
// };

// export default SignIn;
"use client";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import { handlePostLoginRedirect } from "@/utils/authUtils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GoogleAuth from "../google-oauth/GoogleOauth";
import Loader from "../Loader";
const Modal = dynamic(() => import("bootstrap"), { ssr: false });

const SignIn = () => {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const router = useRouter();
  const { setUser, user, clearUser } = useUserStore();
  const { login, logout } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap").then(({ Modal }) => {
        const modalElement = document.getElementById("loginSignupModal");
        if (modalElement) {
          modalRef.current = modalElement;
          modalInstanceRef.current = Modal.getOrCreateInstance(modalElement);
        }
      });

      // Listen for force logout events
      const handleForceLogout = () => {
        clearUser();
        logout();
        setError("Your session has expired. Please login again.");
      };

      window.addEventListener('forceLogout', handleForceLogout);
      
      return () => {
        window.removeEventListener('forceLogout', handleForceLogout);
      };
    }
  }, [clearUser, logout]);

  const mutation = usePost("/auth/login");
  const verifyMutation = usePost("/auth/generate-otp");

  const inputHandler = (e) => {
    const { name, value } = e.target;

    // Special validation for the email/mobile field
    if (name === "userInput") {
      if (/^\d{10}$/.test(value)) {
        setData((prev) => ({ ...prev, email: "", mobile: value }));
        setValidationError(""); // Clear error if valid
      } else if (/^\S+@\S+\.\S+$/.test(value)) {
        setData((prev) => ({ ...prev, email: value, mobile: "" }));
        setValidationError(""); // Clear error if valid
      } else {
        setData((prev) => ({ ...prev, email: "", mobile: "" }));
        setValidationError(
          "Please enter a valid email or 10-digit mobile number."
        );
      }
    } else {
      // Handle password normally
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Send verification email and redirect to OTP verification page
  const sendVerificationEmail = (email) => {
    setIsLoading(true);
    verifyMutation.mutate(
      { email: email, otp_type: "varification" },
      {
        onSuccess: () => {
          // Close modal if open
          if (modalInstanceRef.current) {
            modalInstanceRef.current.hide();

            // Cleanup backdrop manually
            const modalBackdrops = document.querySelectorAll(".modal-backdrop");
            modalBackdrops.forEach((backdrop) => backdrop.remove());

            // Remove modal classes
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }

          // Redirect to OTP verification page
          router.push("/verification/verify-otp");
          setIsLoading(false);
        },
        onError: (error) => {
          setIsLoading(false);
          setError(error.response?.data?.error?.message || "Failed to send verification email.");
        }
      }
    );
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    mutation.mutate(data, {
      onSuccess: (details) => {
        localStorage.removeItem("id");
        setUser(details.data);

        // COMMENTED OUT: OTP verification requirement for regular login
        // if (!details.data.isVerified) {
        //   // User is not verified - store email in session storage and send verification email
        //   const userEmail = data.email || details.data.email;
        //   sessionStorage.setItem("e", userEmail);
        //   sessionStorage.setItem("ot", "varification");

        //   // Automatically trigger email verification process
        //   sendVerificationEmail(userEmail);
        // } else {
          // User login - proceed without OTP verification
          let accessToken =
            details.data?.accessToken ||
            details.data?.access_token ||
            details.accessToken ||
            details.access_token ||
            details.data?.tokens?.accessToken ||
            details.data?.tokens?.access_token;

          let refreshToken =
            details.data?.refreshToken ||
            details.data?.refresh_token ||
            details.refreshToken ||
            details.refresh_token ||
            details.data?.tokens?.refreshToken ||
            details.data?.tokens?.refresh_token;

          if (!accessToken || !refreshToken) {
            setTimeout(() => {
              accessToken = localStorage.getItem("accessToken") || getCookieValue("accessToken");
              refreshToken = localStorage.getItem("refreshToken") || getCookieValue("refreshToken");

              if (accessToken && refreshToken) {
                const tokens = { accessToken, refreshToken };
                const userRoles = details.data.role ? [details.data.role] : [];
                login(tokens, details.data, userRoles);
              } else {
                setError("Authentication tokens not received. Please try again.");
                setIsLoading(false);
                return;
              }
            }, 100);
          } else {
            const tokens = { accessToken, refreshToken };
            const userRoles = details.data.role ? [details.data.role] : [];
            login(tokens, details.data, userRoles);
          }

          if (modalInstanceRef.current) {
            modalInstanceRef.current.hide();
          }

          // Cleanup backdrop manually
          const modalBackdrops = document.querySelectorAll(".modal-backdrop");
          modalBackdrops.forEach((backdrop) => backdrop.remove());

          // Store user data in localStorage
          localStorage.setItem("name", details.data.full_name);
          localStorage.setItem("id", details.data.user_id);
          localStorage.setItem("loginSuccessfull", "true");
          localStorage.setItem("isPlanActive", String(details.data.isPlanActive));
          localStorage.setItem("remainingContacts", String(details.data.remainingContacts || details.data.contactsAllowed));

          // If there was a pending notify action (user clicked Notify Me before login), send it now
          try {
            const pending = sessionStorage.getItem('pendingNotify');
            if (pending) {
              (async () => {
                try {
                  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notify/property`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: pending,
                  });
                  if (resp.ok) {
                    sessionStorage.removeItem('pendingNotify');
                    // optional: notify user
                    // alert('Your notification request was processed — check your email.');
                  } else {
                    console.error('Pending notify failed:', await resp.text());
                  }
                } catch (err) {
                  console.error('Error sending pending notify:', err);
                }
              })();
            }
          } catch (err) {
            console.error('Error reading pending notify from sessionStorage:', err);
          }

          handlePostLoginRedirect(router, details.data.role);
        // } // End of commented OTP verification block
          setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        console.error("Login error:", error);
        
        // Handle different types of errors
        if (error.response?.status === 401) {
          setError("Invalid credentials. Please check your email/mobile and password.");
        } else if (error.response?.status === 403) {
          setError("Account access restricted. Please contact support.");
        } else if (error.response?.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(
            error.response?.data?.error?.message || 
            error.response?.data?.message || 
            "Login failed. Please try again."
          );
        }
      },
    });
  };

  const getCookieValue = (name) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="sm:mb25 mb15">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="text"
          name="userInput"
          className="form-control"
          placeholder="Enter Email or Mobile Number"
          onChange={inputHandler}
          required
        />
        {validationError && (
          <p style={{ color: "red", fontSize: "14px" }}>{validationError}</p>
        )}
      </div>

      <div className="sm:mb15 mb15">
        <label className="form-label fw600 dark-color">Password</label>
        <div
          className="form-control"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type={`${show ? "text" : "password"}`}
            name="password"
            placeholder="Enter Password"
            className="w-100"
            onChange={inputHandler}
            required
            style={{ border: "none", outline: "none" }}
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
      </div>

      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" defaultChecked="checked" />
          <span className="checkmark" />
        </label>
        <Link className="fz14 ff-heading" href="/verification/verify-email">
          Lost your password?
        </Link>
      </div>

      {error && <p style={{ color: "red", fontSize: "16px" }}>{error}</p>}

      <div className="d-grid mb20">
        <button
          className="ud-btn btn-thm"
          type="submit"
          disabled={isLoading || validationError !== ""}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              Sign in <i className="fal fa-arrow-right-long" />
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

      <p className="dark-color text-center text-nowrap mb0 mt10">
        Not signed up?{" "}
        <Link
          className="dark-color fw600"
          href="/register"
          onClick={() => {
            const modalElement = document.getElementById("loginSignupModal");
            if (modalElement) {
              const modalInstance = Modal.getInstance(modalElement);
              if (modalInstance) {
                modalInstance.hide();
              }
            }
            // Remove all modal backdrops
            const modalBackdrops = document.querySelectorAll(".modal-backdrop");
            modalBackdrops.forEach((backdrop) => backdrop.remove());
            // Clean up modal-open class and styles
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }}
        >
          Create an account.
        </Link>
      </p>
    </form>
  );
};

export default SignIn;