"use client"
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SellerAccountCreatedDataTable from "@/components/property/dashboard/agent/SellerAccountCreatedDataTable";
import SellerRequestsDataTable from "@/components/property/dashboard/agent/SellerRequestDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useState } from "react";

const CreateSellerAccount = () => {
  const [showTable, setShowTable] = useState("Pending");

  const { data, error, isLoading, isError } = useAxiosFetch(`/seller/all`);

  // Filter data based on account_created status
  const pendingSellers = data?.data?.filter(seller => seller.account_created === false) || [];
  const createdSellers = data?.data?.filter(seller => seller.account_created === true) || [];

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

          <div className="row align-items-cente">
            <div className="col-12">
              <div className="dashboard_title_area">
                <h2>Seller's Requests For Account Creation</h2>
                <p className="text">We are glad to see you again!</p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="flex justify-self-end gap-2 me-3">
            <button
              className={`ud-btn btn-${showTable === 'Pending' ? 'thm' : 'white'}`}
              onClick={() => setShowTable("Pending")}
            >
              Pending
            </button>
            <button
              className={`ud-btn btn-${showTable === 'Created' ? 'thm' : 'white'}`}
              onClick={() => setShowTable("Created")}
            >
              Created
            </button>
          </div>

          <DashboardTableWrapper>
            {isLoading ? (
              <LoadingSpinner message="Loading seller data..." size="md" color="primary" />
            ) : isError ? (
              <div className="alert alert-danger m-4 text-center">
                <i className="fa fa-exclamation-circle me-2"></i>
                Error loading seller data: {error?.message || "Unknown error"}
              </div>
            ) : (
              <div className="packages_table table-responsive">
                {showTable === "Pending" && (
                  <SellerRequestsDataTable
                    data={pendingSellers}
                    setShowTable={setShowTable}
                  />
                )}

                {showTable === "Created" && (
                  <SellerAccountCreatedDataTable
                    data={createdSellers}
                  />
                )}
              </div>
            )}
          </DashboardTableWrapper>
          {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default CreateSellerAccount;