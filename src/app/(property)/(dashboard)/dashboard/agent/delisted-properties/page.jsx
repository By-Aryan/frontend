"use client";
import React, { useState, useEffect } from "react";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const AgentDelistedPropertiesPage = () => {
  const { auth } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDelistedProperties = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/agent/delisted-properties`,
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
      console.error("Error fetching agent delisted properties:", error);
      toast.error("Failed to fetch your delisted properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchDelistedProperties(currentPage, perPage, searchTerm);
    }
  }, [auth.accessToken, currentPage, perPage, searchTerm]);

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

  const columns = [
    {
      name: "Property Title",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      width: "250px",
    },
    {
      name: "Location",
      selector: (row) => `${row.location?.city || ""}, ${row.location?.area || ""}`,
      sortable: true,
      wrap: true,
      width: "180px",
    },
    {
      name: "Price",
      selector: (row) => `AED ${row.price?.toLocaleString() || "N/A"}`,
      sortable: true,
      width: "130px",
    },
    {
      name: "Seller",
      selector: (row) => row.seller_id?.fullname || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Delisted By Admin",
      selector: (row) => row.delisted_by?.fullname || "N/A",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div className="text-center">
          <span className="badge bg-danger text-white">
            {row.delisted_by?.fullname || "N/A"}
          </span>
          <br />
          <small className="text-muted">
            {row.delisted_by?.role || ""}
          </small>
        </div>
      ),
    },
    {
      name: "Delisted Date",
      selector: (row) => new Date(row.delisted_at).toLocaleDateString(),
      sortable: true,
      width: "130px",
    },
    {
      name: "Reason",
      selector: (row) => row.delist_reason || "Not specified",
      wrap: true,
      width: "200px",
      cell: (row) => (
        <div title={row.delist_reason || "Not specified"}>
          {row.delist_reason ? 
            (row.delist_reason.length > 50 ? 
              `${row.delist_reason.substring(0, 50)}...` : 
              row.delist_reason
            ) : 
            "Not specified"
          }
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleViewProperty(row._id)}
            title="View Details"
          >
            <i className="flaticon-view" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  const handleViewProperty = (propertyId) => {
    // You can implement view property details modal or navigation here
    console.log("View property:", propertyId);
    toast.info("Property details view - To be implemented");
  };

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#f8f9fa",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#e9ecef",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#dee2e6",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#495057",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        "&:hover": {
          backgroundColor: "#f1f3f4",
        },
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
            <h2>My Delisted Properties</h2>
            <p className="text">Properties that have been delisted by admin</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Delisted Properties</h5>
              <div className="d-flex gap-3 align-items-center">
                <div className="search-box">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search your properties..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: "250px" }}
                  />
                </div>
                <span className="badge bg-warning text-dark">
                  Total: {totalRows}
                </span>
              </div>
            </div>
            <div className="card-body p-0">
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
                  <div className="text-center py-4">
                    <i className="flaticon-home" style={{ fontSize: "48px", color: "#ccc" }} />
                    <p className="mt-2 text-muted">
                      You don't have any delisted properties yet
                    </p>
                    <small className="text-muted">
                      Properties delisted by admin will appear here
                    </small>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="alert alert-info">
            <h6 className="alert-heading">
              <i className="flaticon-info" /> About Delisted Properties
            </h6>
            <p className="mb-0">
              This section shows properties that have been delisted by admin. 
              The "Delisted By Admin" column shows which admin took the action and when. 
              If you have questions about why a property was delisted, please contact the admin who performed the action.
            </p>
          </div>
        </div>
      </div>
    </DashboardContentWrapper>
  );
};

export default AgentDelistedPropertiesPage;
