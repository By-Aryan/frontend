"use client"
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AssignedPropertiesDataTable from "@/components/property/dashboard/driver/AssignedPropertiesDataTable";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect, useState } from "react";

// Random Forest
const AssignedProperties = () => {
  const { data, error, isLoading, isError } = useAxiosFetch(`/driver/driver/assignments/me`);

  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (data?.data) {
      let filtered = [...data.data];

      // Apply date filter
      if (filterDate) {
        const selectedDate = new Date(filterDate).toDateString();
        filtered = filtered.filter(assignment => {
          const assignmentDate = new Date(assignment.visitingDate).toDateString();
          return assignmentDate === selectedDate;
        });
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(assignment => assignment.status === statusFilter);
      }

      // Sort by visiting date and time
      filtered.sort((a, b) => {
        const dateA = new Date(a.visitingDate + 'T' + a.visitingTime);
        const dateB = new Date(b.visitingDate + 'T' + b.visitingTime);
        return dateA - dateB;
      });
      setFilteredAssignments(filtered);
    }
  }, [data, filterDate, statusFilter]);

  const getTodayAssignments = () => {
    if (!data?.data) return 0;
    const today = new Date().toDateString();
    return data.data.filter(assignment => {
      const assignmentDate = new Date(assignment.visitingDate).toDateString();
      return assignmentDate === today;
    }).length;
  };

  const getPendingAssignments = () => {
    if (!data?.data) return 0;
    return data.data.filter(assignment => assignment.status === "pending").length;
  };


  // Random Forest

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

        {/* Random Forest */}
        <div className="row align-items-center pb40">
          <div className="col-xxl-6">
            <div className="dashboard_title_area">
              <h2>Assigned Properties</h2>
              <p className="text-muted">Manage your property assignments</p>
            </div>
          </div>
          <div className="col-xxl-6">
            <div className="dashboard_search_meta d-md-flex align-items-center justify-content-end">
              <div className="item">
                <div className="dashboard_badge badge px-3 py-2 me-3 mb-2 mb-md-0" style={{ color: 'black' }}>
                  <span className="font-weight-bold">Today's Visits:</span> {getTodayAssignments()}
                </div>
              </div>
              <div className="item">
                <div className="dashboard_badge badge px-3 py-2 mb-2 mb-md-0" style={{ color: 'black' }}>
                  <span className="font-weight-bold">Pending:</span> {getPendingAssignments()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label">Filter by Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-thm"
                    onClick={() => {
                      setFilterDate("");
                      setStatusFilter("all");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : isError ? (
                <div className="alert alert-danger" role="alert">
                  Error loading assignments. Please try again later.
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  No assignments found matching your filters.
                </div>
              ) : (
                <div className="packages_table table-responsive">
                  <AssignedPropertiesDataTable assignments={filteredAssignments} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Random Forest */}
        {/* End .row */}
      </DashboardContentWrapper>
    </>
  );
};

export default AssignedProperties;