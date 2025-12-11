"use client";
import CreateSeller from "@/components/property/dashboard/agent/CreateSeller";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
const api_url = process.env.NEXT_PUBLI_API_BASE_UR;


const CreateSellerAccount = ({ params }) => {

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
                <h2>Create Seller Account</h2>
              </div>
            </div>
          </div>
          <div className="flex justify-self-end gap-2 me-3 mb-5">
          </div>
          <div className="row">
            <div className="col-xl-12 min-h-[50vh]">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">

                <div className="col-lg-12">
                  <CreateSeller params={params} />
                </div>
              </div>
            </div>
          </div>
      </DashboardContentWrapper>
    </>
  );
};

export default CreateSellerAccount;
