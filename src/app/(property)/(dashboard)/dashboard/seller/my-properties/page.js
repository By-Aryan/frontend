import PropertyDataTable from "@/components/property/dashboard/dashboard-my-properties/PropertyDataTable";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";

export const metadata = {
  title: "Dashboard Properties || ZeroBroker",
};

const DashboardMyProperties = () => {
  return (
    <>
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content bgc-f7">
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
                <h2>My Properties</h2>
                <p className="text">We are glad to see you again!</p>
              </div>
            </div>
            <div className="col-xxl-9"></div>
          </div>
          {/* End .row */}
          {/* <FilterHeader show={false}/> */}
          <div className="item1 mb15 col-3 justify-self-end ml-2">
            <div className="search_area">
              <input
                type="text"
                className="form-control bdrs12"
                placeholder="Property Name ..."
                required
              />
              <label>
                <span className="flaticon-search" />
              </label>
            </div>
          </div>
          <DashboardTableWrapper >
            <div className="packages_table table-responsive">
              <PropertyDataTable />

              {/* <div className="mt30"> */}
              {/* <Pagination /> */}
              {/* </div> */}
            </div>
          </DashboardTableWrapper>
          {/* End .row */}
        </div>
        {/* End .dashboard__content */}

      </div>
    </>
  );
};

export default DashboardMyProperties;
