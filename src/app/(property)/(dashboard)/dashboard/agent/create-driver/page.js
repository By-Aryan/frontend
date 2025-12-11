"use client";
import CreateDriver from "@/components/property/dashboard/agent/CreateDriver";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { useState } from "react";
const api_url = process.env.NEXT_PUBLI_API_BASE_UR;


const AgentProfile = () => {
  const [create, setCreate] = useState("Driver")

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>
        <div className="row align-items-center ">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Create driver</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
        </div>
        <div className="flex justify-self-end gap-2 me-3 mb-5">
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

              <div className="col-lg-12">
                <CreateDriver create={create} />
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    </>
  );
};

export default AgentProfile;
