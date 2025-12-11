"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AskAgentToListProperty from "@/components/property/dashboard/dashboard-request-agent-to-add-property/RequestAgentToAddProperty";

const RequestToAddProperty = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPage, setSelectedPage] = useState("askAgent");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loginSuccessfull") === "true";
    const accessToken = localStorage.getItem("accessToken");

    if (!isLoggedIn || !accessToken) {
      router.push("/login"); // Redirect if not authenticated
    }
  }, [router]);

  const handleSelection = (page) => {
    setSelectedPage(page);
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">Select an Option</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleSelection("request")}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                List Your Property
              </button>
              <button
                onClick={() => handleSelection("askAgent")}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ask Agent to List Property
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content property-page bgc-f7">
          <div className="row pb40 d-block d-lg-none">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
          </div>

          <div className="row align-items-center pb40">
            <div className="col-lg-12">
              <div className="dashboard_title_area">
                <h2>Ask Agent to List Property</h2>
                <p className="text">Ask our agent to list your property.</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
                <div className="navtab-style1">
                  <AskAgentToListProperty />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default RequestToAddProperty;