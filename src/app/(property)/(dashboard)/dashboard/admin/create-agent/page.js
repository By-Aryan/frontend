"use client";
import AgentPersonalInfo from "@/components/property/dashboard/agent-profile/AgentPersonalInfo";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { useState } from "react";
const api_url = process.env.NEXT_PUBLI_API_BASE_UR;


const AgentProfile = () => {
  const [create, setCreate] = useState("Agent")
  const [role, setRole] = useState("agent")

  return (
    <>
      <DashboardContentWrapper>
          <div className="row">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <div className="dashboard_title_area">
                <h2>Create {create}</h2>
                <p className="text">We are glad to see you again!</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="d-flex justify-content-end align-items-center gap-2">
                <h5 className="mb-0 me-2">Create :</h5>
                <button className={`ud-btn btn-${create === 'Agent' ? 'thm' : 'white'}`} onClick={() => { setCreate("Agent"); setRole("agent") }}>Agent</button>
                <button className={`ud-btn btn-${create === 'Driver' ? 'thm' : 'white'}`} onClick={() => { setCreate("Driver"); setRole("driver") }}>Driver</button>
                <button className={`ud-btn btn-${create === 'Sub Admin' ? 'thm' : 'white'}`} onClick={() => { setCreate("Sub Admin"); setRole("sub-admin") }}>Sub Admin</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

                <div className="col-lg-12">
                  <AgentPersonalInfo create={create} role={role} />
                </div>
              </div>
            </div>
          </div>
      </DashboardContentWrapper>
    </>
  );
};

export default AgentProfile;
