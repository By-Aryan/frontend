# Frontend Changes Guide - Property Approval Flow

## Overview
This guide explains all frontend changes needed to implement the new property approval flow where admin must approve properties before they go live.

## Changes Required

### 1. Agent Requests Page (Seller's Requests)
**File:** `frontend 2/src/app/(property)/(dashboard)/dashboard/agent/requests/page.js`

**Current Behavior:**
- "List" button links to `/dashboard/agent/add-property/${property.request_id}`
- Property directly goes to "Listed By Me"

**New Behavior:**
- "List" button should call API: `POST /requestproperty/submit-for-approval/:id`
- Show success message: "Property submitted for admin approval"
- Property moves to "Pending Approval" section

---

### 2. Create New Page: Pending Approval
**New File:** `frontend 2/src/app/(property)/(dashboard)/dashboard/agent/pending-approval/page.js`

**Purpose:** Show properties waiting for admin approval

**API Endpoint:** `GET /requestproperty/pending-approval`

**Features:**
- List all properties with `approval_status.status = "Pending"`
- Show status badge: "Pending Admin Approval"
- Edit button (optional - can edit until admin approves)
- Show rejection reason if rejected
- Auto-refresh or manual refresh button

**Table Columns:**
- Property Name
- Submitted Date
- Status (Pending/Rejected)
- Rejection Reason (if any)
- Actions (View/Edit)

---

### 3. Update: Property Listed By Me
**File:** `frontend 2/src/app/(property)/(dashboard)/dashboard/agent/property-listed-by-me/page.js`

**Current API:** Probably fetching all properties by agent

**New API:** `GET /requestproperty/approved-properties`

**Change:** Only show properties with `approval_status.status = "Approved"`

---

### 4. Create Admin Approval Page
**New File:** `frontend 2/src/app/admin/property-approvals/page.jsx`

**Purpose:** Admin reviews and approves/rejects properties

**API Endpoints:**
- GET: `/requestproperty/admin/properties-pending-approval`
- PUT: `/requestproperty/admin/approve-property/:id`
- PUT: `/requestproperty/admin/reject-property/:id`

**Features:**
- List all pending properties
- Show property details, images, videos
- Show agent information
- Approve button (green)
- Reject button (red) with reason modal
- Filter by date, agent, property type

**Table Columns:**
- Property Name
- Agent Name
- Submitted Date
- Property Type
- Price
- Media Count
- Actions (Approve/Reject/View Details)

---

### 5. Update Navigation/Sidebar
Add new menu items:

**Agent Sidebar:**
```javascript
{
  title: "Pending Approval",
  href: "/dashboard/agent/pending-approval",
  icon: "flaticon-clock"
}
```

**Admin Sidebar:**
```javascript
{
  title: "Property Approvals",
  href: "/admin/property-approvals",
  icon: "flaticon-check"
}
```

---

## Detailed Implementation

### 1. Update Agent Requests Page

Replace the "List" button link with API call:

```javascript
// Add mutation hook
const submitForApprovalMutation = useAxiosPut("/requestproperty/submit-for-approval/");

// Handle submit for approval
const handleSubmitForApproval = async (requestId) => {
  try {
    const response = await submitForApprovalMutation.mutateAsync(requestId);
    
    if (response.data?.status === "success") {
      alert("Property submitted for admin approval successfully!");
      
      // Refresh the accepted list
      queryClient.invalidateQueries([
        "fetchData",
        "/requestproperty/accepted-by-me",
      ]);
      
      // Optionally redirect to pending approval page
      // router.push("/dashboard/agent/pending-approval");
    }
  } catch (error) {
    console.error("Error submitting for approval:", error);
    alert(error.response?.data?.message || "Failed to submit property for approval");
  }
};

// Update the button in Accepted tab
<button
  className="py-2 px-4 hover:bg-[#0f8363] border-1 border-[#0f8363] text-[#0f8363] hover:text-white font-semibold rounded-xl"
  style={{
    backgroundColor: "#0f8363",
    borderRadius: "10px",
    fontSize: "14px",
    color: "white",
  }}
  onClick={() => handleSubmitForApproval(property.request_id)}
>
  Submit for Approval
</button>
```

---

### 2. Create Pending Approval Page

```javascript
"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Link from "next/link";

const PendingApprovalPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useAxiosFetch(
    "/requestproperty/pending-approval"
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const getStatusBadge = (status, rejectionReason) => {
    if (status === "Rejected") {
      return (
        <div>
          <span className="badge bg-danger">Rejected</span>
          {rejectionReason && (
            <small className="d-block text-danger mt-1">
              {rejectionReason}
            </small>
          )}
        </div>
      );
    }
    return <span className="badge bg-warning">Pending Approval</span>;
  };

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <DboardMobileNavigation />
        </div>
      </div>

      <div className="row align-items-center pb20">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Pending Approval</h2>
            <p className="text">
              Properties waiting for admin approval
            </p>
          </div>
        </div>
      </div>

      <DashboardTableWrapper>
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner
              message="Loading properties..."
              size="md"
              color="success"
            />
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            Error loading properties: {error.message}
          </div>
        ) : (
          <div className="packages_table table-responsive p-0">
            <table className="table-style3 table at-savesearch">
              <thead className="t-head">
                <tr>
                  <th scope="col">Property Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Submitted Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="t-body">
                {data?.data && data.data.length > 0 ? (
                  data.data.map((property) => (
                    <tr key={property._id}>
                      <td>
                        <div className="list-content">
                          <div className="h6 list-title">
                            {property.name || property.title}
                          </div>
                          <p className="list-text mb-0">
                            {property.location?.address}
                          </p>
                        </div>
                      </td>
                      <td className="vam">
                        {property.currency} {property.price?.toLocaleString()}
                      </td>
                      <td className="vam">
                        {formatDate(property.createdAt)}
                      </td>
                      <td className="vam">
                        {getStatusBadge(
                          property.approval_status?.status,
                          property.rejection_reason
                        )}
                      </td>
                      <td className="vam">
                        <Link
                          href={`/dashboard/agent/edit-property/${property._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View/Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="fs-5 fw-medium mb-3">
                        No pending properties
                      </div>
                      <p className="text-muted">
                        All your properties have been processed
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DashboardTableWrapper>
    </DashboardContentWrapper>
  );
};

export default PendingApprovalPage;
```

---

### 3. Create Admin Approval Page

```javascript
"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPut from "@/hooks/useAxiosPut";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PropertyApprovalsPage = () => {
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = useAxiosFetch(
    "/requestproperty/admin/properties-pending-approval"
  );

  const approveMutation = useAxiosPut("/requestproperty/admin/approve-property/");
  const rejectMutation = useAxiosPut("/requestproperty/admin/reject-property/");

  const handleApprove = async (propertyId) => {
    if (!confirm("Are you sure you want to approve this property?")) return;

    try {
      await approveMutation.mutateAsync(propertyId);
      alert("Property approved successfully!");
      queryClient.invalidateQueries([
        "fetchData",
        "/requestproperty/admin/properties-pending-approval",
      ]);
    } catch (error) {
      alert("Failed to approve property: " + error.message);
    }
  };

  const handleRejectClick = (property) => {
    setSelectedProperty(property);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/requestproperty/admin/reject-property/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (response.ok) {
        alert("Property rejected successfully!");
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedProperty(null);
        queryClient.invalidateQueries([
          "fetchData",
          "/requestproperty/admin/properties-pending-approval",
        ]);
      }
    } catch (error) {
      alert("Failed to reject property: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="dashboard__main pl0-md">
      <div className="dashboard__content property-page bgc-f7">
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Property Approvals</h2>
              <p className="text">Review and approve properties submitted by agents</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner message="Loading properties..." />
          </div>
        ) : (
          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30">
                <div className="packages_table table-responsive">
                  <table className="table-style3 table">
                    <thead className="t-head">
                      <tr>
                        <th>Property</th>
                        <th>Agent</th>
                        <th>Price</th>
                        <th>Media</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="t-body">
                      {data?.data && data.data.length > 0 ? (
                        data.data.map((property) => (
                          <tr key={property._id}>
                            <td>
                              <div>
                                <strong>{property.name || property.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {property.details?.property_type} • {property.details?.purpose}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                {property.agent_id?.fullname}
                                <br />
                                <small className="text-muted">
                                  {property.agent_id?.email}
                                </small>
                              </div>
                            </td>
                            <td>
                              {property.currency} {property.price?.toLocaleString()}
                            </td>
                            <td>
                              <div>
                                <small>
                                  📷 {property.developer_notes?.image_count || 0} images
                                  <br />
                                  🎥 {property.developer_notes?.video_count || 0} videos
                                </small>
                              </div>
                            </td>
                            <td>{formatDate(property.createdAt)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleApprove(property._id)}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectClick(property)}
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            No properties pending approval
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Property</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Property:</strong> {selectedProperty?.name || selectedProperty?.title}
                  </p>
                  <div className="form-group">
                    <label>Rejection Reason *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleRejectSubmit}
                  >
                    Reject Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyApprovalsPage;
```

---

## Testing Checklist

### Agent Flow:
- [ ] Accept a seller request
- [ ] Click "Submit for Approval" button
- [ ] Verify property appears in "Pending Approval" section
- [ ] Verify property does NOT appear in "Listed By Me"
- [ ] Check rejection reason if admin rejects

### Admin Flow:
- [ ] View "Property Approvals" page
- [ ] See all pending properties
- [ ] Approve a property
- [ ] Verify it disappears from pending list
- [ ] Reject a property with reason
- [ ] Verify rejection reason is saved

### After Approval:
- [ ] Agent sees property in "Listed By Me"
- [ ] Property is visible to buyers
- [ ] Property has `visible_to_buyers = true`

---

## API Endpoints Summary

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| `/requestproperty/submit-for-approval/:id` | POST | Agent | Submit property for approval |
| `/requestproperty/pending-approval` | GET | Agent | Get pending approval properties |
| `/requestproperty/approved-properties` | GET | Agent | Get approved properties (Listed By Me) |
| `/requestproperty/admin/properties-pending-approval` | GET | Admin | Get all pending properties |
| `/requestproperty/admin/approve-property/:id` | PUT | Admin | Approve property |
| `/requestproperty/admin/reject-property/:id` | PUT | Admin | Reject property with reason |

---

## Notes

1. **Property ID vs RequestedProperty ID:**
   - When submitting for approval, use `RequestedProperty._id` (request_id)
   - For admin approval/rejection, use `Property._id` (returned in submit response)

2. **Status Badges:**
   - Pending: Yellow/Warning
   - Approved: Green/Success
   - Rejected: Red/Danger

3. **Notifications:**
   - Consider adding email notifications when:
     - Property is submitted for approval (to admin)
     - Property is approved (to agent)
     - Property is rejected (to agent with reason)

4. **Real-time Updates:**
   - Consider using WebSockets or polling for real-time status updates
   - Or add a "Refresh" button for manual updates
