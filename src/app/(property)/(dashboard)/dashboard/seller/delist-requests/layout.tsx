import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import MobileMenu from "@/components/common/mobile-menu";

export const metadata = {
  title: "My Delist Requests || ZeroBroker - Real Estate NextJS Template",
};

export default function SellerDelistRequestsLayout({ children }) {
  return (
    <>
      {/* Mobile Menu start */}
      <MobileMenu />
      {/* Mobile Menu end */}
      
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {children}
        </div>
      </div>
    </>
  );
}
