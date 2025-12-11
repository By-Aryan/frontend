"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { usePost } from "@/hooks/usePost";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AgentListingForm = () => {
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [status, setStatus] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const mutation = usePost(`/agent-free-listing/add`); // should send JSON in body
  const { setUser } = useUserStore();

  const [data, setData] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  const validateInput = (name, value) => {
    let error = "";

    if (name === "fullname") {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(value)) {
        error = "Full name should contain only alphabets.";
      }
    }

    if (name === "email") {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|io|co|in|uk|us|ae)(\.[a-zA-Z]{2,})?$/i;
      if (!emailRegex.test(value)) {
        error = "Enter a valid email address.";
      }
    }

    if (name === "mobile") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        error = "Enter a valid 10-digit phone number.";
      }
    }

    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Object.keys(data).forEach((key) => {
      validateInput(key, data[key]);
    });

    const hasErrors = Object.values(validationErrors).some((err) => err !== "");
    if (hasErrors) {
      setMessage("Please fix the errors before submitting.");
      setStatus(false);
      setState({ ...state, open: true });
      return;
    }

    const role = localStorage.getItem("role") || "";
    const interest = localStorage.getItem("interestedIn") || "";

    const payload = {
      full_name: data.fullname,
      email: data.email,
      mobile: data.mobile,
      role,
      interest,
    };

    mutation.mutate(payload, {
      onSuccess: (details) => {
        setStatus(true);
        setMessage(
          details?.message ||
            "Details Submitted Successfully! Our Agent will contact you soon."
        );
        // setState({ ...state, open: true });
        // if (details.success) {
        //   router.push("/for-sale/properties/uae?purpose=buy");
        // }
        // setTimeout(() => {
        //   setState((prev) => ({ ...prev, open: false }));
        // }, 4000);
      },
      onError: (error) => {
        console.error("Error Submitting Details", error);
        const errorMsg =
          error.response?.data?.message ||
          "Submission failed. Please try again.";
        setMessage(errorMsg);
        setStatus(false);
        setState({ ...state, open: true });

        setTimeout(() => {
          setState((prev) => ({ ...prev, open: false }));
        }, 4000);
      },
    });
  };

  return (
    <>
      <form className="form-style1" onSubmit={handleSubmit}>
        <div className="sm:mb25 mb15">
          <label className="form-label fw600 dark-color">Full Name</label>
          <input
            type="text"
            name="fullname"
            className="form-control"
            placeholder="Enter Full Name"
            onChange={inputHandler}
            required
          />
          {validationErrors.fullname && (
            <p style={{ color: "red" }}>{validationErrors.fullname}</p>
          )}
        </div>

        <div className="sm:mb25 mb15">
          <label className="form-label fw600 dark-color">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Email"
            onChange={inputHandler}
            required
          />
          {validationErrors.email && (
            <p style={{ color: "red" }}>{validationErrors.email}</p>
          )}
        </div>

        <div className="sm:mb25 mb15">
          <label className="form-label fw600 dark-color">Phone Number</label>
          <input
            type="tel"
            name="mobile"
            className="form-control"
            placeholder="Enter Phone Number"
            onChange={inputHandler}
            maxLength={10}
            pattern="[0-9]*"
            required
          />
          {validationErrors.mobile && (
            <p style={{ color: "red" }}>{validationErrors.mobile}</p>
          )}
        </div>

        <div className="d-grid mb20">
          <button
            className="ud-btn btn-thm"
            type="submit"
            disabled={
              Object.values(validationErrors).some((error) => error !== "") ||
              mutation.isPending
            }
          >
            {mutation.isPending ? (
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
                Agent Create Property <i className="fal fa-arrow-right-long" />
              </>
            )}
          </button>
        </div>
      </form>

      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default AgentListingForm;
