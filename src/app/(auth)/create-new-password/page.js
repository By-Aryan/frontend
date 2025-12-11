"use client";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import { Box, Snackbar } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function CreateNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [confirmValidationError, setConfirmValidationError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [email, setEmail] = useState("")
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const router = useRouter();
  const mutation = usePost("/auth/reset-password");
  const { user } = useUserStore();
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailFromParam = searchParams.get("email");
    if (emailFromParam) {
      setEmail(emailFromParam);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;


    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%#*?&]{8,}$/;

    if (name == "password") {
      if (!passwordRegex.test(value)) {
        setValidationError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&)."
        );
      } else {
        setValidationError("");
        setNewPassword(value);
      }
    }
    if (name == "confirmPassword") {
      if (!passwordRegex.test(value)) {
        setConfirmValidationError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&)."
        );
      } else {
        setConfirmValidationError("");
        setConfirmPassword(value)
      }
    }


  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);

    mutation.mutate(
      { email: email, confirmPassword },
      {
        onSuccess: (details) => {
          setState({ ...state, open: true });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: (error) => {
          console.log(`error in email varification : ${error}`);
        },
      }
    );
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <section className="our-compare pt0 pb0">
        <Image
          width={1012}
          height={519}
          src="/images/icon/login-page-icon.svg"
          alt="logo"
          className="login-bg-icon contain"
          data-aos="fade-right"
          data-aos-delay="300"
        />
        <div className="container">
          <div className="row" data-aos="fade-left" data-aos-delay="300">
            <div className="col-lg-6">
              <div className="log-reg-form signup-modal form-style1 bgc-white p30 p30-sm default-box-shadow2 bdrs12">
                <div className="text-center space-y-5">
                  <Link href="/">
                    <Image
                      width={138}
                      height={44}
                      className="mb15"
                      src="/images/logoBlack.png"
                      alt="logo"
                    />
                  </Link>
                  <Image
                    src="/images/emailverificationicon.png"
                    alt=""
                    className="h-[80px] w-[80px] place-self-center"
                    width={80}
                    height={80}
                  />
                  <h2>Create New Password</h2>
                </div>
                <div className="flex justify-center items-center h-[50vh]">
                  <div className=" p-4 w-[600px] ">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="">
                        <label className="form-label fw600 dark-color">
                          New Password
                        </label>
                        <div
                          className="form-control"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type={`${show ? "text" : "password"}`}
                            name="password"
                            placeholder="Enter Password"
                            className="w-100"
                            onChange={handleInputChange}
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
                        {validationError && (
                          <p style={{ color: "red" }}>{validationError}</p>
                        )}
                      </div>
                      <div className="mb-5">
                        <label className="form-label fw600 dark-color">
                          Confirm Password
                        </label>
                        <div
                          className="form-control"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type={`${showConfirm ? "text" : "password"}`}
                            name="confirmPassword"
                            placeholder="Enter Confirm Password"
                            className="w-100"
                            onChange={handleInputChange}
                            required
                            style={{ border: "none", outline: "none" }}
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
                        {confirmValidationError && (
                          <p style={{ color: "red" }}>
                            {confirmValidationError}
                          </p>
                        )}
                      </div>
                      {passwordMatch !== null && ((passwordMatch !== true) ? (
                        <p style={{ color: "red" }}>Passwords does not match</p>
                      ) : (
                        <p style={{ color: "green" }}>
                          Passwords Matched{" "}
                          <i class="fa fa-check-circle" aria-hidden="true"></i>
                        </p>
                      ))}

                      <button
                        className="ud-btn btn-thm w-full"
                        type="submit"
                        disabled={newPassword.length <= 7 && confirmPassword.length <= 7}
                      >
                        Create Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              Password created Successfully{" "}
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
