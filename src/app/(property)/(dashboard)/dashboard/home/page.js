"use client"
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import TopStateBlock from "@/components/property/dashboard/dashboard-home/TopStateBlock";
import { useAuth } from "@/hooks/useAuth";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// export const metadata = {
//   title: "Dashboard Home || ZeroBroker - Real Estate NextJS Template",
// };

const TopStateBlockSkeleton = () => {
  return (
    <div className="row">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="col-sm-6 col-xxl-3">
          <div className="d-flex justify-content-between statistics_funfact">
            <div className="details">
              <div className="text fz25">
                <div className="skeleton-loader" style={{ width: "120px", height: "20px" }}></div>
              </div>
              <div className="title">
                <div className="skeleton-loader" style={{ width: "60px", height: "30px" }}></div>
              </div>
            </div>
            <div className="icon text-center">
              <div className="skeleton-loader" style={{ width: "40px", height: "40px", borderRadius: "50%" }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardHome = () => {
  const { data, isLoading, isError, error } = useAxiosFetch("/profile/me");
  const { auth } = useAuth();

  const [role, setRole] = useState("")
  const pathname = usePathname();

  useEffect(() => {
    const userRole = auth.roles[0] || "";
    setRole(userRole);
  }, [auth.roles])

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
          {/* End .col-12 */}

          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Hii, {data?.data?.user?.fullname || "User"}!</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
          {/* col-lg-12 */}
        </div>
        {/* End .row */}

        <Suspense fallback={<TopStateBlockSkeleton />}>
          <div className="row">
            <TopStateBlock role={role} />
          </div>
        </Suspense>
        {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default DashboardHome;
