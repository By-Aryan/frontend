"use client";
import React, { useState, useEffect } from "react";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const SellerDelistedPropertiesPage = () => {
  const { auth } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const fetchDelistedProperties = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/seller/delisted-properties`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          params: {
            page,
            limit,
            search,
          },
        }
      );

      if (response.data.success) {
        setProperties(response.data.data);
        setTotalRows(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching delisted properties:", error);
      toast.error("Failed to fetch delisted properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchDelistedProperties(currentPage, perPage, searchText);
    }
  }, [auth.accessToken, currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchDelistedProperties(1, perPage, searchText);
  };

  const handleRelistRequest = async (propertyId) => {
    const reason = prompt("Please provide a reason for relisting this property:");
    
    if (!reason || reason.trim().length < 10) {
      toast.error("Please provide a reason with at least 10 characters.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/relist-request`,
        {
          propertyId,
          reason: reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Relist request submitted successfully!");
      }
    } catch (error) {
      console.error("Error requesting relist:", error);
      toast.error(error.response?.data?.message || "Failed to request relist");
    }
  };

  const columns = [
    {
      name: "Property",
      selector: (row) => row.title || "N/A",
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.title || "N/A"}</div>
          <small className="text-muted">
            {row.location?.city ? `${row.location.city}, ${row.location.emirate || ""}` : "Location N/A"}
          </small>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <div className="fw-bold text-primary">
          AED {row.price ? row.price.toLocaleString() : "N/A"}
        </div>
      ),
    },
    {
      name: "Delisted Date",
      selector: (row) => new Date(row.delisted_at).toLocaleDateString(),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Delisted By",
      selector: (row) => row.delisted_by?.fullname || "N/A",
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <div>
          <div>{row.delisted_by?.fullname || "N/A"}</div>
          <small className="text-muted">{row.delisted_by?.role || ""}</small>
        </div>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.delist_reason,
      sortable: false,
      minWidth: "200px",
      cell: (row) => (
        <div title={row.delist_reason}>
          {row.delist_reason && row.delist_reason.length > 50 
            ? `${row.delist_reason.substring(0, 50)}...` 
            : row.delist_reason || "N/A"}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-success d-flex align-items-center"
            onClick={() => handleRelistRequest(row._id)}
            title="Request to relist this property"
          >
            <i className="fas fa-undo me-1"></i>
            Request Relist
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>
              <i className="fas fa-list-alt me-2"></i>
              My Delisted Properties
            </h2>
            <p className="text-muted">View and manage your properties that have been delisted</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_setup_property_area">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 text-primary">
                  <i className="fas fa-archive me-2"></i>
                  Your Delisted Properties
                </h5>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-info">
                    Total: {properties.length}
                  </span>
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search properties..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleSearch}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns}
                  data={properties}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  paginationPerPage={perPage}
                  paginationRowsPerPageOptions={[5, 10, 20, 50]}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  highlightOnHover
                  striped
                  responsive
                  noDataComponent={
                    <div className="text-center py-5">
                      <div className="py-4">
                        <i className="fas fa-archive fa-4x text-muted mb-3"></i>
                        <h5 className="text-muted">No delisted properties found</h5>
                        <p className="text-muted mb-4">
                          {searchText ? `No properties match "${searchText}"` : "You don't have any delisted properties."}
                        </p>
                        {searchText && (
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSearchText("");
                              handleSearch();
                            }}
                          >
                            <i className="fas fa-times me-2"></i>
                            Clear Search
                          </button>
                        )}
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardContentWrapper>
  );
};

export default SellerDelistedPropertiesPage;
