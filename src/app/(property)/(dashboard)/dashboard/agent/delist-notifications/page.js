"use client";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { ApiFetchRequest } from "@/axios/apiRequest";
import React, { useState, useEffect } from "react";

const AgentDelistNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // ApiFetchRequest will prepend NEXT_PUBLIC_API_BASE_URL, so use relative endpoint
      const response = await ApiFetchRequest("/delist/user-notifications");
      
      if (response.data && response.data.success) {
        setNotifications(response.data.data);
      } else {
        console.error("Failed to fetch delist notifications:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching delist notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DashboardContentWrapper>
        <div className="row pb40">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Delist Notifications</h2>
              <p className="text">View updates on delist requests for your managed properties</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
              <div className="navtab-style1">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                    <h5>No Notifications</h5>
                    <p className="text-muted">
                      You don't have any delist notifications yet.
                    </p>
                  </div>
                ) : (
                  <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb20 delist-card delist-notification-item"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h4 className="font-semibold text-dark mb-0">
                            {notification.property_name || notification.property?.title || 'Unknown Property'}
                          </h4>
                          <span
                            className={`delist-status-badge ${
                              notification.status === "approved"
                                ? "bg-success text-white"
                                : notification.status === "rejected"
                                ? "bg-danger text-white"
                                : notification.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-secondary text-white"
                            }`}
                          >
                            {notification.status?.charAt(0).toUpperCase() + 
                             notification.status?.slice(1) || 'Pending'}
                          </span>
                        </div>
                        
                        <div className="text-gray-600 mb-3">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-2">
                                <strong className="text-dark">Reason:</strong> {notification.reason || 'No reason provided'}
                              </p>
                              {notification.property_location && (
                                <p className="mb-2">
                                  <strong className="text-dark">Location:</strong> {
                                    typeof notification.property_location === 'object' 
                                      ? `${notification.property_location.city || ''}, ${notification.property_location.emirate || ''}`
                                      : notification.property_location
                                  }
                                </p>
                              )}
                              {notification.requester && (
                                <p className="mb-2">
                                  <strong className="text-dark">Requested by:</strong> {notification.requester.fullname}
                                </p>
                              )}
                              <p className="mb-2">
                                <strong className="text-dark">Request Type:</strong> 
                                <span className={`delist-status-badge ms-2 ${
                                  notification.request_type === "seller" 
                                    ? "bg-primary text-white" 
                                    : "bg-info text-white"
                                }`}>
                                  {notification.request_type || 'seller'}
                                </span>
                              </p>
                            </div>
                            <div className="col-md-6">
                              {/* Show property images if available */}
                              {notification.property_images && notification.property_images.length > 0 && (
                                <div className="mb-2">
                                  <img 
                                    src={notification.property_images[0]} 
                                    alt="Property" 
                                    className="img-thumbnail"
                                    style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                                  />
                                </div>
                              )}
                              
                              {/* Waiting indicator when pending */}
                              {(!notification.status || notification.status === 'pending') && (
                                <div className="alert alert-warning py-2 px-3 mb-2 delist-waiting-indicator">
                                  <i className="fas fa-clock me-2"></i>
                                  <strong>Action Required:</strong> Awaiting your approval
                                </div>
                              )}
                              {notification.processed_by && (
                                <p className="mb-2">
                                  <strong className="text-dark">Processed by:</strong> {notification.processed_by.fullname}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted border-top pt-3">
                          {notification.processed_at && (
                            <p className="mb-0">
                              <i className="fas fa-calendar-alt me-1"></i>
                              Processed on: {formatDate(notification.processed_at)}
                            </p>
                          )}
                          {!notification.processed_at && (
                            <p className="mb-0">
                              <i className="fas fa-calendar-plus me-1"></i>
                              Requested on: {formatDate(notification.created_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>

      <DboardMobileNavigation />
    </>
  );
};

export default AgentDelistNotifications;
