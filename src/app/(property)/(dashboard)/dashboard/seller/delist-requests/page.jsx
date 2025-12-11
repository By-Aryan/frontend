"use client";
import React, { useState, useEffect } from "react";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const SellerDelistRequestsPage = () => {
  const { auth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDelistRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/delist/user-requests`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setRequests(response.data.data.requests);
      }
    } catch (error) {
      console.error("Error fetching delist requests:", error);
      toast.error("Failed to fetch your delist requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchUserDelistRequests();
    }
  }, [auth.accessToken]);

  const columns = [
    {
      name: "Property",
      selector: (row) => row.propertyId?.title || row.propertyId?.name || "N/A",
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.propertyId?.title || row.propertyId?.name || "N/A"}</div>
          <small className="text-muted">
            {row.propertyId?.location?.city ? `${row.propertyId.location.city}, ${row.propertyId.location.emirate || ""}` : "Location N/A"}
          </small>
        </div>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: false,
      minWidth: "200px",
      cell: (row) => (
        <div title={row.reason}>
          {row.reason.length > 50 ? `${row.reason.substring(0, 50)}...` : row.reason}
        </div>
      ),
    },
    {
      name: "Date Requested",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "100px",
      cell: (row) => (
        <span className={`badge ${
          row.status === "pending" ? "bg-warning" :
          row.status === "approved" ? "bg-success" : "bg-danger"
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Processed Date",
      selector: (row) => row.processedAt ? new Date(row.processedAt).toLocaleDateString() : "N/A",
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Processed By",
      selector: (row) => row.processedBy?.fullname || "N/A",
      sortable: true,
      minWidth: "120px",
    },
  ];

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>My Delist Requests</h2>
            <p className="text">Track your property delist requests</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_setup_property_area">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Your Delist Requests</h5>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns}
                  data={requests}
                  progressPending={loading}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  noDataComponent={
                    <div className="text-center py-4">
                      <i className="fas fa-list fa-3x text-muted mb-3"></i>
                      <h5>No delist requests found</h5>
                      <p className="text-muted">
                        You haven't submitted any delist requests yet.
                      </p>
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

export default SellerDelistRequestsPage;
