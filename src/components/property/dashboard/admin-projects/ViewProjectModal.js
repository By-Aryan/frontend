"use client";

const ViewProjectModal = ({ isOpen, project, onClose, onEdit }) => {
  if (!isOpen || !project) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'AED') => {
    if (!amount) return 'N/A';
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'planning': 'bg-warning text-dark',
      'under-construction': 'bg-info text-white',
      'completed': 'bg-success text-white',
      'on-hold': 'bg-secondary text-white',
      'cancelled': 'bg-danger text-white'
    };
    return `badge ${classes[status] || 'bg-secondary text-white'}`;
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Project Details: {project.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Main Image */}
              {project.images?.mainImage?.url && (
                <div className="col-12 mb-4">
                  <img
                    src={`${API_BASE_URL}/api/v1${project.images.mainImage.url}`}
                    alt={project.title}
                    className="img-fluid rounded"
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className="col-md-12 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Basic Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <strong>Title:</strong>
                        <p className="mb-1">{project.title}</p>
                      </div>
                      <div className="col-md-3 mb-3">
                        <strong>Category:</strong>
                        <p className="mb-1">
                          <span className="badge bg-light text-dark">
                            {project.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-3 mb-3">
                        <strong>Status:</strong>
                        <p className="mb-1">
                          <span className={getStatusBadgeClass(project.status)}>
                            {project.status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-12 mb-3">
                        <strong>Short Description:</strong>
                        <p className="mb-1">{project.shortDescription}</p>
                      </div>
                      <div className="col-md-12 mb-3">
                        <strong>Full Description:</strong>
                        <p className="mb-1 text-justify" style={{ whiteSpace: 'pre-wrap' }}>
                          {project.description}
                        </p>
                      </div>
                      <div className="col-md-4 mb-3">
                        <strong>Published:</strong>
                        <p className="mb-1">
                          <span className={`badge ${project.published ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {project.published ? 'Yes' : 'No'}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-4 mb-3">
                        <strong>Featured:</strong>
                        <p className="mb-1">
                          <span className={`badge ${project.featured ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {project.featured ? 'Yes' : 'No'}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-4 mb-3">
                        <strong>Views:</strong>
                        <p className="mb-1">{project.viewCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {project.location && (
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Location</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Country:</strong> {project.location.country || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>Emirate:</strong> {project.location.emirate || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>City:</strong> {project.location.city || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>Area:</strong> {project.location.area || 'N/A'}
                      </div>
                      {project.location.address && (
                        <div className="mb-2">
                          <strong>Address:</strong> {project.location.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details */}
              {project.projectDetails && (
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Project Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Developer:</strong> {project.projectDetails.developer || 'N/A'}
                      </div>
                      {project.projectDetails.architect && (
                        <div className="mb-2">
                          <strong>Architect:</strong> {project.projectDetails.architect}
                        </div>
                      )}
                      {project.projectDetails.startDate && (
                        <div className="mb-2">
                          <strong>Start Date:</strong> {formatDate(project.projectDetails.startDate)}
                        </div>
                      )}
                      {project.projectDetails.expectedCompletionDate && (
                        <div className="mb-2">
                          <strong>Expected Completion:</strong> {formatDate(project.projectDetails.expectedCompletionDate)}
                        </div>
                      )}
                      {project.projectDetails.totalUnits && (
                        <div className="mb-2">
                          <strong>Total Units:</strong> {project.projectDetails.totalUnits.toLocaleString()}
                        </div>
                      )}
                      {project.projectDetails.totalArea?.value && (
                        <div className="mb-2">
                          <strong>Total Area:</strong> {project.projectDetails.totalArea.value.toLocaleString()} {project.projectDetails.totalArea.unit}
                        </div>
                      )}
                      {project.projectDetails.floors && (
                        <div className="mb-2">
                          <strong>Floors:</strong> {project.projectDetails.floors}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Information */}
              {project.pricing && (
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Pricing</h6>
                    </div>
                    <div className="card-body">
                      {project.pricing.priceRange?.min && project.pricing.priceRange?.max && (
                        <div className="mb-2">
                          <strong>Price Range:</strong><br />
                          {formatCurrency(project.pricing.priceRange.min)} - {formatCurrency(project.pricing.priceRange.max)}
                        </div>
                      )}
                      {project.pricing.averagePricePerSqft?.value && (
                        <div className="mb-2">
                          <strong>Average Price per Sq Ft:</strong><br />
                          {formatCurrency(project.pricing.averagePricePerSqft.value)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {project.contactInfo && (
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Contact Information</h6>
                    </div>
                    <div className="card-body">
                      {project.contactInfo.salesOffice?.phone && (
                        <div className="mb-2">
                          <strong>Phone:</strong> {project.contactInfo.salesOffice.phone}
                        </div>
                      )}
                      {project.contactInfo.salesOffice?.email && (
                        <div className="mb-2">
                          <strong>Email:</strong> 
                          <a href={`mailto:${project.contactInfo.salesOffice.email}`} className="ms-1">
                            {project.contactInfo.salesOffice.email}
                          </a>
                        </div>
                      )}
                      {project.contactInfo.website && (
                        <div className="mb-2">
                          <strong>Website:</strong> 
                          <a href={project.contactInfo.website} target="_blank" rel="noopener noreferrer" className="ms-1">
                            {project.contactInfo.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Features & Amenities */}
              {(project.amenities?.length > 0 || project.features?.length > 0) && (
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Features & Amenities</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {project.amenities?.length > 0 && (
                          <div className="col-md-6 mb-3">
                            <strong>Amenities:</strong>
                            <div className="mt-2">
                              {project.amenities.map((amenity, index) => (
                                <span key={index} className="badge bg-primary me-1 mb-1">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.features?.length > 0 && (
                          <div className="col-md-6 mb-3">
                            <strong>Features:</strong>
                            <div className="mt-2">
                              {project.features.map((feature, index) => (
                                <span key={index} className="badge bg-success me-1 mb-1">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Images */}
              {project.images?.gallery?.length > 0 && (
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Gallery Images</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {project.images.gallery.map((image, index) => (
                          <div key={index} className="col-md-3 mb-3">
                            <img
                              src={`${API_BASE_URL}/api/v1${image.url}`}
                              alt={image.alt || `Gallery ${index + 1}`}
                              className="img-fluid rounded"
                              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <small className="text-muted d-block mt-1">
                              {image.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Floor Plans */}
              {project.images?.floorPlans?.length > 0 && (
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Floor Plans</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {project.images.floorPlans.map((plan, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <img
                              src={`${API_BASE_URL}${plan.url}`}
                              alt={plan.title || `Floor Plan ${index + 1}`}
                              className="img-fluid rounded"
                              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <div className="mt-2">
                              <strong>{plan.title || `Floor Plan ${index + 1}`}</strong>
                              {plan.bedrooms > 0 && (
                                <div><small>Bedrooms: {plan.bedrooms}</small></div>
                              )}
                              {plan.bathrooms > 0 && (
                                <div><small>Bathrooms: {plan.bathrooms}</small></div>
                              )}
                              {plan.area?.value > 0 && (
                                <div><small>Area: {plan.area.value} {plan.area.unit}</small></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Information */}
              {project.seoData && (
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">SEO Information</h6>
                    </div>
                    <div className="card-body">
                      {project.seoData.metaTitle && (
                        <div className="mb-2">
                          <strong>Meta Title:</strong> {project.seoData.metaTitle}
                        </div>
                      )}
                      {project.seoData.metaDescription && (
                        <div className="mb-2">
                          <strong>Meta Description:</strong> {project.seoData.metaDescription}
                        </div>
                      )}
                      {project.seoData.keywords?.length > 0 && (
                        <div className="mb-2">
                          <strong>Keywords:</strong>
                          <div className="mt-1">
                            {project.seoData.keywords.map((keyword, index) => (
                              <span key={index} className="badge bg-light text-dark me-1">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.seoData.slug && (
                        <div className="mb-2">
                          <strong>URL Slug:</strong> {project.seoData.slug}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="col-md-12 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Timestamps</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Created:</strong> {formatDate(project.createdAt)}
                        {project.createdBy && (
                          <div><small className="text-muted">by {project.createdBy.name || project.createdBy.email}</small></div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <strong>Last Modified:</strong> {formatDate(project.updatedAt)}
                        {project.lastModifiedBy && (
                          <div><small className="text-muted">by {project.lastModifiedBy.name || project.lastModifiedBy.email}</small></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={onEdit}>
              <i className="fas fa-edit me-2"></i>Edit Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectModal;