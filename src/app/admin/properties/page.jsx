"use client";
import React, { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';

export default function AdminPropertiesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [propsList, setPropsList] = useState([]);
  const [meta, setMeta] = useState({});
  const [selectedPropertyLogs, setSelectedPropertyLogs] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  
  // New Project form
  const [newProperty, setNewProperty] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    'location.country': 'UAE',
    'location.city': '',
    'details.property_type': 'Apartment',
    'details.bedrooms': 1,
    'details.bathrooms': 1
  });
  
  // Filters
  const [filters, setFilters] = useState({
    name: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
    email: ''
  });
  
  const [logFilters, setLogFilters] = useState({
    email: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
  });

  // Auth guard with server verification
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

  const fetchProps = async (p = 1) => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams({
      page: p.toString(),
      limit: limit.toString(),
      ...(filters.name && { name: filters.name })
    });
    
    const url = `${API}/api/v1/admin/properties?${params}`;
    const res = await fetch(url, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
    });
    const data = await res.json();
    setPropsList(data.data || []);
    setMeta(data.meta || {});
    setLoading(false);
  };

  useEffect(() => { 
    if (user) fetchProps(page); 
  }, [page, user]);

  const applyFilters = () => {
    setPage(1);
    fetchProps(1);
  };

  const viewLogs = async (propertyId) => {
    const params = new URLSearchParams({
      page: logFilters.page.toString(),
      limit: '50',
      ...(logFilters.email && { email: logFilters.email }),
      ...(logFilters.startDate && { startDate: logFilters.startDate }),
      ...(logFilters.endDate && { endDate: logFilters.endDate }),
      sortBy: logFilters.sortBy,
      sortOrder: logFilters.sortOrder
    });
    
    const url = `${API}/api/v1/admin/property/${propertyId}/notify-logs?${params}`;
    const res = await fetch(url, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
    });
    const data = await res.json();
    setSelectedPropertyLogs({ 
      propertyId, 
      property: data.property || {},
      requests: data.requests || [], 
      meta: data.meta || {} 
    });
  };

  const exportLogs = (propertyId) => {
    const params = new URLSearchParams({
      export: 'csv',
      ...(logFilters.email && { email: logFilters.email }),
      ...(logFilters.startDate && { startDate: logFilters.startDate }),
      ...(logFilters.endDate && { endDate: logFilters.endDate }),
      sortBy: logFilters.sortBy,
      sortOrder: logFilters.sortOrder
    });
    
    const url = `${API}/api/v1/admin/property/${propertyId}/notify-logs?${params}`;
    const token = localStorage.getItem('accessToken');
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.text())
      .then(csv => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `notify_logs_${propertyId}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  const bulkExport = () => {
    const selectedIds = propsList.filter(p => p.selected).map(p => p._id);
    const payload = {
      propertyIds: selectedIds.length > 0 ? selectedIds : undefined,
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.email && { email: filters.email })
    };
    
    const token = localStorage.getItem('accessToken');
    fetch(`${API}/api/v1/admin/notify-logs/export`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(r => r.text())
    .then(csv => {
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `bulk_notify_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  const createProperty = async () => {
    const token = localStorage.getItem('accessToken');
    
    // Transform flat form data to nested structure
    const propertyData = {
      name: newProperty.name,
      title: newProperty.title,
      description: newProperty.description,
      price: parseFloat(newProperty.price) || 0,
      location: {
        country: newProperty['location.country'],
        city: newProperty['location.city']
      },
      details: {
        property_type: newProperty['details.property_type'],
        bedrooms: parseInt(newProperty['details.bedrooms']) || 1,
        bathrooms: parseInt(newProperty['details.bathrooms']) || 1
      }
    };
    
    const res = await fetch(`${API}/api/v1/admin/property`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(propertyData)
    });
    
    if (res.ok) {
      alert('Property created successfully!');
      setNewProperty({
        name: '', title: '', description: '', price: '',
        'location.country': 'UAE', 'location.city': '',
        'details.property_type': 'Apartment',
        'details.bedrooms': 1, 'details.bathrooms': 1
      });
      fetchProps(page);
    } else {
      const error = await res.json();
      alert(`Failed to create property: ${error.message}`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard - Properties</h2>
        <div className="btn-group">
          <button 
            className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button 
            className={`btn ${activeTab === 'new-project' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('new-project')}
          >
            New Project
          </button>
        </div>
      </div>

      {activeTab === 'new-project' && (
        <div className="card p-4">
          <h3 className="mb-3">Add New Project</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name *</label>
              <input 
                className="form-control" 
                value={newProperty.name}
                onChange={e => setNewProperty({...newProperty, name: e.target.value})}
                placeholder="Property name"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Title</label>
              <input 
                className="form-control" 
                value={newProperty.title}
                onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                placeholder="Property title"
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                value={newProperty.description}
                onChange={e => setNewProperty({...newProperty, description: e.target.value})}
                placeholder="Property description"
                rows="3"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input 
                type="number"
                className="form-control" 
                value={newProperty.price}
                onChange={e => setNewProperty({...newProperty, price: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Country</label>
              <select 
                className="form-control"
                value={newProperty['location.country']}
                onChange={e => setNewProperty({...newProperty, 'location.country': e.target.value})}
              >
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Qatar">Qatar</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">City</label>
              <input 
                className="form-control" 
                value={newProperty['location.city']}
                onChange={e => setNewProperty({...newProperty, 'location.city': e.target.value})}
                placeholder="Dubai, Abu Dhabi, etc."
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Property Type</label>
              <select 
                className="form-control"
                value={newProperty['details.property_type']}
                onChange={e => setNewProperty({...newProperty, 'details.property_type': e.target.value})}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Bedrooms</label>
              <input 
                type="number"
                min="0"
                className="form-control" 
                value={newProperty['details.bedrooms']}
                onChange={e => setNewProperty({...newProperty, 'details.bedrooms': parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Bathrooms</label>
              <input 
                type="number"
                min="0"
                className="form-control" 
                value={newProperty['details.bathrooms']}
                onChange={e => setNewProperty({...newProperty, 'details.bathrooms': parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <button 
            className="btn btn-success"
            onClick={createProperty}
            disabled={!newProperty.name}
          >
            Create Property
          </button>
        </div>
      )}

      {activeTab === 'properties' && (
        <>
          {/* Filters */}
          <div className="card p-3 mb-4">
            <h5>Filters & Search</h5>
            <div className="row">
              <div className="col-md-3">
                <label>Search by Name</label>
                <input 
                  className="form-control"
                  value={filters.name}
                  onChange={e => setFilters({...filters, name: e.target.value})}
                  placeholder="Property name"
                />
              </div>
              <div className="col-md-2">
                <label>Start Date</label>
                <input 
                  type="date"
                  className="form-control"
                  value={filters.startDate}
                  onChange={e => setFilters({...filters, startDate: e.target.value})}
                />
              </div>
              <div className="col-md-2">
                <label>End Date</label>
                <input 
                  type="date"
                  className="form-control"
                  value={filters.endDate}
                  onChange={e => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
              <div className="col-md-2">
                <label>Sort By</label>
                <select 
                  className="form-control"
                  value={filters.sortBy}
                  onChange={e => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="created_at">Created Date</option>
                  <option value="name">Name</option>
                  <option value="analytics.views">Views</option>
                  <option value="analytics.notifyCount">Notify Count</option>
                </select>
              </div>
              <div className="col-md-2">
                <label>Order</label>
                <select 
                  className="form-control"
                  value={filters.sortOrder}
                  onChange={e => setFilters({...filters, sortOrder: e.target.value})}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply
                </button>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-success" onClick={bulkExport}>
                Bulk Export CSV
              </button>
            </div>
          </div>

          {/* Properties Table */}
          <div className="card">
            <div className="card-header">
              <h5>Properties ({meta.total || 0})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th><input type="checkbox" onChange={e => {
                      const checked = e.target.checked;
                      setPropsList(props => props.map(p => ({...p, selected: checked})));
                    }} /></th>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Notify Count</th>
                    <th>Unique Emails</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {propsList.map(p => (
                    <tr key={p._id}>
                      <td><input type="checkbox" checked={p.selected || false} onChange={e => {
                        setPropsList(props => props.map(prop => 
                          prop._id === p._id ? {...prop, selected: e.target.checked} : prop
                        ));
                      }} /></td>
                      <td>{p.name || 'Unnamed'}</td>
                      <td>{p.title || '-'}</td>
                      <td>{p.analytics?.views || 0}</td>
                      <td>{p.analytics?.notifyCount || 0}</td>
                      <td>{p.analytics?.notifyEmails?.length || 0}</td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => viewLogs(p._id)}>
                            View Logs
                          </button>
                          <button className="btn btn-outline-success" onClick={() => exportLogs(p._id)}>
                            Export
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div>
                Showing {((meta.page || 1) - 1) * (meta.limit || limit) + 1} to {Math.min((meta.page || 1) * (meta.limit || limit), meta.total || 0)} of {meta.total || 0} entries
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-secondary" 
                  disabled={page <= 1} 
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span className="btn btn-outline-secondary disabled">
                  Page {meta.page || 1} of {meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || limit))}
                </span>
                <button 
                  className="btn btn-outline-secondary" 
                  disabled={page >= (meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || limit)))} 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notify Logs Modal */}
      {selectedPropertyLogs && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Notify Logs - {selectedPropertyLogs.property.name || selectedPropertyLogs.property.title || 'Property'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPropertyLogs(null)}></button>
              </div>
              <div className="modal-body">
                {/* Log Filters */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <input 
                      className="form-control form-control-sm"
                      placeholder="Filter by email"
                      value={logFilters.email}
                      onChange={e => setLogFilters({...logFilters, email: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <input 
                      type="date"
                      className="form-control form-control-sm"
                      value={logFilters.startDate}
                      onChange={e => setLogFilters({...logFilters, startDate: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <input 
                      type="date"
                      className="form-control form-control-sm"
                      value={logFilters.endDate}
                      onChange={e => setLogFilters({...logFilters, endDate: e.target.value})}
                    />
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setLogFilters({...logFilters, page: 1});
                        viewLogs(selectedPropertyLogs.propertyId);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <h6>Unique Emails ({selectedPropertyLogs.property.notifyEmails?.length || 0})</h6>
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={() => exportLogs(selectedPropertyLogs.propertyId)}
                  >
                    Export CSV
                  </button>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    {selectedPropertyLogs.property.notifyEmails?.join(', ') || 'No emails'}
                  </small>
                </div>

                <h6>Recent Requests (Page {selectedPropertyLogs.meta?.page || 1})</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Date</th>
                        <th>User ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPropertyLogs.requests.map(r => (
                        <tr key={r._id}>
                          <td>{r.email}</td>
                          <td>{new Date(r.createdAt).toLocaleString()}</td>
                          <td>{r.user || 'Anonymous'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <div className="btn-group me-auto">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    disabled={logFilters.page <= 1}
                    onClick={() => {
                      const newPage = logFilters.page - 1;
                      setLogFilters({...logFilters, page: newPage});
                      viewLogs(selectedPropertyLogs.propertyId);
                    }}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    disabled={logFilters.page >= (selectedPropertyLogs.meta?.totalPages || 1)}
                    onClick={() => {
                      const newPage = logFilters.page + 1;
                      setLogFilters({...logFilters, page: newPage});
                      viewLogs(selectedPropertyLogs.propertyId);
                    }}
                  >
                    Next
                  </button>
                </div>
                <button className="btn btn-secondary" onClick={() => setSelectedPropertyLogs(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}