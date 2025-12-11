"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";


const MyPlanPage = () => {
  const [planData, setPlanData] = useState(null);
  const [contactViews, setContactViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';  
  
  // Dummy data for demonstration
  const stats = [
    {
      label: "Contact Views",
      value: "1/5",
      remaining: "4 remaining",
      icon: "eye",
    },
    {
      label: "Featured Listings",
      value: "0/0",
      remaining: "0 remaining",
      icon: "star",
    },
    {
      label: "Storage",
      value: "0/100 MB",
      remaining: "100 MB remaining",
      icon: "database",
    },
    {
      label: "Plan Status",
      value: "364 days",
      remaining: "Active\nFree Plan",
      icon: "calendar",
    },
  ];
  
  // Remove dummy data - we'll use real contactViews data
  

  useEffect(() => {
    fetchPlanData();
    fetchContactViews(); // Also fetch contact views on page load
  }, []);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/property/user-plan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPlanData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error('Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactViews = async (page = 1) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Fetching contact views for page:', page);
      
      const response = await axios.get(`${API_BASE_URL}/property/contact-views?page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('📞 Contact views response:', response.data);

      if (response.data.success) {
        setContactViews(response.data.data);
        console.log('✅ Contact views set:', response.data.data);
      } else {
        console.log('❌ Contact views fetch failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching contact views:', error);
      toast.error('Failed to load contact views');
    }
  };


  const handleViewContact = async (propertyId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_BASE_URL}/property/view-contact/${propertyId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Contact details revealed!');
        fetchPlanData(); // Refresh plan data to update usage
        return response.data.data.contactInfo;
      }
    } catch (error) {
      if (error.response?.data?.code === 'LIMIT_EXCEEDED') {
        toast.error('Contact view limit exceeded. Please upgrade your plan.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to view contact');
      }
      throw error;
    }
  };

  if (loading) {
    return (
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>My Plan</h2>
              <p className="text">Loading your plan details...</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    );
  }

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <DboardMobileNavigation />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Number Views by Me</h2>
            <p className="text">Manage your subscription and view usage details</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="bg-white bdrs12 p30 overflow-hidden position-relative">
            {/* Heading */}

          {/* Viewed Contact Numbers Table */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="title fz17 mb-0">
                <i className="fas fa-phone text-primary mr-2"></i>
                Viewed Contact Numbers
              </h4>
              <span className="text-muted">
                {contactViews?.pagination?.totalViews || 0} Total Views
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className="text-center" style={{width: '50px'}}>#</th>
                    <th scope="col">Property</th>
                    <th scope="col">Location</th>
                    <th scope="col" className="text-end">Price</th>
                    <th scope="col" className="text-center">Views</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactViews?.contactViews?.length > 0 ? (
                    contactViews.contactViews.map((view, index) => (
                      <tr key={view._id}>
                        <td className="text-center fw-bold text-primary">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-start flex-column">
                            <span className="fw-500">{view.propertyDetails?.title || 'Property'}</span>
                            <small className="text-muted">
                              <i className="fas fa-building mr-1"></i>
                              {view.propertyDetails?.propertyType || view.propertyId?.details?.property_type}
                            </small>
                          </div>
                        </td>
                        <td>
                          <i className="fas fa-map-marker-alt text-primary mr-1"></i>
                          {view.propertyDetails?.location ||
                           `${view.propertyId?.location?.city || ''}, ${view.propertyId?.location?.emirate || ''}`.replace(/^,\s*|,\s*$/g, '')}
                        </td>
                        <td className="text-end text-success fw-600">
                          {view.propertyDetails?.currency || 'AED'} {view.propertyDetails?.price?.toLocaleString() || view.propertyId?.price?.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary-light text-primary">
                            <i className="fas fa-eye mr-1"></i>
                            {view.propertyId?.analytics?.views || 0}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-500">{view.contactInfo?.name || 'Property Owner'}</span>
                            <small className="text-primary">
                              <i className="fas fa-phone-alt mr-1"></i>{view.contactInfo?.phone || 'Not provided'}
                            </small>
                            {view.contactInfo?.email && (
                              <small className="text-muted">
                                <i className="fas fa-envelope mr-1"></i>{view.contactInfo.email}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span>{new Date(view.viewedAt).toLocaleDateString()}</span>
                            <small className="text-muted">
                              {new Date(view.viewedAt).toLocaleTimeString()}
                            </small>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            {view.contactInfo?.whatsapp && (
                              <a
                                href={`https://wa.me/${view.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-success"
                                title="WhatsApp"
                              >
                                <i className="fab fa-whatsapp"></i>
                              </a>
                            )}
                            <button
                              className="btn btn-sm btn-primary"
                              title="View Property"
                              onClick={() => window.open(`/single-v1/${view.propertyId?._id || view.propertyId}`, '_blank')}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-center text-muted">
                          <i className="fas fa-phone-slash fa-3x mb-3 opacity-50"></i>
                          <p className="mb-1">No contact views yet</p>
                          <small>Start viewing property contacts to see them here</small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardContentWrapper>
  );
}

export default MyPlanPage;