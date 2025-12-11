"use client";
import { useEffect, useState } from 'react';
import '../../styles/ads-dialog.css';

const AdsDialog = ({ 
  isOpen, 
  onClose, 
  mode = 'create', // 'create' or 'update'
  initialData = {},
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    redirect_url: '',
    start_date: '',
    end_date: '',
    status: '', // No default, force user selection
    placement: 'sidebar', // Default to sidebar
    image_url: '',
    imageFile: null // Store actual file for reference
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Populate form with initial data for update mode
  useEffect(() => {
    if (mode === 'update' && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        redirect_url: initialData.redirect_url || '',
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        status: initialData.status || '',
        placement: initialData.placement || 'sidebar', // Use sidebar as default if not provided
        image_url: initialData.image_url || '',
        imageFile: null // No file reference for existing data
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      handleReset();
    }
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Convert file to base64 string for preview only
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image_url: e.target.result, // This is for preview only
          imageFile: file // Store the actual file for API submission
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: '',
      imageFile: null // Clear file reference
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation (required, max 255 characters)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }
    
    // For CREATE mode - validate all fields
    if (mode === 'create') {
      // Description validation (optional, max 1000 characters)
      if (formData.description && formData.description.length > 1000) {
        newErrors.description = 'Description is too long (max 1000 characters)';
      }
      
      // Redirect URL validation (optional, but must be valid URL if provided)
      if (formData.redirect_url && formData.redirect_url.trim()) {
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(formData.redirect_url.trim())) {
          newErrors.redirect_url = 'Redirect URL must be valid';
        }
      }
      
      // Start date validation (required, must be ISO date)
      if (!formData.start_date) {
        newErrors.start_date = 'Start date is required';
      } else {
        const startDate = new Date(formData.start_date);
        if (isNaN(startDate.getTime())) {
          newErrors.start_date = 'Start date must be a valid date';
        }
      }
      
      // End date validation (required, must be ISO date, must be after start date)
      if (!formData.end_date) {
        newErrors.end_date = 'End date is required';
      } else {
        const endDate = new Date(formData.end_date);
        if (isNaN(endDate.getTime())) {
          newErrors.end_date = 'End date must be a valid date';
        } else if (formData.start_date && endDate < new Date(formData.start_date)) {
          newErrors.end_date = 'End date must be after start date';
        }
      }
      
      // Placement validation removed - we're defaulting to 'sidebar'
      
      // Image validation (required for create mode)
      if (!formData.imageFile) {
        newErrors.image_url = 'Image upload failed or no image provided';
      }
    }
    
    // Status validation (required for both create and update)
    if (!formData.status) {
      newErrors.status = 'Status is required';
    } else if (mode === 'create' && !['Active', 'Inactive'].includes(formData.status)) {
      newErrors.status = 'Status must be either Active or Inactive';
    } else if (mode === 'update' && !['Active', 'Inactive', 'Expired'].includes(formData.status)) {
      newErrors.status = 'Status must be Active, Inactive, or Expired';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error submitting ads:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      redirect_url: '',
      start_date: '',
      end_date: '',
      status: '', // No default, force user selection
      placement: 'sidebar', // Default to sidebar
      image_url: '',
      imageFile: null // Reset file reference
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="ads-dialog">
      <div className="modal-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="modal-content bg-white" style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          position: 'relative',
          zIndex: 999999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
        {/* Modal Header */}
        <div className="modal-header px-4 py-3 border-bottom" style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          zIndex: 1001,
          flexShrink: 0
        }}>
          <h5 className="modal-title mb-0" style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            color: 'var(--color-headings)'
          }}>
            {mode === 'create' ? 'Create Advertisement' : 'Update Advertisement'}
          </h5>
          <button 
            type="button"
            onClick={handleClose}
            className="btn-close ms-auto"
            style={{ 
              fontSize: '34px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4" style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {mode === 'update' && (
            <div className="alert alert-warning mb-4" style={{
              fontSize: '14px',
              backgroundColor: '#fefce8',
              borderColor: '#facc15',
              color: '#a16207'
            }}>
              <i className="fas fa-exclamation-triangle me-2" />
              <strong>Update Mode:</strong> Only the title and status can be updated. Other fields are shown for reference only.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="form-style1">
            <div className="row">
              {/* Title */}
              <div className="col-12 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Title <span style={{ color: 'var(--color-danger)' }}>*</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>(Max 255 characters)</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter advertisement title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength="255"
                  style={{
                    borderColor: errors.title ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px'
                  }}
                />
                <div className="d-flex justify-content-between">
                  {errors.title && (
                    <div className="invalid-feedback d-block" style={{ 
                      color: 'var(--color-danger)', 
                      fontSize: '12px',
                      marginTop: '4px'
                    }}>
                      {errors.title}
                    </div>
                  )}
                  <small className="text-muted ms-auto" style={{ fontSize: '11px', marginTop: '4px' }}>
                    {formData.title.length}/255 characters
                  </small>
                </div>
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Description <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                    {mode === 'update' ? '(Read-only in update mode)' : '(Optional, max 1000 characters)'}
                  </span>
                </label>
                <textarea
                  name="description"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  placeholder="Enter advertisement description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="1000"
                  disabled={mode === 'update'}
                  style={{
                    borderColor: errors.description ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    resize: 'vertical',
                    backgroundColor: mode === 'update' ? '#f9fafb' : 'white',
                    color: mode === 'update' ? '#6b7280' : 'inherit'
                  }}
                />
                {mode === 'create' && (
                  <div className="d-flex justify-content-between">
                    {errors.description && (
                      <div className="invalid-feedback d-block" style={{ 
                        color: 'var(--color-danger)', 
                        fontSize: '12px',
                        marginTop: '4px'
                      }}>
                        {errors.description}
                      </div>
                    )}
                    <small className="text-muted ms-auto" style={{ fontSize: '11px', marginTop: '4px' }}>
                      {formData.description.length}/1000 characters
                    </small>
                  </div>
                )}
              </div>

              {/* Redirect URL */}
              <div className="col-12 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Redirect URL <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                    {mode === 'update' ? '(Read-only in update mode)' : '(Optional)'}
                  </span>
                </label>
                <input
                  type="url"
                  name="redirect_url"
                  className={`form-control ${errors.redirect_url ? 'is-invalid' : ''}`}
                  placeholder="https://example.com"
                  value={formData.redirect_url}
                  onChange={handleInputChange}
                  disabled={mode === 'update'}
                  style={{
                    borderColor: errors.redirect_url ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    backgroundColor: mode === 'update' ? '#f9fafb' : 'white',
                    color: mode === 'update' ? '#6b7280' : 'inherit'
                  }}
                />
                {mode === 'create' && errors.redirect_url && (
                  <div className="invalid-feedback d-block" style={{ 
                    color: 'var(--color-danger)', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.redirect_url}
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Start Date <span style={{ color: mode === 'update' ? 'var(--color-muted)' : 'var(--color-danger)' }}>
                    {mode === 'update' ? '(Read-only)' : '*'}
                  </span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                  value={formData.start_date}
                  onChange={handleInputChange}
                  disabled={mode === 'update'}
                  style={{
                    borderColor: errors.start_date ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    backgroundColor: mode === 'update' ? '#f9fafb' : 'white',
                    color: mode === 'update' ? '#6b7280' : 'inherit'
                  }}
                />
                {mode === 'create' && errors.start_date && (
                  <div className="invalid-feedback d-block" style={{ 
                    color: 'var(--color-danger)', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.start_date}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  End Date <span style={{ color: mode === 'update' ? 'var(--color-muted)' : 'var(--color-danger)' }}>
                    {mode === 'update' ? '(Read-only)' : '*'}
                  </span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                  value={formData.end_date}
                  onChange={handleInputChange}
                  disabled={mode === 'update'}
                  style={{
                    borderColor: errors.end_date ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    backgroundColor: mode === 'update' ? '#f9fafb' : 'white',
                    color: mode === 'update' ? '#6b7280' : 'inherit'
                  }}
                />
                {mode === 'create' && errors.end_date && (
                  <div className="invalid-feedback d-block" style={{ 
                    color: 'var(--color-danger)', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.end_date}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Status <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <select
                  name="status"
                  className={`form-control form-select ${errors.status ? 'is-invalid' : ''}`}
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    borderColor: errors.status ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  {mode === 'update' && <option value="Expired">Expired</option>}
                </select>
                {errors.status && (
                  <div className="invalid-feedback d-block" style={{ 
                    color: 'var(--color-danger)', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.status}
                  </div>
                )}
              </div>

              {/* Placement - commented out and defaulting to 'sidebar' */}
              {/* 
              <div className="col-md-6 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Placement <span style={{ color: mode === 'update' ? 'var(--color-muted)' : 'var(--color-danger)' }}>
                    {mode === 'update' ? '(Read-only)' : '*'}
                  </span>
                </label>
                <select
                  name="placement"
                  className={`form-control form-select ${errors.placement ? 'is-invalid' : ''}`}
                  value={formData.placement}
                  onChange={handleInputChange}
                  disabled={mode === 'update'}
                  style={{
                    borderColor: errors.placement ? 'var(--color-danger)' : '#e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    backgroundColor: mode === 'update' ? '#f9fafb' : 'white',
                    color: mode === 'update' ? '#6b7280' : 'inherit'
                  }}
                >
                  <option value="">Select Placement</option>
                  <option value="homepage-banner">Homepage Banner</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                  <option value="property-listing">Property Listing</option>
                </select>
                {mode === 'create' && errors.placement && (
                  <div className="invalid-feedback d-block" style={{ 
                    color: 'var(--color-danger)', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.placement}
                  </div>
                )}
              </div>
              */}

              {/* Image Upload */}
              <div className="col-12 mb-3">
                <label className="form-label fw600" style={{ color: 'var(--color-headings)' }}>
                  Advertisement Image <span style={{ color: mode === 'update' ? 'var(--color-muted)' : 'var(--color-danger)' }}>
                    {mode === 'update' ? '(Cannot be updated)' : '*'}
                  </span>
                </label>
                {mode === 'create' ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`form-control ${errors.image_url ? 'is-invalid' : ''}`}
                      style={{
                        borderColor: errors.image_url ? 'var(--color-danger)' : '#e5e7eb',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px'
                      }}
                    />
                    {errors.image_url && (
                      <div className="invalid-feedback d-block" style={{ 
                        color: 'var(--color-danger)', 
                        fontSize: '12px',
                        marginTop: '4px'
                      }}>
                        {errors.image_url}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="alert alert-info" style={{ 
                    fontSize: '14px',
                    backgroundColor: '#f0f9ff',
                    borderColor: '#0ea5e9',
                    color: '#0369a1'
                  }}>
                    <i className="fas fa-info-circle me-2" />
                    Image cannot be updated through this form. Contact administrator if image needs to be changed.
                  </div>
                )}
                
                {/* Image Preview */}
                {formData.image_url && (
                  <div className="mt-3">
                    <p className="mb-2" style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                      Selected Image:
                    </p>
                    <div className="d-flex justify-content-start">
                      <div className="position-relative" style={{ maxWidth: '200px' }}>
                        <img 
                          src={formData.image_url} 
                          alt="Advertisement Preview"
                          className="img-fluid rounded"
                          style={{ 
                            width: '100%', 
                            height: '120px', 
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb'
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="btn btn-danger btn-sm position-absolute"
                          style={{
                            top: '8px',
                            right: '8px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            padding: '0',
                            fontSize: '14px',
                            lineHeight: '1'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer px-4 py-3 border-top d-flex justify-content-end gap-3" style={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          zIndex: 1001,
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
            style={{
              borderColor: '#e5e7eb',
              color: 'var(--color-muted)',
              fontWeight: '500',
              fontSize: '14px',
              padding: '10px 24px',
              borderRadius: '8px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="ud-btn btn-thm"
            style={{
              fontSize: '14px',
              fontWeight: '600',
              padding: '10px 32px',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isSubmitting ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                  style={{ width: '16px', height: '16px' }}
                />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                {mode === 'create' ? 'Create Ad' : 'Update Ad'} 
                <i className="fal fa-arrow-right-long ms-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdsDialog;