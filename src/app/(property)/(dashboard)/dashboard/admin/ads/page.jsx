"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AdsDialog from "@/components/common/AdsDialog";
import Pagination from "@/components/property/Pagination";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AgentsRequestsDataTable from "@/components/property/dashboard/admin-agents-requests/AgentsRequestsDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/styles/ads-dialog.css";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

const Page = () => {
  const [isAdsDialogOpen, setIsAdsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedAd, setSelectedAd] = useState(null);
  const [adsData, setAdsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch ads data from API
  const fetchAdsData = async (isRetry = false, isBackgroundFetch = false) => {
    // Don't show loading if we have cached data (for better UX) or if it's a background fetch
    if (!isRetry && adsData.length === 0 && !isBackgroundFetch) {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      console.log('🔄 Fetching ads from:', `${API}/api/ads`);
      console.log('Current ads count:', adsData.length);

      const response = await fetch(`${API}/api/ads`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('📡 Response status:', response.status);

      // Handle 404 separately - it means "no ads exist" not "error"
      if (response.status === 404) {
        const data = await response.json().catch(() => ({}));
        console.log('ℹ️ No ads found in database (404)');

        // Only clear if we're sure there are no ads
        setAdsData([]);
        setFetchError(null);
        setIsLoading(false);
        return;
      }

      // Handle authentication errors
      if (response.status === 401) {
        console.error('🔒 Authentication error');
        setFetchError('Authentication error');

        if (!isRetry) {
          setMessage('Authentication error: Please log in again');
          setStatus("error");
          setSnackbarState(prev => ({ ...prev, open: true }));
        }

        setIsLoading(false);
        return;
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse successful response
      const data = await response.json();
      console.log('📦 API Response:', data);

      // Handle successful response with data
      if (data?.success && data?.data) {
        const adsArray = Array.isArray(data.data) ? data.data : [];
        console.log('📝 Raw ads array length:', adsArray.length);

        if (adsArray.length > 0) {
          // Map API response to UI format
          const mappedAds = adsArray.map((ad) => ({
            id: ad._id,
            _id: ad._id,
            title: ad.title || 'Untitled',
            description: ad.description || '',
            redirect_url: ad.redirect_url || '',
            start_date: ad.start_date,
            end_date: ad.end_date,
            status: ad.status || 'Inactive',
            placement: ad.placement || 'unknown',
            image_url: ad.image_url || ''
          }));

          console.log('✅ Successfully loaded', mappedAds.length, 'ads');
          setAdsData(mappedAds);
          setFetchError(null);
          setRetryCount(0);
        } else {
          // API returned success but empty array
          console.log('ℹ️ API returned empty ads array');
          setAdsData([]);
          setFetchError(null);
        }
      }
      // Handle explicit "no ads" message
      else if (data?.message === "No ads found" || (data?.success === false && data?.message === "No ads found")) {
        console.log('ℹ️ No ads found (API message)');
        setAdsData([]);
        setFetchError(null);
      }
      // Unexpected response format
      else {
        console.error('❌ Unexpected API response structure:', data);
        setFetchError('Invalid response format');

        if (!isRetry) {
          setMessage('Failed to load advertisements. Please try again.');
          setStatus("error");
          setSnackbarState(prev => ({ ...prev, open: true }));
        }
      }
    } catch (error) {
      console.error('❌ Error fetching ads:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name
      });

      setFetchError(error.message);

      if (!isRetry) {
        setMessage(`Error loading advertisements: ${error?.message || "Unknown error"}`);
        setStatus("error");
        setSnackbarState(prev => ({ ...prev, open: true }));

        setTimeout(() => {
          setSnackbarState(prev => ({ ...prev, open: false }));
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount with proper caching strategy
  useEffect(() => {
    console.log('🚀 Component mounted, checking cache...');

    // Try to load cached data first for instant display
    const cachedAds = localStorage.getItem('adsData');
    const cacheTimestamp = localStorage.getItem('adsDataTimestamp');

    if (cachedAds) {
      try {
        const parsedAds = JSON.parse(cachedAds);
        const cacheAge = Date.now() - parseInt(cacheTimestamp || '0', 10);
        const maxCacheAge = 5 * 60 * 1000; // 5 minutes

        console.log('💾 Found cached ads:', parsedAds.length, 'items');
        console.log('⏱️ Cache age:', Math.round(cacheAge / 1000), 'seconds');

        // Always show cached data immediately (even if stale)
        if (parsedAds.length > 0) {
          setAdsData(parsedAds);
          setIsLoading(false);
          console.log('✅ Displaying cached ads immediately');
        }

        // If cache is fresh, don't refetch
        if (cacheAge < maxCacheAge) {
          console.log('✅ Cache is fresh, skipping API call');
          setIsLoading(false);
          return;
        }

        console.log('⚠️ Cache is stale, fetching fresh data in background...');
        // Fetch in background without showing loading spinner
        fetchAdsData(false, true);
        return;
      } catch (error) {
        console.error('❌ Error parsing cached ads:', error);
        localStorage.removeItem('adsData');
        localStorage.removeItem('adsDataTimestamp');
      }
    } else {
      console.log('ℹ️ No cached data found');
    }

    // Fetch fresh data from API (will show loading spinner)
    fetchAdsData();
  }, []);

  // Save ads data to localStorage whenever it changes (with timestamp)
  useEffect(() => {
    if (adsData.length > 0) {
      console.log('💾 Saving', adsData.length, 'ads to localStorage with timestamp');
      localStorage.setItem('adsData', JSON.stringify(adsData));
      localStorage.setItem('adsDataTimestamp', Date.now().toString());
    }
    // Don't clear cache if adsData is empty - might be loading state
  }, [adsData]);

  const handleCreateAdsClick = () => {
    setDialogMode('create');
    setSelectedAd(null);
    setIsAdsDialogOpen(true);
  };

  const handleEditAds = (ad) => {
    setDialogMode('update');
    setSelectedAd(ad);
    setIsAdsDialogOpen(true);
  };

  const handleCloseAdsDialog = () => {
    setIsAdsDialogOpen(false);
    setSelectedAd(null);
  };

  const handleSubmitAds = async (formData) => {
    try {
      setIsLoading(true);
      
      if (dialogMode === 'create') {
        // Prepare FormData for multipart form submission
        const formDataToSend = new FormData();
        
        // Add all form fields to FormData
        formDataToSend.append('title', formData.title.trim());
        
        // Only add optional fields if they have values
        if (formData.description && formData.description.trim()) {
          formDataToSend.append('description', formData.description.trim());
        }
        
        if (formData.redirect_url && formData.redirect_url.trim()) {
          formDataToSend.append('redirect_url', formData.redirect_url.trim());
        }
        
        // Convert dates to ISO format with local time (not UTC)
        // This ensures dates are treated as local timezone, not UTC
        const startDate = new Date(formData.start_date + 'T00:00:00').toISOString();
        const endDate = new Date(formData.end_date + 'T23:59:59').toISOString();
        
        formDataToSend.append('start_date', startDate);
        formDataToSend.append('end_date', endDate);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('placement', formData.placement.trim());
        
        // Add the actual file (not base64)
        if (formData.imageFile) {
          formDataToSend.append('image_url', formData.imageFile);
        }
        
        console.log('Prepared FormData for API:');
        for (let [key, value] of formDataToSend.entries()) {
          if (key === 'image_url') {
            console.log(`${key}:`, `File: ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        }

        // Call create API with FormData - use full path since ads is not under /api/v1
        console.log('Calling endpoint: ${API}/api/ads/create'); // Debug log

        const response = await fetch(`${API}/api/ads/create`, {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();
        console.log('Create API Response:', data);

        if (response.ok && data?.success) {
          setMessage(data.message || "Advertisement created successfully!");
          setStatus("success");
          setSnackbarState(prev => ({ ...prev, open: true }));
          setIsAdsDialogOpen(false);

          // Clear cache timestamp to force fresh fetch
          localStorage.removeItem('adsDataTimestamp');

          // Refresh the ads data after successful create
          await fetchAdsData();
        } else if (response.status === 401) {
          throw new Error("Authentication error: Please log in again");
        } else if (response.status === 400) {
          throw new Error(data?.message || "Invalid data provided");
        } else if (response.status === 500) {
          throw new Error("Server error: Please try again later");
        } else {
          throw new Error(data?.message || "Failed to create advertisement");
        }
      } else {
        // Handle update API call - only title and status can be updated according to API spec
        const updateData = {
          title: formData.title.trim(),
          status: formData.status
        };
        
        console.log('Update API payload:', updateData);
        console.log(`Calling endpoint: ${API}/api/ads/${selectedAd._id}`);

        const response = await fetch(`${API}/api/ads/${selectedAd._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();
        console.log('Update API Response:', data);

        if (response.ok && data?.success) {
          setMessage(data.message || "Advertisement updated successfully!");
          setStatus("success");
          setSnackbarState(prev => ({ ...prev, open: true }));
          setIsAdsDialogOpen(false);

          // Clear cache timestamp to force fresh fetch
          localStorage.removeItem('adsDataTimestamp');

          // Refresh the ads data after successful update
          await fetchAdsData();
        } else if (response.status === 404) {
          throw new Error("Advertisement not found");
        } else if (response.status === 401) {
          throw new Error("Authentication error: Please log in again");
        } else if (response.status === 500) {
          throw new Error("Server error: Please try again later");
        } else {
          throw new Error(data?.message || "Failed to update advertisement");
        }
      }
      
    } catch (error) {
      console.error("Error submitting ad:", error);
      setMessage(`Failed to ${dialogMode === 'create' ? 'create' : 'update'} advertisement. ${error.message || 'Please try again.'}`);
      setStatus("error");
      setSnackbarState(prev => ({ ...prev, open: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this advertisement? This action cannot be undone.");

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(`🗑️ Deleting ad with ID: ${adId}`);

      // Call delete API
      const response = await fetch(`${API}/api/ads/${adId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete API Response:', data);

      if (response.ok && data?.success) {
        setMessage(data.message || "Advertisement deleted successfully!");
        setStatus("success");
        setSnackbarState(prev => ({ ...prev, open: true }));

        // Update cache immediately for instant feedback
        const updatedAds = adsData.filter(ad => ad._id !== adId && ad.id !== adId);
        setAdsData(updatedAds);

        // Clear timestamp to force fresh fetch next time
        localStorage.removeItem('adsDataTimestamp');

        // Refresh from API in background
        await fetchAdsData();
      } else if (response.status === 404) {
        setMessage("Advertisement not found - it may have already been deleted");
        setStatus("error");
        setSnackbarState(prev => ({ ...prev, open: true }));

        // Clear timestamp and refresh
        localStorage.removeItem('adsDataTimestamp');
        await fetchAdsData();
      } else if (response.status === 401) {
        setMessage("Authentication error: Please log in again");
        setStatus("error");
        setSnackbarState(prev => ({ ...prev, open: true }));
      } else if (response.status === 500) {
        throw new Error("Server error: Please try again later");
      } else {
        throw new Error(data?.message || "Failed to delete advertisement");
      }
    } catch (error) {
      console.error("❌ Error deleting ad:", error);
      setMessage(`Failed to delete advertisement: ${error.message || "Please try again."}`);
      setStatus("error");
      setSnackbarState(prev => ({ ...prev, open: true }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarState(prev => ({ ...prev, open: false }));
  };

  // Function to manually refresh ads data
  const handleRefreshAds = () => {
    console.log('🔄 Manual refresh triggered');
    // Clear cache timestamp to force fresh fetch
    localStorage.removeItem('adsDataTimestamp');
    setIsLoading(true);
    fetchAdsData(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: 'badge-success',
      Inactive: 'badge-danger',
      Expired: 'badge-warning'
    };

    return (
      <span
        className={`badge ${statusClasses[status] || 'badge-secondary'} px-2 py-1`}
        style={{
          fontSize: '12px',
          borderRadius: '4px',
          color: 'white'
        }}
      >
        {status}
      </span>
    );
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

        <div className="row justify-between items-end pb20">
          <div className="col-lg-6">
            <div className="dashboard_title_area">
              <h2>Ads Management</h2>
              <p className="text">
                Manage All Ads
                {!isLoading && adsData.length > 0 && (
                  <span className="badge bg-success ms-2">{adsData.length} Total</span>
                )}
                {isLoading && (
                  <span className="badge bg-info ms-2">Loading...</span>
                )}
                {fetchError && (
                  <span className="badge bg-danger ms-2">Error</span>
                )}
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="ud-btn btn-outline-thm"
                onClick={handleRefreshAds}
                disabled={isLoading}
              >
                <i className={`fal fa-sync ${isLoading ? 'fa-spin' : ''} me-2`} />
                Refresh
              </button>
              <button
                className="btn-thm ud-btn"
                onClick={handleCreateAdsClick}
              >
                <i className="fal fa-plus me-2" />
                Create Ads
              </button>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  <LoadingSpinner />
                </div>
              ) : fetchError ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="flaticon-close" style={{ fontSize: '64px', color: '#dc3545', opacity: 0.3 }} />
                  </div>
                  <h4 className="mb-3" style={{ color: 'var(--color-headings)' }}>Failed to Load Advertisements</h4>
                  <p className="text-muted mb-4">
                    {fetchError === 'Authentication error'
                      ? 'Please log in again to view advertisements.'
                      : 'There was an error loading the advertisements. Please try again.'}
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="ud-btn btn-thm"
                      onClick={() => {
                        setRetryCount(prev => prev + 1);
                        fetchAdsData(true);
                      }}
                    >
                      <i className="fal fa-redo me-2" />
                      Retry
                    </button>
                    <button
                      className="ud-btn btn-outline-thm"
                      onClick={handleCreateAdsClick}
                    >
                      <i className="fal fa-plus me-2" />
                      Create New Ad
                    </button>
                  </div>
                </div>
              ) : adsData.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="flaticon-megaphone" style={{ fontSize: '64px', color: 'var(--color-primary)', opacity: 0.3 }} />
                  </div>
                  <h4 className="mb-3" style={{ color: 'var(--color-headings)' }}>No Advertisements Yet</h4>
                  <p className="text-muted mb-4">Start creating advertisements to promote your services and reach more customers.</p>
                  <button
                    className="ud-btn btn-thm"
                    onClick={handleCreateAdsClick}
                  >
                    <i className="fal fa-plus me-2" />
                    Create Your First Ad
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title & Image</th>
                        <th scope="col">Placement</th>
                        <th scope="col">Status</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adsData.map((ad, index) => (
                        <tr key={ad._id || ad.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {ad.image_url && (
                                <img 
                                  src={`${API}${ad.image_url}`}
                                  alt={ad.title}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginRight: '12px',
                                    border: '1px solid #e5e7eb'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <h6 className="mb-1" style={{ fontSize: '14px' }}>{ad.title}</h6>
                                <small className="text-muted">
                                  {ad.description && ad.description.length > 50 
                                    ? `${ad.description.substring(0, 50)}...` 
                                    : ad.description}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {ad.placement}
                            </span>
                          </td>
                          <td>{getStatusBadge(ad.status)}</td>
                          <td>{new Date(ad.start_date).toLocaleDateString()}</td>
                          <td>{new Date(ad.end_date).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {ad.image_url && (
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => window.open(`${API}${ad.image_url}`, '_blank')}
                                  style={{ fontSize: '12px' }}
                                  title="View Image"
                                >
                                  <i className="fal fa-eye me-1" />
                                  View
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditAds(ad)}
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fal fa-edit me-1" />
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAd(ad._id || ad.id)}
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fal fa-trash me-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ads Dialog */}
        <AdsDialog
          isOpen={isAdsDialogOpen}
          onClose={handleCloseAdsDialog}
          mode={dialogMode}
          initialData={selectedAd}
          onSubmit={handleSubmitAds}
        />

        {/* Snackbar for notifications */}
        <StatusSnackbar
          message={message}
          state={snackbarState}
          status={status}
          onClose={handleCloseSnackbar}
        />
      </DashboardContentWrapper>
    </>
  );
};

export default Page;
