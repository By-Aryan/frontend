"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import { handlePostLoginRedirect } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [resendOtp, setResendOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [ot, setOt] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const mutation = usePost("/auth/verify-otp");
  const mutation2 = usePost("/auth/generate-otp");
  const router = useRouter();
  const inputRef = useRef(null);
  const { user } = useUserStore();
  const { login } = useAuth();

  useEffect(() => {
    const email = sessionStorage.getItem("e");
    const ot = sessionStorage.getItem("ot");
    setEmail(email || user?.email);
    setOt(ot);
  }, []);

  useEffect(() => {
    setOtp(new Array(6).fill(""));
    // startTimer()
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [resendOtp]);

  const handleResendOtp = () => {
    setIsResendEnabled(false);
    mutation2.mutate(
      { email: email, otp_type: ot },
      {
        onSuccess: (details) => {
          setResendOtp(true);
          setTimeLeft(180);
          setStatus(true);
          setMessage("OTP sent successfully!");
          setState({ ...state, open: true });
        },
        onError: (error) => {
          console.log(`error during generating otp :`, error);
          setStatus(false);
          setMessage("Failed to send OTP. Please try again.");
          setState({ ...state, open: true });
        },
      }
    );
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (element, index, event) => {
    if (event.key === "Backspace") {
      if (element.previousSibling && !element.value) {
        element.previousSibling.focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    const otp_number = otp.join("");
    mutation.mutate(
      { email: email, otp_number, otp_type: "varification" },
      {
        onSuccess: (details) => {
          console.log("otp verification successfull", details);
          setStatus(true);
          setMessage("OTP verified successfully!");
          setState({ ...state, open: true });
          if (ot === "forgot") {
            router.push(`/create-new-password?email=${email}`);
          } else if (ot === "varification") {
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
              accessToken = accessToken || getCookieValue("accessToken");
              refreshToken = refreshToken || getCookieValue("refreshToken");
            }

            if (accessToken && refreshToken) {
              const tokens = { accessToken, refreshToken };
              const userRoles = details.data?.role ? [details.data.role] : [];
              const userData = details.data || {};

              login(tokens, userData, userRoles);

              if (userData.full_name) localStorage.setItem("name", userData.full_name);
              if (userData.user_id) localStorage.setItem("id", userData.user_id);
              localStorage.setItem("loginSuccessfull", "true");
              if (userData.isPlanActive !== undefined) localStorage.setItem("isPlanActive", String(userData.isPlanActive));
              if (userData.remainingContacts !== undefined) localStorage.setItem("remainingContacts", String(userData.remainingContacts));

              setTimeout(() => {
                handlePostLoginRedirect(router, userData.role);
              }, 2000);
            } else {
              const existingToken = localStorage.getItem("accessToken");
              if (existingToken) {
                setTimeout(() => {
                  const storedRoles = localStorage.getItem("roles");
                  const roles = storedRoles ? JSON.parse(storedRoles) : [];
                  const userRole = roles[0];

                  handlePostLoginRedirect(router, userRole);
                }, 2000);
              } else {
                setTimeout(() => {
                  router.push("/login");
                }, 2000);
              }
            }
          }
        },
        onError: (error) => {
          console.error("Error creating user", error);
          if (error.response.data.status == "Failed") {
            setError("Invalid OTP");
            setStatus(false);
            setMessage(error.response.data.error.message ||"Invalid OTP. Please try again.");
            if(error.response.data.error.message == "User already verified, OTP verification failed"){
              setTimeout(() => {
                router.push("/login");
              }, 2000);
            }
            setState({ ...state, open: true });
          }
        },
      }
    );
  };

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-xl text-center space-y-10">
          <h2 className="text-2xl  font-[200]">Verify OTP</h2>
          <p className="text-gray-500 mt-2">
            Enter the OTP sent to <span className="font-medium">{email}</span>
          </p>
          <form onSubmit={handleOtpSubmit}>
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  ref={index === 0 ? inputRef : null}
                  autoComplete="off"
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e.target, index, e)}
                  className="am:w-10 w-8 sm:h-12 h-9 sm:w-12 text-center text-lg font-semibold border-2 border-green-900 rounded-lg focus:border-green-300 focus:ring-2 focus:ring-[#068662] outline-none transition-all"
                />
              ))}
            </div>
            {error && <p style={{ color: "red", marginTop: "1px" }}>{error}</p>}

            {timeLeft > 0 && !isResendEnabled ? (
              <>
                <p className="text-md font-bold text-gray-300 mt-4">
                  Time left:{" "}
                  <span className="font-bold text-[#068662]">
                    {formatTime(timeLeft)}
                  </span>
                  s
                </p>

                <button
                  className={`ud-btn btn-white`}
                  type="submit"
                  disabled={otp.some((digit) => digit === "")}
                >
                  submit
                </button>
              </>
            ) : (
              <p className="text-sm text-center mt-4">
                Didn't receive an email?
                <button
                  type="button"
                  className="text-[#068662] font-semibold"
                  onClick={() => {
                    handleResendOtp();
                  }}
                >
                  &nbsp; RESEND OTP
                </button>
              </p>
            )}
          </form>

          {/* Success Message */}
          {isVerified && (
            <div className="flex items-center justify-center mt-4 text-green-600 font-medium">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
              Code verified
            </div>
          )}
        </div>
      </div>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
}

export default VerifyOTP;
