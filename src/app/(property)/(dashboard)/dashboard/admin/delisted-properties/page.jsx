"use client";
import React, { useState, useEffect } from "react";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const DelistedPropertiesPage = () => {
  const { auth } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDelistedProperties = async (page = 1, limit = 10, search = "", status = "all") => {
    try {
      setLoading(true);
      
      console.log("🔍 fetchDelistedProperties called with:", { page, limit, search, status });
      console.log("🔐 Auth state:", { 
        hasToken: !!auth.accessToken,
        tokenLength: auth.accessToken?.length,
        userRole: auth.user?.role 
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/admin/delisted-properties`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          params: {
            page,
            limit,
            search,
            status: status === "all" ? undefined : status,
            _t: Date.now(), // Cache buster
          },
        }
      );

      console.log("📊 API Response:", { 
        status: response.status,
        success: response.data?.success,
        dataLength: response.data?.data?.length,
        totalRows: response.data?.pagination?.total 
      });

      if (response.data.success) {
        setProperties(response.data.data);
        setTotalRows(response.data.pagination.total);
      }
    } catch (error) {
      console.error("❌ Error fetching delisted properties:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      toast.error("Failed to fetch delisted properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchDelistedProperties(currentPage, perPage, searchTerm, statusFilter);
    }
  }, [auth.accessToken, currentPage, perPage, searchTerm, statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p._id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedProperties.length === 0) {
      toast.warning("Please select at least one property");
      return;
    }
    
    setConfirmAction({
      type: action,
      properties: selectedProperties,
      count: selectedProperties.length
    });
    setShowConfirmModal(true);
  };

  const handleExportData = () => {
    const csvData = properties.map(property => ({
      Title: property.title,
      Location: `${property.location?.city || "N/A"}, ${property.location?.area || "N/A"}`,
      Price: `AED ${property.price?.toLocaleString() || "N/A"}`,
      Seller: property.seller_id?.fullname || "N/A",
      Agent: property.agent_id?.fullname || "N/A",
      "Delisted By": property.delisted_by?.fullname || "N/A",
      "Delisted Date": new Date(property.delisted_at).toLocaleDateString(),
      Reason: property.delist_reason || "N/A"
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Title,Location,Price,Seller,Agent,Delisted By,Delisted Date,Reason\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `delisted_properties_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Data exported successfully!");
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          checked={selectedProperties.length === properties.length && properties.length > 0}
          onChange={handleSelectAll}
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          checked={selectedProperties.includes(row._id)}
          onChange={() => handleSelectProperty(row._id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "60px",
    },
    {
      name: "Property Title",
      selector: (row) => row.title || row.property_title || "Untitled Property",
      cell: (row) => (
        <div className="py-2">
          <div className="font-medium text-theme-heading text-sm">
            {row.title || row.property_title || "Untitled Property"}
          </div>
          {row.property_type && (
            <div className="text-xs text-gray-500 mt-1">
              {row.property_type}
            </div>
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
      width: "220px",
    },
    {
      name: "Location",
      selector: (row) => `${row.location?.city || "N/A"}, ${row.location?.area || "N/A"}`,
      cell: (row) => (
        <div className="py-2">
          <div className="text-sm text-theme-text">
            <i className="fas fa-map-marker-alt text-gray-400 mr-1" />
            {row.location?.city || "N/A"}
          </div>
          {row.location?.area && (
            <div className="text-xs text-gray-500 mt-1">
              {row.location.area}
            </div>
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
      width: "160px",
    },
    {
      name: "Price",
      selector: (row) => row.price || 0,
      cell: (row) => (
        <div className="py-2">
          <div className="font-medium text-theme-text">
            {row.price ? `AED ${row.price.toLocaleString()}` : "Price not set"}
          </div>
          {row.price_per_sqft && (
            <div className="text-xs text-gray-500">
              {row.price_per_sqft}/sqft
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Seller",
      selector: (row) => row.seller_id?.fullname || row.seller_id?.name || "N/A",
      cell: (row) => (
        <div className="py-2">
          <div className="text-sm text-theme-text">
            {row.seller_id?.fullname || row.seller_id?.name || "N/A"}
          </div>
          {row.seller_id?.email && (
            <div className="text-xs text-gray-500">
              {row.seller_id.email}
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Agent",
      selector: (row) => row.agent_id?.fullname || row.agent_id?.name || "N/A",
      cell: (row) => (
        <div className="py-2">
          <div className="text-sm text-theme-text">
            {row.agent_id?.fullname || row.agent_id?.name || "N/A"}
          </div>
          {row.agent_id?.email && (
            <div className="text-xs text-gray-500">
              {row.agent_id.email}
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Delisted By",
      selector: (row) => row.delisted_by?.fullname || row.delisted_by?.name || "N/A",
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="text-center py-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800 border border-warning-200">
            {row.delisted_by?.fullname || row.delisted_by?.name || "N/A"}
          </span>
          {row.delisted_by?.role && (
            <div className="text-xs text-gray-500 mt-1">
              {row.delisted_by.role}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Delisted Date",
      selector: (row) => row.delisted_at ? new Date(row.delisted_at).toLocaleDateString() : "N/A",
      cell: (row) => (
        <div className="py-2">
          <div className="text-sm text-theme-text">
            {row.delisted_at ? new Date(row.delisted_at).toLocaleDateString() : "N/A"}
          </div>
          {row.delisted_at && (
            <div className="text-xs text-gray-500">
              {new Date(row.delisted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Reason",
      selector: (row) => row.delist_reason || "No reason provided",
      cell: (row) => (
        <div className="py-2">
          <div className="text-sm text-theme-text max-w-xs">
            {row.delist_reason || "No reason provided"}
          </div>
          {row.delist_category && (
            <div className="text-xs text-gray-500 mt-1">
              Category: {row.delist_category}
            </div>
          )}
        </div>
      ),
      wrap: true,
      width: "180px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 hover:text-primary-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            onClick={() => handleViewProperty(row._id)}
            title="View Details"
          >
            <i className="flaticon-view mr-1" />
            View
          </button>
          <button
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-success-700 bg-success-50 border border-success-200 hover:bg-success-100 hover:text-success-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-1"
            onClick={() => handleRelistProperty(row._id)}
            title="Relist Property"
          >
            <i className="fas fa-undo mr-1" />
            Relist
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px",
    },
  ];

  const handleViewProperty = (propertyId) => {
    // You can implement view property details modal or navigation here
    console.log("View property:", propertyId);
    toast.info("Property details view - To be implemented");
  };

  const handleRelistProperty = async (propertyId) => {
    setConfirmAction({
      type: "relist",
      properties: [propertyId],
      count: 1
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    setIsProcessing(true);
    
    try {
      if (confirmAction.type === "relist") {
        const reason = prompt("Please provide a reason for relisting:");
        
        if (!reason || reason.trim().length < 10) {
          toast.error("Please provide a reason with at least 10 characters.");
          setIsProcessing(false);
          return;
        }

        // Handle single or bulk relist
        const promises = confirmAction.properties.map(propertyId =>
          axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/admin-relist/${propertyId}`,
            { reason: reason.trim() },
            {
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          )
        );

        await Promise.all(promises);
        toast.success(`${confirmAction.count} propert${confirmAction.count === 1 ? "y" : "ies"} relisted successfully!`);
        fetchDelistedProperties(currentPage, perPage, searchTerm, statusFilter);
      }
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error(error.response?.data?.message || "Failed to process action");
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
      setSelectedProperties([]);
    }
  };

  const customStyles = {
    table: {
      style: {
        backgroundColor: "rgb(var(--color-bg-primary))",
        borderRadius: "0.5rem",
      },
    },
    headRow: {
      style: {
        backgroundColor: "rgb(var(--color-bg-secondary))",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "rgb(var(--color-border))",
        borderRadius: "0.5rem 0.5rem 0 0",
        minHeight: "48px",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "rgb(var(--color-text-primary))",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    rows: {
      style: {
        minHeight: "80px",
        borderBottomWidth: "1px",
        borderBottomColor: "rgb(var(--color-border))",
        "&:hover": {
          backgroundColor: "rgb(var(--color-bg-hover))",
        },
        "&:last-child": {
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
    pagination: {
      style: {
        backgroundColor: "rgb(var(--color-bg-primary))",
        borderTop: "1px solid rgb(var(--color-border))",
        borderRadius: "0 0 0.5rem 0.5rem",
      },
    },
  };

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_navigationbar d-block d-lg-none">
            <div className="dropdown">
              <button
                className="dropbtn"
                onclick="myFunction()"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="hamburger_icon">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2 className="text-theme-heading">Delisted Properties</h2>
            <p className="text-theme-body">Manage all delisted properties in the system</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-theme-heading mb-0">All Delisted Properties</h5>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportData}
                    className="btn-theme-secondary text-sm"
                    disabled={properties.length === 0}
                  >
                    <i className="fas fa-download mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>
              
              {/* Filters and Search Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3 items-center">
                  {/* Status Filter */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusFilter("all")}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        statusFilter === "all"
                          ? "text-white border-[#0e8261]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      style={statusFilter === "all" ? { backgroundColor: '#0e8261' } : {}}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleStatusFilter("recent")}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        statusFilter === "recent"
                          ? "text-white border-[#0e8261]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      style={statusFilter === "recent" ? { backgroundColor: '#0e8261' } : {}}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => handleStatusFilter("old")}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        statusFilter === "old"
                          ? "text-white border-[#0e8261]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      style={statusFilter === "old" ? { backgroundColor: '#0e8261' } : {}}
                    >
                      Older
                    </button>
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedProperties.length > 0 && (
                    <div className="flex gap-2 ml-4">
                      <span className="text-sm text-gray-600">
                        {selectedProperties.length} selected
                      </span>
                      <button
                        onClick={() => handleBulkAction("relist")}
                        className="px-3 py-1.5 text-sm bg-success-500 text-white rounded-md hover:bg-success-600 transition-colors"
                      >
                        <i className="fas fa-undo mr-1" />
                        Bulk Relist
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control border-theme focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-md px-3 py-2"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "250px" }}
                    />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-secondary text-theme-secondary-text">
                    Total: {totalRows}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-0">
              <DataTable
                columns={columns}
                data={properties}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                loading={loading}
                customStyles={customStyles}
                responsive
                striped
                highlightOnHover
                noDataComponent={
                  <div className="text-center py-8">
                    <i className="flaticon-home text-gray-300" style={{ fontSize: "48px" }} />
                    <p className="mt-2 text-theme-body">No delisted properties found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-theme-heading mb-4">
              Confirm {confirmAction?.type === "relist" ? "Bulk Relist" : "Action"}
            </h3>
            <p className="text-theme-body mb-6">
              Are you sure you want to {confirmAction?.type === "relist" ? "relist" : "process"} {confirmAction?.count} selected propert{confirmAction?.count === 1 ? "y" : "ies"}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardContentWrapper>
  );
};

export default DelistedPropertiesPage;
