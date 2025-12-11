"use client"
import { ApiPutRequest } from "@/axios/apiRequest";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import ChangePasswordForm from "@/components/property/dashboard/dashboard-profile/ChangePasswordForm";
import PersonalInfo from "@/components/property/dashboard/dashboard-profile/PersonalInfo";
import ProfileBox from "@/components/property/dashboard/dashboard-profile/ProfileBox";
import SocialField from "@/components/property/dashboard/dashboard-profile/SocialField";
import { useAuth } from "@/hooks/useAuth";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect, useState } from "react";
// import { getImageUrl } from "@/utils/imageHelpers";

// export const metadata = {
//   title: "Dashboard My Profile || ZeroBroker - Real Estate NextJS Template",
// };

const DashboardMyProfile = () => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    profilePhoto: null,
    personalInfo: {
      fullname: auth.user?.fullname || auth.user?.full_name || '',
      email: auth.user?.email || '',
      mobile: auth.user?.mobile || auth.user?.phone || '',
      whatsappNumber: '',
      address: '',
      aboutMe: '',
      profession: '',
    },
    socialMediaLinks: {},
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [apiError, setApiError] = useState(false);

  const { data, isLoading, isError, error } = useAxiosFetch("/profile/me");

  useEffect(() => {
    if (data?.data) {
      console.log("Profile photo from API:", data?.data?.profilePhoto);

      // Extract just the relative path if needed
      let profilePhotoPath = data?.data?.profilePhoto;

      // Store the relative path in state
      setFormData((prev) => ({
        ...prev,
        socialMediaLinks: { ...data?.data?.socialMediaLinks }, // Ensure a valid object
        profilePhoto: profilePhotoPath, // Store the path, not the full URL
        personalInfo: {
          ...data?.data?.user,
          whatsappNumber: data?.data?.whatsappNumber,
          address: data?.data?.address,
          aboutMe: data?.data?.aboutMe,
          profession: data?.data?.profession,
        },
      }));

      setApiError(false);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {

      const is401 = error?.response?.status === 401;

      if (is401) {
        setApiError(true);

        setMessage("Could not load profile data from the server. Using basic information from your login session.");
        setStatus(false);
        setState({ ...state, open: true });

        setTimeout(() => {
          setState({ ...state, open: false });
        }, 5000);
      }
    }
  }, [isError, error, state]);

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);


  const handleFormChange = (section, data) => {
    if (section === "profilePhoto") {
      console.log("Profile photo changed:", data);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: data
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Append the profile photo if it exists and is a File
      if (formData.profilePhoto instanceof File) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      } else if (formData.profilePhoto && typeof formData.profilePhoto === 'string') {
        // If it's a string (existing URL), only send it if it's a relative path
        // This prevents sending the full URL back to server
        formDataToSend.append('profilePhotoPath', formData.profilePhoto);
      }

      // Append all other fields
      formDataToSend.append('whatsappNumber', formData.personalInfo.whatsappNumber || '');
      formDataToSend.append('address', formData.personalInfo.address || '');
      formDataToSend.append('aboutMe', formData.personalInfo.aboutMe || '');
      formDataToSend.append('profession', formData.personalInfo.profession || '');
      formDataToSend.append('facebook', formData.socialMediaLinks.facebook || '');
      formDataToSend.append('instagram', formData.socialMediaLinks.instagram || '');
      formDataToSend.append('linkedin', formData.socialMediaLinks.linkedin || '');
      formDataToSend.append('twitter', formData.socialMediaLinks.twitter || '');
      formDataToSend.append('youtube', formData.socialMediaLinks.youtube || '');


      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Make the API request with FormData
      const response = await ApiPutRequest("/profile/update", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        console.log("Profile updated successfully:", response.data);
        setMessage("Profile updated successfully!");
        setStatus(true);
        setState({ ...state, open: true });
        setTimeout(() => {
          setState({ ...state, open: false });
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 401) {
        setMessage("Your session may have expired, but you can still edit your profile. Please save and refresh the page if changes don't persist.");
      } else {
        setMessage("Error updating profile. Please try again.");
      }

      setStatus(false);
      setState({ ...state, open: true });
      setTimeout(() => {
        setState({ ...state, open: false });
      }, 5000);
    }
  };

  const ApiErrorBanner = () => (
    <div className="alert alert-warning mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="mb-1">Connection issue</h5>
          <p className="mb-0">We're having trouble connecting to the server. Your basic profile information is shown, but some details may be missing.</p>
        </div>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  // This section is no longer used since we simplified the layout

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>
        
        <div className="row align-items-center pb20">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>My Profile</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
        </div>

          {/* Error Banner */}
          {apiError && (
            <div className="row">
              <div className="col-12">
                <ApiErrorBanner />
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <div className="w-100">
                  <ProfileBox
                    data={formData.profilePhoto}
                    onChange={(data) => handleFormChange("profilePhoto", data)}
                  />
                </div>

                <div className="w-100">
                  <h4 className="title fz17 mb30 d-none d-lg-block">Personal Information</h4>
                  <PersonalInfo
                    data={formData.personalInfo}
                    onChange={(data) => handleFormChange("personalInfo", data)}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Social Media Links</h4>
                <SocialField
                  data={formData.socialMediaLinks}
                  onChange={(data) => handleFormChange("socialMediaLinks", data)}
                  handleSubmit={handleSubmit}
                />
              </div>

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Change Password</h4>
                <ChangePasswordForm />
              </div>
            </div>
          </div>
      </DashboardContentWrapper>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default DashboardMyProfile;