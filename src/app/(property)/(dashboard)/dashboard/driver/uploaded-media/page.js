"use client"
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import MediaRequestAcceptedDataTable from "@/components/property/dashboard/driver/MediaRequestAcceptedDataTable";
import MediaRequestRejectedDataTable from "@/components/property/dashboard/driver/MediaRequestRejectedDataTable";
import MediaRequestsDataTable from "@/components/property/dashboard/driver/MediaRequestsDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import { useState } from "react";

const UploadedMediaRequests = () => {
  const [showTable, setShowTable] = useState("Pending")
  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
          {/* End .col-12 */}
        </div>
        {/* End .row */}


        <div className="row align-items-center pb40">
          <div className="col-xxl-3">
            <div className="dashboard_title_area">
              <h2>Your Requests</h2>
            </div>
          </div>
        </div>
        {/* End .row */}
        <div className="flex  justify-self-end gap-2 me-3">
          <button className={`ud-btn btn-${showTable === 'Pending' ? 'thm' : 'white'}`} onClick={() => { setShowTable("Pending") }}>Pending</button>
          <button className={`ud-btn btn-${showTable === 'Accepted' ? 'thm' : 'white'}`} onClick={() => { setShowTable("Accepted") }}>Accepted</button>
          <button className={`ud-btn btn-${showTable === 'Rejected' ? 'thm' : 'white'}`} onClick={() => { setShowTable("Rejected") }}>Rejected</button>
        </div>
        <DashboardTableWrapper >
          <div className="packages_table table-responsive">
            {showTable === "Pending" && (
              <MediaRequestsDataTable setShowTable={setShowTable} />
            )}
            {showTable === "Accepted" && (
              <MediaRequestAcceptedDataTable />
            )}
            {showTable === "Rejected" && (
              <MediaRequestRejectedDataTable />
            )}


          </div>
        </DashboardTableWrapper>
        {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default UploadedMediaRequests;
