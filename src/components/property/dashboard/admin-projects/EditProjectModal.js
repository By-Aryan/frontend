"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditProjectModal = ({ isOpen, project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({
    mainImage: null,
    gallery: [],
    floorPlans: [],
    documents: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5000';

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        description: project.description || '',
        category: project.category || 'residential',
        status: project.status || 'planning',
        
        // Location - flattened structure for form handling
        'location.country': project.location?.country || 'UAE',
        'location.emirate': project.location?.emirate || '',
        'location.city': project.location?.city || '',
        'location.area': project.location?.area || '',
        'location.address': project.location?.address || '',
        'location.coordinates.latitude': project.location?.coordinates?.latitude || '',
        'location.coordinates.longitude': project.location?.coordinates?.longitude || '',

        // Project Details
        'projectDetails.developer': project.projectDetails?.developer || '',
        'projectDetails.architect': project.projectDetails?.architect || '',
        'projectDetails.contractor': project.projectDetails?.contractor || '',
        'projectDetails.startDate': project.projectDetails?.startDate ? project.projectDetails.startDate.split('T')[0] : '',
        'projectDetails.expectedCompletionDate': project.projectDetails?.expectedCompletionDate ? project.projectDetails.expectedCompletionDate.split('T')[0] : '',
        'projectDetails.totalUnits': project.projectDetails?.totalUnits || '',
        'projectDetails.totalArea.value': project.projectDetails?.totalArea?.value || '',
        'projectDetails.totalArea.unit': project.projectDetails?.totalArea?.unit || 'sqft',
        'projectDetails.floors': project.projectDetails?.floors || '',
        'projectDetails.parkingSpaces': project.projectDetails?.parkingSpaces || '',

        // Pricing
        'pricing.priceRange.min': project.pricing?.priceRange?.min || '',
        'pricing.priceRange.max': project.pricing?.priceRange?.max || '',
        'pricing.priceRange.currency': project.pricing?.priceRange?.currency || 'AED',
        'pricing.averagePricePerSqft.value': project.pricing?.averagePricePerSqft?.value || '',
        'pricing.averagePricePerSqft.currency': project.pricing?.averagePricePerSqft?.currency || 'AED',

        // Features and Amenities - convert arrays to comma-separated strings
        amenities: Array.isArray(project.amenities) ? project.amenities.join(', ') : '',

        // Contact Info
        'contactInfo.salesOffice.phone': project.contactInfo?.salesOffice?.phone || '',
        'contactInfo.salesOffice.email': project.contactInfo?.salesOffice?.email || '',
        'contactInfo.salesOffice.address': project.contactInfo?.salesOffice?.address || '',
        'contactInfo.website': project.contactInfo?.website || '',

        // SEO
        'seoData.metaTitle': project.seoData?.metaTitle || '',
        'seoData.metaDescription': project.seoData?.metaDescription || '',
        'seoData.keywords': Array.isArray(project.seoData?.keywords) ? project.seoData.keywords.join(', ') : '',

        // Status flags
        featured: project.featured || false,
        published: project.published || false
      });
    }
  }, [project]);

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    return null;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Log status changes
    if (name === 'status') {
      console.log('🔄 Status changed from', formData.status, 'to', newValue);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => ({
      ...prev,
      [fileType]: fileType === 'mainImage' ? selectedFiles[0] : [...(prev[fileType] || []), ...selectedFiles]
    }));
  };

  // Remove file
  const removeFile = (fileType, index = null) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: fileType === 'mainImage' ? null : prev[fileType].filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData['location.emirate']?.trim()) newErrors['location.emirate'] = 'Emirate is required';
    if (!formData['location.city']?.trim()) newErrors['location.city'] = 'City is required';
    if (!formData['location.area']?.trim()) newErrors['location.area'] = 'Area is required';
    if (!formData['projectDetails.developer']?.trim()) newErrors['projectDetails.developer'] = 'Developer is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Convert nested object notation to actual nested object
      const projectData = {};
      Object.keys(formData).forEach(key => {
        if (key.includes('.')) {
          const keys = key.split('.');
          let current = projectData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = formData[key];
        } else {
          projectData[key] = formData[key];
        }
      });

      // Convert comma-separated strings to arrays
      if (projectData.amenities) {
        projectData.amenities = projectData.amenities.split(',').map(item => item.trim()).filter(Boolean);
      }
      if (projectData.seoData?.keywords) {
        projectData.seoData.keywords = projectData.seoData.keywords.split(',').map(item => item.trim()).filter(Boolean);
      }

      // Ensure status is properly included
      console.log('📤 Sending project update with status:', projectData.status);

      // Append project data
      formDataToSend.append('projectData', JSON.stringify(projectData));

      // Append files if any are selected
      if (files.mainImage) {
        formDataToSend.append('mainImage', files.mainImage);
      }
      files.gallery.forEach(file => {
        formDataToSend.append('gallery', file);
      });
      files.floorPlans.forEach(file => {
        formDataToSend.append('floorPlans', file);
      });
      files.documents.forEach(file => {
        formDataToSend.append('documents', file);
      });

      const response = await axios.put(
        `${API_BASE_URL}/admin/projects/${project._id}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        console.log('✅ Project updated successfully:', response.data.data);
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setErrors({ submit: error.response?.data?.message || error.message || 'Failed to update project' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Project: {project.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Basic Information</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Project Title *</label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        placeholder="Enter project title"
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={formData.category || 'residential'}
                        onChange={handleInputChange}
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed-use">Mixed Use</option>
                        <option value="industrial">Industrial</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="retail">Retail</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status *</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status || 'planning'}
                        onChange={handleInputChange}
                      >
                        <option value="planning">Planning</option>
                        <option value="under-construction">Under Construction</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Short Description *</label>
                      <textarea
                        name="shortDescription"
                        className={`form-control ${errors.shortDescription ? 'is-invalid' : ''}`}
                        rows="2"
                        value={formData.shortDescription || ''}
                        onChange={handleInputChange}
                        placeholder="Brief description (max 200 characters)"
                        maxLength="200"
                      />
                      <small className="form-text text-muted">
                        {(formData.shortDescription || '').length}/200 characters
                      </small>
                      {errors.shortDescription && <div className="invalid-feedback">{errors.shortDescription}</div>}
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Full Description *</label>
                      <textarea
                        name="description"
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows="6"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        placeholder="Detailed project description"
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="featured"
                          checked={formData.featured || false}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Featured Project</label>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="published"
                          checked={formData.published || false}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Published</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick form for key fields - keeping it shorter than create form */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Location & Project Details</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Emirate *</label>
                      <select
                        name="location.emirate"
                        className={`form-select ${errors['location.emirate'] ? 'is-invalid' : ''}`}
                        value={formData['location.emirate'] || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Emirate</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Umm Al Quwain">Umm Al Quwain</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                        <option value="Fujairah">Fujairah</option>
                      </select>
                      {errors['location.emirate'] && <div className="invalid-feedback">{errors['location.emirate']}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="location.city"
                        className={`form-control ${errors['location.city'] ? 'is-invalid' : ''}`}
                        value={formData['location.city'] || ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                      {errors['location.city'] && <div className="invalid-feedback">{errors['location.city']}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Area *</label>
                      <input
                        type="text"
                        name="location.area"
                        className={`form-control ${errors['location.area'] ? 'is-invalid' : ''}`}
                        value={formData['location.area'] || ''}
                        onChange={handleInputChange}
                        placeholder="Enter area/district"
                      />
                      {errors['location.area'] && <div className="invalid-feedback">{errors['location.area']}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Developer *</label>
                      <input
                        type="text"
                        name="projectDetails.developer"
                        className={`form-control ${errors['projectDetails.developer'] ? 'is-invalid' : ''}`}
                        value={formData['projectDetails.developer'] || ''}
                        onChange={handleInputChange}
                        placeholder="Developer name"
                      />
                      {errors['projectDetails.developer'] && <div className="invalid-feedback">{errors['projectDetails.developer']}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expected Completion</label>
                      <input
                        type="date"
                        name="projectDetails.expectedCompletionDate"
                        className="form-control"
                        value={formData['projectDetails.expectedCompletionDate'] || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Min Price (AED)</label>
                      <input
                        type="number"
                        name="pricing.priceRange.min"
                        className="form-control"
                        value={formData['pricing.priceRange.min'] || ''}
                        onChange={handleInputChange}
                        placeholder="Minimum price"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Max Price (AED)</label>
                      <input
                        type="number"
                        name="pricing.priceRange.max"
                        className="form-control"
                        value={formData['pricing.priceRange.max'] || ''}
                        onChange={handleInputChange}
                        placeholder="Maximum price"
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Amenities</label>
                      <textarea
                        name="amenities"
                        className="form-control"
                        rows="3"
                        value={formData.amenities || ''}
                        onChange={handleInputChange}
                        placeholder="Enter amenities separated by commas"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Upload New Images (Optional)</h6>
                </div>
                <div className="card-body">
                  {/* Main Image */}
                  <div className="mb-3">
                    <label className="form-label">New Main Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'mainImage')}
                    />
                    {files.mainImage && (
                      <div className="mt-2">
                        <small className="text-success">Selected: {files.mainImage.name}</small>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => removeFile('mainImage')}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Gallery Images */}
                  <div className="mb-3">
                    <label className="form-label">Additional Gallery Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, 'gallery')}
                    />
                    {files.gallery.length > 0 && (
                      <div className="mt-2">
                        <small className="text-success">Selected {files.gallery.length} files</small>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => setFiles(prev => ({ ...prev, gallery: [] }))}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Update Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;