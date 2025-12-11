import Pagination from "@/components/property/Pagination";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import PropertyListedByMeDataTable from "@/components/property/dashboard/dashboard-property-listed-by-me/PropertyListedByMeDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";

export const metadata = {
  title: "Dashboard Property Listed by Me || ZeroBroker - Real Estate NextJS Template",
};

const PropertyListedByMe = () => {
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
          <div className="">
            <div className="dashboard_title_area">
              <h2>Property Listed By You</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
        </div>
        {/* End .row */}

        <DashboardTableWrapper >
          <div className="packages_table table-responsive">
            <PropertyListedByMeDataTable />

            <div className="mt30">
              <Pagination />
            </div>
          </div>
        </DashboardTableWrapper>
        {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default PropertyListedByMe;
