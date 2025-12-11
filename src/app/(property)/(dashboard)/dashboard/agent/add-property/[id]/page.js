"use client"
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AddPropertyTabContent from "@/components/property/dashboard/dashboard-add-property";


const DashboardAddProperty = ({ params }) => {

  return (
    <>
      <DashboardContentWrapper>
          <div className="row pb40 d-block d-lg-none">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
            {/* End .col-12 */}
          </div>
          {/* End .row */}

          <div className="row align-items-center pb40">
            <div className="col-lg-12">
              <div className="dashboard_title_area">
                <h2>Add New Property</h2>
                <p className="text">We are glad to see you again!</p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
                <div className="navtab-style1">
                  <AddPropertyTabContent params={params} />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default DashboardAddProperty;
