"use client";
import AdminProjectsManager from "@/components/property/dashboard/admin-projects/AdminProjectsManager";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";

const AdminProjectsPage = () => {
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
        
        <AdminProjectsManager />
      </DashboardContentWrapper>
    </>
  );
};

export default AdminProjectsPage;