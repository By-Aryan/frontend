"use client";
import { usePost } from "@/hooks/usePost";
import { Box, Snackbar } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState("");

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });


  const router = useRouter();
  const mutation = usePost("/auth/generate-otp");


  const handleInputChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(emailRegex.test(newEmail)); // Update validation state
  };

  const handleVerify = (e) => {
    e.preventDefault();
    sessionStorage.setItem("e", email)
    mutation.mutate(
      { email, otp_type: "forgot" },
      {
        onSuccess: (details) => {
          sessionStorage.setItem("ot", "forgot");
          setState({ ...state, open: true });
          setTimeout(() => {
            router.push("/verification/verify-otp")
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
              <div className="log-reg-form signup-modal form-style1 bgc-white sm:p30 p10 default-box-shadow2 bdrs12">
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
                  <h2>Please verify your Email</h2>
                  <p></p>
                </div>
                <div className="flex justify-center items-center h-[50vh]">
                  <div className="sm:p-4 w-[600px] ">

                    <form onSubmit={handleVerify} className="space-y-10">
                      <div className="mb-5">
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            className="form-control "
                            placeholder="Please Enter Your Email Address"
                            value={email}
                            onChange={handleInputChange}
                            required
                          />
                          <i>
                            <i
                              className={` ${isValid && "fa fa-check"}`}
                              aria-hidden="true"
                            ></i>
                          </i>
                        </div>
                        <p className="text-sm ms-1 text-gray">
                          OTP will be send to this email
                        </p>
                      </div>
                      <button
                        className="ud-btn btn-thm w-full"
                        type="submit"
                        disabled={!isValid}
                      >
                        Send OTP
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
              OTP Send Successfully{" "}
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
