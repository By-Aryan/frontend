"use client"
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AssignedDriversDataTable from "@/components/property/dashboard/agent/AssignedDriversDataTable";
import { useState } from "react";

const AssignedDrivers = () => {
  const [showTable, setShowTable] = useState("Pending");

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
              <h2>Assigned Drivers</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 mb30 overflow-hidden position-relative">
              <div className="packages_table table-responsive">
                <AssignedDriversDataTable setShowTable={setShowTable} />
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    </>
  );
};

export default AssignedDrivers;
