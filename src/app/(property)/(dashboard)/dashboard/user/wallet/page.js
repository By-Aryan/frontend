"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import Wallet from "@/components/property/dashboard/buyer/wallet/Wallet";

import { useSubscriptionData } from "@/hooks/useSubscriptionData";

const DashboardWallet = () => {
  const { data: planData, isLoading, isError } = useSubscriptionData();
  
  if (planData) {
    console.log("Received planData: ", planData);
    localStorage.setItem("isPlanActive", String(planData.data?.isActive || false));
    localStorage.setItem("remainingContacts", String(planData.data?.totalContacts || 0));
  }
  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="mb30 overflow-hidden position-relative">
                    {isLoading ? (
                      <p>Loading plan info...</p>
                    ) : isError ? (
                      <p>Failed to load plan info.</p>
                    ) : (
                      <Wallet planData={planData} />
                    )}
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </>
  );
};

export default DashboardWallet;
