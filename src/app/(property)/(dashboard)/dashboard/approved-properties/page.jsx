"use client";
import { useQuery } from "@tanstack/react-query";
import { ApiFetchRequest } from "@/axios/apiRequest";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/property/Pagination";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import RequestedAcceptedDataTable from "@/components/property/dashboard/dashboard-requests-accepted-by-agents/RequestedAcceptedDataTable";
import RequestsPendingDataTable from "@/components/property/dashboard/seller-pending-requests/RequestsPendingDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import DashboardPropertyListByRoleDataTable from "@/components/property/dashboard/dashboardPropertyListsByRole/dashboardPropertyListsByRole";
import { useState } from "react";

const DashboardApprovedPropertyByRole = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchRequestsByStatus = async () => {
    const response = await ApiFetchRequest(
      `/my-filter-properties?page=${currentPage}&limit=${limit}&approval_status=Approved`
    );

    return {
      data: Array.isArray(response?.data?.data) ? response.data.data : [],
      totalRecords:
        typeof response.data.total_records === "number"
          ? response.data.total_records
          : 0,
      limit: typeof response.data.limit === "number" ? response.data.limit : 10,
    };
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["approved-properties", currentPage, limit],
    queryFn: fetchRequestsByStatus,
    keepPreviousData: true,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <DboardMobileNavigation />
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-xxl-3">
          <div className="dashboard_title_area">
            <h2>Approved Properties</h2>
            <p className="text">We are glad to see you again!</p>
          </div>
        </div>
      </div>

      <DashboardTableWrapper>
        <div className="packages_table table-responsive">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <LoadingSpinner
                message="Loading requests..."
                size="md"
                color="success"
              />
            </div>
          ) : isError ? (
            <div className="text-center py-5 text-danger">
              Failed to load requests.
            </div>
          ) : (
            <>
              {data?.data?.length > 0 ? (
                <>
                  <DashboardPropertyListByRoleDataTable data={data.data} />
                </>
              ) : (
                <div className="text-center py-5">No requests found.</div>
              )}
            </>
          )}
        </div>

        {/* Pagination will show for both Pending and Approved when totalRecords > 0 */}
        {data?.totalRecords > 0 && !isLoading && !isFetching && (
          <div className="mt30">
            <Pagination
              currentPage={currentPage}
              totalRecords={data.totalRecords}
              limit={limit}
              onPageChange={handlePageChange}
              itemName="requests"
            />
          </div>
        )}
      </DashboardTableWrapper>
    </DashboardContentWrapper>
  );
};

export default DashboardApprovedPropertyByRole;
