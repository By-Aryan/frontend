"use client";
import React, { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';

export default function AdminBannersPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'Buy',
    location: '',
    status: 'Active',
    redirect_url: '',
    image_files: []
  });

  // Auth guard
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/dashboard/home';
        return;
      }
      
      try {
        const res = await fetch(`${API}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.data.role === 'admin' || data.data.role === 'sub-admin') {
            setUser(data.data);
            setLoading(false);
          } else {
            window.location.href = '/dashboard/home';
          }
        } else {
          localStorage.removeItem('accessToken');
          window.location.href = '/dashboard/home';
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        window.location.href = '/dashboard/home';
      }
    };
    
    verifyAuth();
  }, []);

  // Fetch banners
  const fetchBanners = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/banners`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchBanners();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Step 1: Upload images to temp folder first
      const uploadFormData = new FormData();
      Array.from(formData.image_files).forEach((file) => {
        uploadFormData.append('files', file);
      });

      const uploadRes = await fetch(`${API}/api/v1/upload/temp/multiple`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        body: uploadFormData
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadData.success) {
        alert(`Upload failed: ${uploadData.message}`);
        return;
      }

      // Step 2: Create/Update banner with image names
      const bannerData = {
        title: formData.title,
        property_type: formData.property_type,
        location: formData.location,
        status: formData.status,
        redirect_url: formData.redirect_url,
        image_names: uploadData.files?.map(f => f.filename) || []
      };

      const url = editingBanner 
        ? `${API}/api/banners/update/${editingBanner.id}`
        : `${API}/api/banners/create`;
      
      const method = editingBanner ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bannerData)
      });

      const data = await res.json();
      
      if (data.success) {
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        setShowModal(false);
        setEditingBanner(null);
        setFormData({
          title: '',
          property_type: 'Buy',
          location: '',
          status: 'Active',
          redirect_url: '',
          image_files: []
        });
        fetchBanners();
      } else {
        alert(`Error: ${data.message || 'Failed to save banner'}`);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner');
    }
  };

  // Edit banner
  const editBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      property_type: banner.property_type,
      location: banner.location,
      status: banner.status,
      redirect_url: banner.redirect_url || '',
      image_files: []
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      property_type: 'Buy',
      location: '',
      status: 'Active',
      redirect_url: '',
      image_files: []
    });
    setEditingBanner(null);
    setShowModal(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Banner Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add New Banner
        </button>
      </div>

      {/* Banners Table */}
      <div className="card">
        <div className="card-header">
          <h5>All Banners ({banners.length})</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Property Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Images</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner.id}>
                  <td>{banner.title}</td>
                  <td>{banner.property_type}</td>
                  <td>
                    {typeof banner.location === 'string' 
                      ? banner.location 
                      : banner.location?.address || 
                        `${banner.location?.city || ''}, ${banner.location?.emirate || ''}`.replace(/^, |, $/, '') || 
                        'Location not available'
                    }
                  </td>
                  <td>
                    <span className={`badge ${banner.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {banner.status}
                    </span>
                  </td>
                  <td>{banner.image_url?.length || 0} images</td>
                  <td>{new Date(banner.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => editBanner(banner)}
                      >
                        Edit
                      </button>
                      {banner.redirect_url && (
                        <a 
                          href={banner.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-info"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No banners found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Banner */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Title *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        placeholder="Banner title"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Property Type *</label>
                      <select 
                        className="form-control"
                        value={formData.property_type}
                        onChange={e => setFormData({...formData, property_type: e.target.value})}
                        required
                      >
                        <option value="Buy">Buy</option>
                        <option value="Rent">Rent</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location *</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        required
                        placeholder="Dubai, Abu Dhabi, etc."
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-control"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Redirect URL *</label>
                      <input 
                        type="url"
                        className="form-control"
                        value={formData.redirect_url}
                        onChange={e => setFormData({...formData, redirect_url: e.target.value})}
                        required
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Banner Images *</label>
                      <input 
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={e => setFormData({...formData, image_files: e.target.files})}
                        required={!editingBanner}
                      />
                      <small className="text-muted">
                        You can select multiple images. Supported formats: JPG, PNG, GIF
                      </small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}