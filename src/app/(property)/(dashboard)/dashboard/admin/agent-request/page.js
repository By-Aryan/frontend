"use client";
import { ApiFetchRequest } from "@/axios/apiRequest";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/property/Pagination";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AgentsRequestsDataTable from "@/components/property/dashboard/admin-agents-requests/AgentsRequestsDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });

const Options = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
];

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#0f8363" : isFocused ? "#ebfff9" : undefined,
  }),
};

const AgentsPropertyRequests = () => {
  const [agentsRequests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState({ value: "Pending", label: "Pending" });
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Fetch data with status parameter
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Always include status parameter with the API call
      const response = await ApiFetchRequest(
        `/property/getProperties?page=${currentPage}&limit=${limit}&status=${selectedValue.value}`
      );

      console.log("API Request:", `/property/getProperties?page=${currentPage}&limit=${limit}&status=${selectedValue.value}`);
      console.log("API Response:", response?.data);

      if (response?.data) {
        // Set the data from the API response
        setRequests(Array.isArray(response.data.data) ? response.data.data : []);

        // Set total records from API response
        if (typeof response.data.total_records === 'number') {
          setTotalRecords(response.data.total_records);
        } else {
          // Fallback to array length if total_records is not provided
          setTotalRecords(Array.isArray(response.data.data) ? response.data.data.length : 0);
        }

        // Set limit from API response or keep current limit
        if (typeof response.data.limit === 'number') {
          setLimit(response.data.limit);
        }

        setStatus(true);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setMessage(`Error loading data: ${error?.message || "Unknown error"}`);
      setStatus(false);
      setState({ ...state, open: true });

      setTimeout(() => {
        setState({ ...state, open: false });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedValue]);

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    setCurrentPage(0); // Reset to first page when changing filter
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

          <div className="row align-items-center pb20">
            <div className="col-lg-6">
              <div className="dashboard_title_area">
                <h2>Agent Requests</h2>
                <p className="text">Manage agent registration requests</p>
              </div>
              <div className="mt-3" style={{ width: '180px' }}>
                <label className="heading-color ff-heading fw600 mb10">
                  Status
                </label>
                <div className="location-area">
                  <Select
                    name="status"
                    value={selectedValue}
                    onChange={handleChange}
                    options={Options}
                    styles={customStyles}
                    className="select-custom pl-0"
                    classNamePrefix="select"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dashboard_search_meta d-flex justify-content-end">
                {/* Status dropdown moved to left side */}
              </div>
            </div>
          </div>
          {/* End .row */}

          <DashboardTableWrapper >
            {isLoading ? (
              <LoadingSpinner message="" size="md" color="success" />
            ) : (
              <div className="packages_table table-responsive">
                <AgentsRequestsDataTable
                  agentsRequests={agentsRequests}
                  selectedValue={selectedValue.value}
                />

                <div className="mt30">
                  <Pagination
                    currentPage={currentPage}
                    totalRecords={totalRecords}
                    limit={limit}
                    onPageChange={handlePageChange}
                    itemName="properties"
                  />
                </div>
              </div>
            )}
          </DashboardTableWrapper>
          {/* End .row */}
      </DashboardContentWrapper>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default AgentsPropertyRequests;
