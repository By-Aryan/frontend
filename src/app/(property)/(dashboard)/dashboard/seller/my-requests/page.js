// "use client"
// import { ApiFetchRequest } from "@/axios/apiRequest";
// import LoadingSpinner from "@/components/common/LoadingSpinner";
// import Pagination from "@/components/property/Pagination";
// import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
// import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
// import RequestedAcceptedDataTable from "@/components/property/dashboard/dashboard-requests-accepted-by-agents/RequestedAcceptedDataTable";
// import RequestsPendingDataTable from "@/components/property/dashboard/seller-pending-requests/RequestsPendingDataTable";
// import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
// import { useEffect, useState } from "react";
// import FilterHeader from "../../../../../../components/property/dashboard/dashboard-my-properties/FilterHeader";

// const DashboardRequestsAcceptedByAgent = () => {
//   const [selectedValue, setSelectedValue] = useState("Pending");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch data with the status parameter
//   const fetchData = async (status = "Pending", page = 0) => {
//     setIsLoading(true);
//     try {
//       // Always include status parameter with the API call
//       const response = await ApiFetchRequest(`/property/my-requests-by-status?page=${page}&limit=${limit}&status=${status}`);

//       console.log("API Request:", `/property/getProperties?page=${page}&limit=${limit}&status=${status}`);
//       console.log("API Response:", response?.data);

//       if (response?.data) {
//         // Set the data from the API response
//         setFilteredData(Array.isArray(response.data.data) ? response.data.data : []);

//         // Set total records from API response
//         if (typeof response.data.total_records === 'number') {
//           setTotalRecords(response.data.total_records);
//         } else {
//           // Fallback to array length if total_records is not provided
//           setTotalRecords(Array.isArray(response.data.data) ? response.data.data.length : 0);
//         }

//         // Set limit from API response or keep current limit
//         if (typeof response.data.limit === 'number') {
//           setLimit(response.data.limit);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//       setFilteredData([]);
//       setTotalRecords(0);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initial data load and when status or page changes
//   useEffect(() => {
//     // Get the appropriate status based on the selected value
//     const status = selectedValue === "Pending" ? "Pending" : "Approved";
//     fetchData(status, currentPage);
//   }, [selectedValue, currentPage, limit]);

//   const handleChange = (selectedOption) => {
//     // The selectedOption contains the full object with value and label
//     setSelectedValue(selectedOption.value);
//     setCurrentPage(0); // Reset to first page when changing filter
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <>
//       <DashboardContentWrapper>
//         <div className="row">
//           <div className="col-lg-12">
//             <DboardMobileNavigation />
//           </div>
//           {/* End .col-12 */}
//         </div>
//         {/* End .row */}

//         <div className="row align-items-center">
//           <div className="col-xxl-3">
//             <div className="dashboard_title_area">
//               <h2>My Requests</h2>
//               <p className="text">We are glad to see you again!</p>
//             </div>
//           </div>
//           <div className="col-xxl-9">
//             <FilterHeader
//               show={true}
//               handleChange={handleChange}
//               selectedValue={selectedValue}
//             />
//           </div>
//         </div>
//         {/* End .row */}

//         <DashboardTableWrapper >
//           <div className="packages_table table-responsive">
//             {isLoading ? (
//               <div className="d-flex justify-content-center py-5">
//                 <LoadingSpinner message="Loading requests..." size="md" color="success" />
//               </div>
//             ) : (
//               <>
//                 {selectedValue === "Approved" && <RequestedAcceptedDataTable data={filteredData} />}
//                 {selectedValue === "Pending" && <RequestsPendingDataTable data={filteredData} />}
//                 <div className="mt30">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalRecords={totalRecords}
//                     limit={limit}
//                     onPageChange={handlePageChange}
//                     itemName="properties"
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </DashboardTableWrapper>
//         {/* End .row */}
//       </DashboardContentWrapper>
//     </>
//   );
// };

// export default DashboardRequestsAcceptedByAgent;

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
import FilterHeader from "../../../../../../components/property/dashboard/dashboard-my-properties/FilterHeader";

import { useState } from "react";

const DashboardRequestsAcceptedByAgent = () => {
  const [selectedValue, setSelectedValue] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);

  // Map selectedValue to API status
  const status = selectedValue === "Pending" ? "Pending" : "Accepted";

  const fetchRequestsByStatus = async () => {
    const response = await ApiFetchRequest(
      `/property/my-requests-by-status?page=${currentPage}&limit=${limit}&status=${status}&sort_field=createdAt&sort_order=desc`
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

  const { data, isLoading, isError, refetch,isFetching } = useQuery({
    queryKey: ["my-requests", status, currentPage, limit],
    queryFn: fetchRequestsByStatus,
    keepPreviousData: true,
  });

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption.value);
    setCurrentPage(0); // Reset to first page
  };

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
            <h2>My Requests</h2>
            <p className="text">We are glad to see you again!</p>
          </div>
        </div>
        <div className="col-xxl-9">
          <FilterHeader
            show={true}
            handleChange={handleChange}
            selectedValue={selectedValue}
          />
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
                  {selectedValue === "Approved" && (
                    <RequestedAcceptedDataTable data={data.data} />
                  )}
                  {selectedValue === "Pending" && (
                    <RequestsPendingDataTable data={data.data} />
                  )}
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

export default DashboardRequestsAcceptedByAgent;