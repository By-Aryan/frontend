"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import AddtionalDetailsFields from "./additional-details-fields";
import useAxiosPost from "@/hooks/useAxiosPost";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import { useRouter } from "next/navigation";

const AddPropertyTabContent = ({ params }) => {
  const [driver, setDriver] = useState();
  const [snackMessage, setSnackMessage] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0); // 🚀 New
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFinalStep, setIsFinalStep] = useState(false);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.open) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.open]);

  const mutation = useAxiosPost("/property/create", {
    onSuccess: (details) => {
      setState((prev) => ({ ...prev, open: true }));
      setStatus(true);
      if (details?.data?.success) {
        setSnackMessage("Property Updated Successfully");
      }

      if (isFinalStep) {
        // Redirect to pending-approval instead - property needs admin approval
        router.push("/dashboard/agent/pending-approval");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update property");
      setSnackMessage("Failed to Update Property");
      setStatus(false);
      setState((prev) => ({ ...prev, open: true }));
    },
  });

const handleStepSubmit = async (stepData, updateType) => {
    const payload = {
      requested_id: params.id,
      update_type: updateType,
      ...stepData,
    };

    try {
      await mutation.mutateAsync(payload);
      setCompletedSteps((prev) => new Set([...prev, updateType]));
      setActiveStepIndex((prev) => Math.min(prev + 1, tabConfig.length - 1)); // 🚀 Auto-next
    } catch (error) {
      console.error(`Error updating ${updateType}:`, error);
    }
  };

  // Function to handle next step navigation without API call
  const handleNextStep = () => {
    setActiveStepIndex((prev) => Math.min(prev + 1, tabConfig.length - 1));
    // Mark driver assignment as completed (optional - for UI feedback)
    setCompletedSteps((prev) => new Set([...prev, "driver_assignment"]));
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value;
    setTags(newTags);
  };

  const handleFinalSubmit = async () => {
    if (tags) {
      const tagsArray = tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      await handleStepSubmit({ tags: tagsArray }, "tags");
    }

    const payload = {
      requested_id: params.id,
    };

    mutation.mutate(payload);
  };

   const tabConfig = [
    {
      id: "item1",
      title: "1. Description",
      component: (
        <PropertyDescription
          onSubmit={(data) => handleStepSubmit(data, "description")}
          isCompleted={completedSteps.has("description")}
          isLoading={mutation.isLoading}
        />
      ),
    },
    {
      id: "item2",
      title: "2. Media",
      component: (
        <UploadMedia
          onSubmit={(data) => handleStepSubmit(data, "media")} // Only for media upload
          onNextStep={handleNextStep} // For driver assignment - just move to next step
          isCompleted={completedSteps.has("media") || completedSteps.has("driver_assignment")}
          isLoading={mutation.isLoading}
          setDriver={setDriver}
          driver={driver}
          requested_id={params.id}
        />
      ),
    },
    // ... rest of your tabConfig remains the same
    {
      id: "item3",
      title: "3. Location",
      component: (
        <LocationField
          onSubmit={(data) => handleStepSubmit(data, "location")}
          isCompleted={completedSteps.has("location")}
          isLoading={mutation.isLoading}
        />
      ),
    },
    {
      id: "item4",
      title: "4. Detail",
      component: (
        <DetailsFiled
          onSubmit={(data) => handleStepSubmit(data, "detail")}
          isCompleted={completedSteps.has("detail")}
          isLoading={mutation.isLoading}
        />
      ),
    },
    {
      id: "item5",
      title: "5. Additional Details",
      component: (
        <AddtionalDetailsFields
          onSubmit={(data) => handleStepSubmit(data, "additional_details")}
          isCompleted={completedSteps.has("additional_details")}
          isLoading={mutation.isLoading}
        />
      ),
    },
    {
      id: "item6",
      title: "6. Amenities",
      component: (
        <div className="row">
          <Amenities
            onSubmit={(data) => handleStepSubmit(data, "amities_update")}
            isCompleted={completedSteps.has("amities_update")}
            isLoading={mutation.isLoading}
          />
        </div>
      ),
    },
    {
      id: "item7",
      title: "7. Submit",
      component: (
        <Formik
          initialValues={{ tags: tags }}
          validationSchema={Yup.object({
            tags: Yup.string(),
          })}
          onSubmit={async (data) => {
            const tagArray = data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
            setIsFinalStep(true); // Set flag to true BEFORE triggering mutation
            await handleStepSubmit({ tags: tagArray }, "tags");
          }}
          enableReinitialize
        >
          {({ handleBlur, handleChange, values, isSubmitting }) => (
            <Form>
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10 mt50">
                    Tags (Type Tags separated by comma "," so when people search
                    related this property gets suggested)
                  </label>
                  <textarea
                    cols={30}
                    rows={4}
                    name="tags"
                    placeholder="eg UAE, Dubai, Apartment, Villa ..."
                    value={values.tags} // ✅ Formik managed state
                    onChange={handleChange} // ✅ Formik handler
                    onBlur={handleBlur}
                    className="form-control"
                  />
                </div>
              </div>
              <h4 className="title fz17 mb30">Save Property Details</h4>
              <p className="text-muted mb20">
                After saving, you can submit this property for admin approval from the Pending Approval page.
              </p>
              <div className="row">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-52 ud-btn btn-thm"
                    disabled={isSubmitting || mutation.isPending}
                  >
                    {isSubmitting || mutation.isSuccess
                      ? "Saved Successfully"
                      : "Save & Continue"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
  ];

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          {tabConfig.map((tab, index) => (
            <button
              key={tab.id}
              className={`nav-link fw600 ${
                activeStepIndex === index ? "active ms-3" : ""
              } ${
                completedSteps.has(tab.id.replace("item", ""))
                  ? "completed"
                  : ""
              }`}
              id={`nav-${tab.id}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#nav-${tab.id}`}
              type="button"
              role="tab"
              aria-controls={`nav-${tab.id}`}
              aria-selected={activeStepIndex === index ? "true" : "false"}
            >
              {tab.title}
              {completedSteps.has(tab.id.replace("item", "")) && (
                <i className="fa fa-check-circle ml-2 text-green-500"></i>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        {tabConfig.map((tab, index) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${
              activeStepIndex === index ? "show active" : ""
            }`}
            id={`nav-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`nav-${tab.id}-tab`}
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">
                {tab.title.replace(/^\d+\.\s/, "")}
              </h4>
              {tab.component}
            </div>
          </div>
        ))}
      </div>

      <StatusSnackbar message={snackMessage} state={state} status={status} />
    </>
  );
};

export default AddPropertyTabContent;
