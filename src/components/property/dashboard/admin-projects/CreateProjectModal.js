"use client";
import { useState } from 'react';
import axios from 'axios';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'residential',
    status: 'planning',
    
    // Location
    'location.country': 'UAE',
    'location.emirate': '',
    'location.city': '',
    'location.area': '',
    'location.address': '',
    'location.coordinates.latitude': '',
    'location.coordinates.longitude': '',

    // Project Details
    'projectDetails.developer': '',
    'projectDetails.architect': '',
    'projectDetails.contractor': '',
    'projectDetails.startDate': '',
    'projectDetails.expectedCompletionDate': '',
    'projectDetails.totalUnits': '',
    'projectDetails.totalArea.value': '',
    'projectDetails.totalArea.unit': 'sqft',
    'projectDetails.floors': '',
    'projectDetails.parkingSpaces': '',

    // Pricing
    'pricing.priceRange.min': '',
    'pricing.priceRange.max': '',
    'pricing.priceRange.currency': 'AED',
    'pricing.averagePricePerSqft.value': '',
    'pricing.averagePricePerSqft.currency': 'AED',

    // Features and Amenities
    amenities: '',
    features: '',

    // Contact Info
    'contactInfo.salesOffice.phone': '',
    'contactInfo.salesOffice.email': '',
    'contactInfo.salesOffice.address': '',
    'contactInfo.website': '',

    // Status flags
    featured: false,
    published: false
  });

  const [files, setFiles] = useState({
    mainImage: null,
    gallery: [],
    floorPlans: [],
    documents: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData['location.emirate'].trim()) newErrors['location.emirate'] = 'Emirate is required';
    if (!formData['location.city'].trim()) newErrors['location.city'] = 'City is required';
    if (!formData['location.area'].trim()) newErrors['location.area'] = 'Area is required';
    if (!formData['projectDetails.developer'].trim()) newErrors['projectDetails.developer'] = 'Developer is required';

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
      if (projectData.features) {
        projectData.features = projectData.features.split(',').map(item => item.trim()).filter(Boolean);
      }

      // Append project data
      formDataToSend.append('projectData', JSON.stringify(projectData));

      // Append files
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

      const response = await axios.post(
        `${API_BASE_URL}/admin/projects`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Reset form data
        setFormData({
          title: '',
          shortDescription: '',
          description: '',
          category: 'residential',
          status: 'planning',
          'location.country': 'UAE',
          'location.emirate': '',
          'location.city': '',
          'location.area': '',
          'location.address': '',
          'location.coordinates.latitude': '',
          'location.coordinates.longitude': '',
          'projectDetails.developer': '',
          'projectDetails.architect': '',
          'projectDetails.contractor': '',
          'projectDetails.startDate': '',
          'projectDetails.expectedCompletionDate': '',
          'projectDetails.totalUnits': '',
          'projectDetails.totalArea.value': '',
          'projectDetails.totalArea.unit': 'sqft',
          'projectDetails.floors': '',
          'projectDetails.parkingSpaces': '',
          'pricing.priceRange.min': '',
          'pricing.priceRange.max': '',
          'pricing.priceRange.currency': 'AED',
          'pricing.averagePricePerSqft.value': '',
          'pricing.averagePricePerSqft.currency': 'AED',
          amenities: '',
          features: '',
          'contactInfo.salesOffice.phone': '',
          'contactInfo.salesOffice.email': '',
          'contactInfo.salesOffice.address': '',
          'contactInfo.website': '',
          featured: false,
          published: false
        });
        setFiles({
          mainImage: null,
          gallery: [],
          floorPlans: [],
          documents: []
        });
        setCurrentStep(1);
        setErrors({});
        
        // Call success callback to refresh parent component
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: error.response?.data?.message || error.message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Project</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Step indicator */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="progress" style={{ height: '3px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className={currentStep >= 1 ? 'text-primary fw-bold' : 'text-muted'}>Basic Info</small>
                  <small className={currentStep >= 2 ? 'text-primary fw-bold' : 'text-muted'}>Location & Details</small>
                  <small className={currentStep >= 3 ? 'text-primary fw-bold' : 'text-muted'}>Pricing & Features</small>
                  <small className={currentStep >= 4 ? 'text-primary fw-bold' : 'text-muted'}>Images</small>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h6 className="mb-3">Basic Project Information</h6>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Project Title *</label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={formData.title}
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
                        value={formData.category}
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
                        value={formData.status}
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
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Brief description (max 200 characters)"
                        maxLength="200"
                      />
                      <small className="form-text text-muted">
                        {formData.shortDescription.length}/200 characters
                      </small>
                      {errors.shortDescription && <div className="invalid-feedback">{errors.shortDescription}</div>}
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Full Description *</label>
                      <textarea
                        name="description"
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows="6"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Detailed project description"
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Project Details */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h6 className="mb-3">Location & Project Details</h6>
                  <div className="row">
                    {/* Location */}
                    <div className="col-md-12 mb-4">
                      <h6>Location Information</h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Emirate *</label>
                          <select
                            name="location.emirate"
                            className={`form-select ${errors['location.emirate'] ? 'is-invalid' : ''}`}
                            value={formData['location.emirate']}
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
                            value={formData['location.city']}
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
                            value={formData['location.area']}
                            onChange={handleInputChange}
                            placeholder="Enter area/district"
                          />
                          {errors['location.area'] && <div className="invalid-feedback">{errors['location.area']}</div>}
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            name="location.address"
                            className="form-control"
                            value={formData['location.address']}
                            onChange={handleInputChange}
                            placeholder="Full address (optional)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="col-md-12">
                      <h6>Project Details</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Developer *</label>
                          <input
                            type="text"
                            name="projectDetails.developer"
                            className={`form-control ${errors['projectDetails.developer'] ? 'is-invalid' : ''}`}
                            value={formData['projectDetails.developer']}
                            onChange={handleInputChange}
                            placeholder="Developer name"
                          />
                          {errors['projectDetails.developer'] && <div className="invalid-feedback">{errors['projectDetails.developer']}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Architect</label>
                          <input
                            type="text"
                            name="projectDetails.architect"
                            className="form-control"
                            value={formData['projectDetails.architect']}
                            onChange={handleInputChange}
                            placeholder="Architect name"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            name="projectDetails.startDate"
                            className="form-control"
                            value={formData['projectDetails.startDate']}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expected Completion</label>
                          <input
                            type="date"
                            name="projectDetails.expectedCompletionDate"
                            className="form-control"
                            value={formData['projectDetails.expectedCompletionDate']}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Total Units</label>
                          <input
                            type="number"
                            name="projectDetails.totalUnits"
                            className="form-control"
                            value={formData['projectDetails.totalUnits']}
                            onChange={handleInputChange}
                            placeholder="Number of units"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Total Area</label>
                          <input
                            type="number"
                            name="projectDetails.totalArea.value"
                            className="form-control"
                            value={formData['projectDetails.totalArea.value']}
                            onChange={handleInputChange}
                            placeholder="Total area"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Floors</label>
                          <input
                            type="number"
                            name="projectDetails.floors"
                            className="form-control"
                            value={formData['projectDetails.floors']}
                            onChange={handleInputChange}
                            placeholder="Number of floors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing & Features */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h6 className="mb-3">Pricing & Features</h6>
                  <div className="row">
                    {/* Pricing */}
                    <div className="col-md-12 mb-4">
                      <h6>Pricing Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Minimum Price (AED)</label>
                          <input
                            type="number"
                            name="pricing.priceRange.min"
                            className="form-control"
                            value={formData['pricing.priceRange.min']}
                            onChange={handleInputChange}
                            placeholder="Minimum price"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Maximum Price (AED)</label>
                          <input
                            type="number"
                            name="pricing.priceRange.max"
                            className="form-control"
                            value={formData['pricing.priceRange.max']}
                            onChange={handleInputChange}
                            placeholder="Maximum price"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Average Price per Sq Ft (AED)</label>
                          <input
                            type="number"
                            name="pricing.averagePricePerSqft.value"
                            className="form-control"
                            value={formData['pricing.averagePricePerSqft.value']}
                            onChange={handleInputChange}
                            placeholder="Price per sq ft"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features & Amenities */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Amenities</label>
                      <textarea
                        name="amenities"
                        className="form-control"
                        rows="4"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        placeholder="Enter amenities separated by commas (e.g., Swimming Pool, Gym, Parking)"
                      />
                      <small className="form-text text-muted">Separate multiple amenities with commas</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Features</label>
                      <textarea
                        name="features"
                        className="form-control"
                        rows="4"
                        value={formData.features}
                        onChange={handleInputChange}
                        placeholder="Enter features separated by commas (e.g., Smart Home, Balcony, Sea View)"
                      />
                      <small className="form-text text-muted">Separate multiple features with commas</small>
                    </div>

                    {/* Contact Information */}
                    <div className="col-md-12">
                      <h6>Contact Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Sales Office Phone</label>
                          <input
                            type="text"
                            name="contactInfo.salesOffice.phone"
                            className="form-control"
                            value={formData['contactInfo.salesOffice.phone']}
                            onChange={handleInputChange}
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Sales Office Email</label>
                          <input
                            type="email"
                            name="contactInfo.salesOffice.email"
                            className="form-control"
                            value={formData['contactInfo.salesOffice.email']}
                            onChange={handleInputChange}
                            placeholder="Email address"
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Website</label>
                          <input
                            type="url"
                            name="contactInfo.website"
                            className="form-control"
                            value={formData['contactInfo.website']}
                            onChange={handleInputChange}
                            placeholder="Project website URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Images & SEO */}
              {currentStep === 4 && (
                <div className="step-content">
                  <h6 className="mb-3">Images</h6>
                  <div className="row">
                    {/* File Uploads */}
                    <div className="col-md-12 mb-4">
                      <h6>Images & Documents</h6>
                      
                      {/* Main Image */}
                      <div className="mb-3">
                        <label className="form-label">Main Image</label>
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
                        <label className="form-label">Gallery Images</label>
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

                      {/* Floor Plans */}
                      <div className="mb-3">
                        <label className="form-label">Floor Plans</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*,.pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, 'floorPlans')}
                        />
                        {files.floorPlans.length > 0 && (
                          <div className="mt-2">
                            <small className="text-success">Selected {files.floorPlans.length} files</small>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => setFiles(prev => ({ ...prev, floorPlans: [] }))}
                            >
                              Clear All
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Flags */}
                    <div className="col-md-12">
                      <h6>Project Status</h6>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Featured Project</label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Publish Immediately</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                {currentStep > 1 && (
                  <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                    <i className="fas fa-arrow-left me-2"></i>Previous
                  </button>
                )}
              </div>
              <div>
                {currentStep < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next<i className="fas fa-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <div>
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
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
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>Create Project
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;