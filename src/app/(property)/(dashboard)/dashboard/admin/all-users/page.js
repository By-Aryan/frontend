"use client"
import { ApiFetchRequest } from "@/axios/apiRequest";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/property/Pagination";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AllAgentsDataTable from "@/components/property/dashboard/admin-dashboard-all-users/AllAgentsDataTable";
import AllBuyersDataTable from "@/components/property/dashboard/admin-dashboard-all-users/AllBuyersDataTable";
import AllDriversDataTable from "@/components/property/dashboard/admin-dashboard-all-users/AllDriversDataTable";
import AllSellersDataTable from "@/components/property/dashboard/admin-dashboard-all-users/AllSellersDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardAllUsers = () => {
  const [showTable, setShowTable] = useState("Agents");
  const [role, setRole] = useState("agent");
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Fetch data with role parameter and pagination
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Standard endpoint for all roles
      const endpoint = `/agents/role/${role}?page=${currentPage}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ''}`;
      console.log(`Using API endpoint: ${endpoint}`);
      const response = await ApiFetchRequest(endpoint);

      // For debugging only
      console.log(`API response for ${role}:`, response);

      if (response?.data) {
        // The API response structure is:
        // { status: "success", message: "...", data: { data: [...], page: 0, limit: 10, total_records: 15 } }

        // Extract the actual data array
        let responseData = [];

        if (response.data.data && Array.isArray(response.data.data.data)) {
          // If the structure is response.data.data.data
          responseData = response.data.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If the structure is response.data.data (from your example)
          responseData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // If the data is directly in response.data
          responseData = response.data;
        }

        console.log(`${role} data length:`, responseData.length);
        setUserData(responseData);

        // Set total records from API response
        let totalRecords = 0;
        if (response.data.data && response.data.data.total_records) {
          // If the structure is response.data.data.total_records
          totalRecords = response.data.data.total_records;
        } else if (response.data.total_records) {
          // If the structure is response.data.total_records
          totalRecords = response.data.total_records;
        } else {
          // Fallback to array length
          totalRecords = responseData.length;
        }
        setTotalRecords(totalRecords);

        // Set limit from API response or keep current limit
        if (response.data.data && response.data.data.limit) {
          setLimit(response.data.data.limit);
        } else if (response.data.limit) {
          setLimit(response.data.limit);
        }

        setStatus(true);
      } else if (response?.response?.status === 401) {
        console.error('Authentication error: Token may be expired or invalid');
        setMessage('Authentication error: Please log in again');
        setStatus(false);
        setState({ ...state, open: true });
      } else {
        console.error(`No data in response for ${role}:`, response);
        setUserData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
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
    console.log("Fetching data for role:", role);
    fetchData();
  }, [currentPage, searchTerm, role]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(0); // Reset to first page when searching
      fetchData();
    }
  };

  const handleRoleChange = (newRole, tableName) => {
    console.log(`Changing role to: ${newRole}, table: ${tableName}`);

    // Try different role string formats for drivers
    if (newRole === 'driver') {
      // Try both singular and plural forms
      console.log('Using "driver" as role');
      setRole('driver');

      // Uncomment these lines to test different role strings if needed
      // console.log('Using "drivers" as role');
      // setRole('drivers');
    } else {
      setRole(newRole);
    }

    setShowTable(tableName);
    setCurrentPage(0); // Reset to first page when changing role
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRolePlural = () => {
    switch (role) {
      case 'agent': return 'Agents';
      case 'seller': return 'Sellers';
      case 'buyer': return 'Buyers';
      case 'driver': return 'Drivers';
      default: return 'Users';
    }
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

        <div className="row align-items-center">
          <div className="col-xxl-3">
            <div className="dashboard_title_area">
              <h2>All {getRolePlural()}</h2>
              <p className="text">Manage all users in the system</p>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="row mb-3">
          <div className="col-lg-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="search_area" style={{ maxWidth: "300px" }}>
                <input
                  type="text"
                  className="form-control bdrs12"
                  placeholder="User Name ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  required
                />
                <label>
                  <span className="flaticon-search" />
                </label>
              </div>

              <div className="d-flex gap-2">
                <button className={`ud-btn btn-${showTable === 'Agents' ? 'thm' : 'white'}`} onClick={() => handleRoleChange("agent", "Agents")}>Agents</button>
                <button className={`ud-btn btn-${showTable === 'Sellers' ? 'thm' : 'white'}`} onClick={() => handleRoleChange("seller", "Sellers")}>Sellers</button>
                <button className={`ud-btn btn-${showTable === 'Buyers' ? 'thm' : 'white'}`} onClick={() => handleRoleChange("buyer", "Buyers")}>Buyers</button>
                <button className={`ud-btn btn-${showTable === 'Drivers' ? 'thm' : 'white'}`} onClick={() => handleRoleChange("driver", "Drivers")}>Drivers</button>
              </div>
            </div>
          </div>
        </div>

        <DashboardTableWrapper >
          {isLoading ? (
            <LoadingSpinner message="" size="md" color="success" />
          ) : (
            <div className="packages_table table-responsive">
              {showTable === "Agents" && (
                <AllAgentsDataTable role={role} agents={userData} isLoading={isLoading} />
              )}
              {showTable === "Sellers" && (
                <AllSellersDataTable role={role} agents={userData} isLoading={isLoading} />
              )}
              {showTable === "Buyers" && (
                <AllBuyersDataTable role={role} agents={userData} isLoading={isLoading} />
              )}
              {showTable === "Drivers" && (
                <AllDriversDataTable role={role} agents={userData} isLoading={isLoading} />
              )}

              <div className="mt30">
                <Pagination
                  currentPage={currentPage}
                  totalRecords={totalRecords}
                  limit={limit}
                  onPageChange={handlePageChange}
                  itemName={getRolePlural().toLowerCase()}
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

export default DashboardAllUsers;
