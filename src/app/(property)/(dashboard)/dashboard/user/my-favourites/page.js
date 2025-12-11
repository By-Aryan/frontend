import Pagination from "@/components/property/Pagination";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import ListingsFavourites from "@/components/property/dashboard/dashboard-my-favourites/ListingsFavourites";
import "@/styles/favourites-layout.css";

export const metadata = {
  title: "Dashboard My Favourites || ZeroBroker - Real Estate NextJS Template",
};

const DashboardMyFavourites = () => {
  return (
    <>
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
                {/* End .col-12 */}
              </div>
              {/* End .row */}

              <div className="row align-items-center pb20">
                <div className="col-lg-12">
                  <div className="dashboard_title_area text-center">
                    <h2 className="mb-2">My Favourites</h2>
                    <p className="text text-muted">Properties you've saved for future reference</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row justify-content-center">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb20 overflow-hidden position-relative">
                    <ListingsFavourites />
                  </div>
                </div>
                {/* Pagination will be added later when needed
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="mt30">
                      <Pagination />
                    </div>
                  </div>
                </div>
                */}
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

export default DashboardMyFavourites;
