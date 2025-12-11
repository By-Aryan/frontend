"use client";
import RequestAgent from "@/components/property/dashboard/dashboard/request-to-agent/RequestToAgent";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// export const metadata = {
//   title: "Dashboard Request to Add Property || ZeroBroker - Real Estate NextJS Template",
// };

const RequestToAgent = ({ params }) => {
  const router = useRouter();

  useEffect(() => {
    console.log(params.id)
  }, [])
  return (
    <>
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content property-page bgc-f7">
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
                <h2>Want to Edit or Delete Property</h2>
                <p className="text">Please fill this form so our agent will contact you.</p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
                <div className="navtab-style1">
                  <RequestAgent />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard__content */}

      </div>
    </>
  );
};

export default RequestToAgent;
