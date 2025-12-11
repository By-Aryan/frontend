"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import EnhancedNotifyMeButton from '@/components/property/EnhancedNotifyMeButton';

const ProjectDetailPage = () => {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/projects/public/${params.slug}`
        );

        if (response.data.success) {
          setProject(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'AED') => {
    if (!amount) return 'Price on Request';
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Get all images for gallery
  const getAllImages = () => {
    if (!project?.images) return [];
    
    const images = [];
    
    if (project.images.mainImage?.url) {
      images.push({
        url: project.images.mainImage.url,
        alt: project.images.mainImage.alt || project.title,
        category: 'main'
      });
    }
    
    if (project.images.gallery) {
      images.push(...project.images.gallery);
    }
    
    return images;
  };

  const allImages = getAllImages();

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <h3>Project Not Found</h3>
          <p className="text-muted">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/new-projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Header with Back Button */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-auto">
              <Link 
                href="/projects-by-country/uae" 
                className="back-button"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Projects
              </Link>
            </div>
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/" className="text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/projects-by-country/uae" className="text-decoration-none">New Projects</Link>
                  </li>
                  <li className="breadcrumb-item active">{project.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="row">
          {/* Left Column - Images */}
          <div className="col-lg-8">
            {/* Main Image Display */}
            <div className="card mb-4 border-0 shadow-sm creative-image-card">
              <div className="position-relative image-container" style={{ height: '500px' }}>
                {allImages.length > 0 && allImages[selectedImageIndex] ? (
                  <img
                    src={`${API_BASE_URL}${allImages[selectedImageIndex].url}`}
                    alt={allImages[selectedImageIndex].alt || project.title}
                    className="img-fluid w-100 h-100 main-project-image"
                    style={{ objectFit: 'cover', borderRadius: '20px' }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 placeholder-container rounded">
                    <div className="text-center">
                      <i className="fas fa-building fa-5x text-muted mb-3"></i>
                      <p className="text-muted">Project Image</p>
                    </div>
                  </div>
                )}
                
                {/* Creative Overlay */}
                <div className="image-overlay"></div>
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="position-absolute bottom-0 end-0 m-3">
                    <span className="badge bg-dark bg-opacity-75 px-3 py-2">
                      {selectedImageIndex + 1} of {allImages.length}
                    </span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
                      style={{ zIndex: 2 }}
                      onClick={() => setSelectedImageIndex(prev => 
                        prev > 0 ? prev - 1 : allImages.length - 1
                      )}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ zIndex: 2 }}
                      onClick={() => setSelectedImageIndex(prev => 
                        prev < allImages.length - 1 ? prev + 1 : 0
                      )}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex gap-2 flex-wrap">
                    {allImages.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border rounded ${
                          selectedImageIndex === index ? 'border-primary border-2' : 'border-light'
                        }`}
                        style={{ width: '80px', height: '60px' }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={`${API_BASE_URL}${image.url}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="img-fluid w-100 h-100 rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Project Details Tabs */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'amenities' ? 'active' : ''}`}
                      onClick={() => setActiveTab('amenities')}
                    >
                      Amenities
                    </button>
                  </li>
                  {project.images?.floorPlans?.length > 0 && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'floorplans' ? 'active' : ''}`}
                        onClick={() => setActiveTab('floorplans')}
                      >
                        Floor Plans
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="card-body">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h5>About {project.title}</h5>
                    <p style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {project.description}
                    </p>
                    
                    {project.projectDetails?.developer && (
                      <div className="mt-4">
                        <h6>Developer</h6>
                        <p className="mb-0">{project.projectDetails.developer}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Project Information</h6>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Category:</strong></td>
                            <td>{project.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                          </tr>
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>{project.status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                          </tr>
                          {project.projectDetails?.totalUnits && (
                            <tr>
                              <td><strong>Total Units:</strong></td>
                              <td>{project.projectDetails.totalUnits.toLocaleString()}</td>
                            </tr>
                          )}
                          {project.projectDetails?.floors && (
                            <tr>
                              <td><strong>Floors:</strong></td>
                              <td>{project.projectDetails.floors}</td>
                            </tr>
                          )}
                          {project.projectDetails?.totalArea?.value && (
                            <tr>
                              <td><strong>Total Area:</strong></td>
                              <td>{project.projectDetails.totalArea.value.toLocaleString()} {project.projectDetails.totalArea.unit}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="col-md-6">
                      <h6>Timeline</h6>
                      <table className="table table-borderless">
                        <tbody>
                          {project.projectDetails?.startDate && (
                            <tr>
                              <td><strong>Start Date:</strong></td>
                              <td>{formatDate(project.projectDetails.startDate)}</td>
                            </tr>
                          )}
                          {project.projectDetails?.expectedCompletionDate && (
                            <tr>
                              <td><strong>Expected Completion:</strong></td>
                              <td>{formatDate(project.projectDetails.expectedCompletionDate)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div>
                    {project.amenities?.length > 0 && (
                      <div className="mb-4">
                        <h6>Amenities</h6>
                        <div className="row">
                          {project.amenities.map((amenity, index) => (
                            <div key={index} className="col-md-6 col-lg-4 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-check text-success me-2"></i>
                                <span>{amenity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                  </div>
                )}

                {/* Floor Plans Tab */}
                {activeTab === 'floorplans' && project.images?.floorPlans?.length > 0 && (
                  <div className="row">
                    {project.images.floorPlans.map((plan, index) => (
                      <div key={index} className="col-md-6 mb-4">
                        <div className="card">
                          <img
                            src={`${API_BASE_URL}${plan.url}`}
                            alt={plan.title || `Floor Plan ${index + 1}`}
                            className="card-img-top"
                            style={{ height: '300px', objectFit: 'cover' }}
                          />
                          <div className="card-body">
                            <h6 className="card-title">{plan.title || `Floor Plan ${index + 1}`}</h6>
                            <div className="row">
                              {plan.bedrooms > 0 && (
                                <div className="col-4">
                                  <small className="text-muted">Bedrooms</small>
                                  <div className="fw-bold">{plan.bedrooms}</div>
                                </div>
                              )}
                              {plan.bathrooms > 0 && (
                                <div className="col-4">
                                  <small className="text-muted">Bathrooms</small>
                                  <div className="fw-bold">{plan.bathrooms}</div>
                                </div>
                              )}
                              {plan.area?.value > 0 && (
                                <div className="col-4">
                                  <small className="text-muted">Area</small>
                                  <div className="fw-bold">{plan.area.value} {plan.area.unit}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Project Summary */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Project Summary Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">{project.title}</h4>
                  
                  <div className="mb-3">
                    <small className="text-muted">by {project.projectDetails?.developer}</small>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      <span>{project.location?.area}, {project.location?.city}, {project.location?.emirate}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="pricing-card text-center">
                        <div className="pricing-badge">
                          <small className="text-muted d-block mb-1">Starting From</small>
                          <div className="h4 mb-0 pricing-amount">
                            {project.pricing?.priceRange?.min 
                              ? formatCurrency(project.pricing.priceRange.min)
                              : 'Price on Request'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Details */}
                  <div className="row mb-4">
                    <div className="col-6">
                      <div className="text-center">
                        <small className="text-uppercase text-muted d-block" style={{ fontSize: '0.7rem' }}>
                          HANDOVER
                        </small>
                        <div className="fw-bold">
                          {formatDate(project.projectDetails?.expectedCompletionDate).split(' ').slice(-1)[0] || 'TBA'}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <small className="text-uppercase text-muted d-block" style={{ fontSize: '0.7rem' }}>
                          CATEGORY
                        </small>
                        <div className="fw-bold">
                          {project.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <EnhancedNotifyMeButton
                      projectId={project._id}
                      className="btn btn-primary w-100"
                      variant="notify"
                      showViewButton={false}
                      onNotificationAdded={() => {
                        console.log('Notification added for project:', project._id);
                      }}
                    />
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-download me-2"></i>
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {project.contactInfo && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title">Contact Information</h6>
                    
                    {project.contactInfo.salesOffice?.phone && (
                      <div className="mb-2">
                        <i className="fas fa-phone text-primary me-2"></i>
                        <a href={`tel:${project.contactInfo.salesOffice.phone}`} className="text-decoration-none">
                          {project.contactInfo.salesOffice.phone}
                        </a>
                      </div>
                    )}
                    
                    {project.contactInfo.salesOffice?.email && (
                      <div className="mb-2">
                        <i className="fas fa-envelope text-primary me-2"></i>
                        <a href={`mailto:${project.contactInfo.salesOffice.email}`} className="text-decoration-none">
                          {project.contactInfo.salesOffice.email}
                        </a>
                      </div>
                    )}
                    
                    {project.contactInfo.website && (
                      <div className="mb-2">
                        <i className="fas fa-globe text-primary me-2"></i>
                        <a href={project.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

  {/* Custom Styles */}
  <style jsx>{`
        .project-detail-page {
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 50%, var(--color-bg-alt) 100%);
          min-height: 100vh;
          position: relative;
        }

        .project-detail-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 3%, transparent) 0%, color-mix(in srgb, var(--color-primary) 1%, transparent) 100%);
          z-index: -1;
        }

        .page-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(15, 131, 99, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
          color: var(--color-primary);
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
          box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 8%, transparent);
          position: relative;
          overflow: hidden;
        }

        .back-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: none;
        }

        /* Removed hover styles for .back-button */

        .breadcrumb {
          background: transparent;
          padding: 0;
          margin: 0;
        }

        .breadcrumb-item a {
          color: var(--color-primary);
          text-decoration: none;
        }

        .breadcrumb-item.active {
          color: #666666;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .sticky-top {
          position: sticky;
        }

        .card {
          border-radius: 20px;
          border: 1px solid color-mix(in srgb, var(--color-primary) 8%, transparent);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 8%, transparent);
          background: linear-gradient(145deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--color-primary), rgba(15, 131, 99, 0.3), var(--color-primary));
          opacity: 0;
          transition: none;
        }

        /* Removed hover styles for .card */

        .nav-tabs {
          border-bottom: none;
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          border-radius: 15px 15px 0 0;
          padding: 8px;
        }

        .nav-tabs .nav-link {
          border: none;
          color: #666666;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .nav-tabs .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: none;
        }

        /* Removed hover styles for .nav-tabs .nav-link */

        .nav-tabs .nav-link.active {
          color: white;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--color-primary) 0%, #0a6b52 100%);
          border: none;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 25px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(15, 131, 99, 0.3);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: none;
        }

        /* Removed hover styles for .btn-primary */

        .btn-outline-primary {
          color: var(--color-primary);
          border: 2px solid var(--color-primary);
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 25px;
          background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-outline-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(15, 131, 99, 0.1), transparent);
          transition: none;
        }

        /* Removed hover styles for .btn-outline-primary */

        .btn-outline-secondary {
          color: var(--color-muted);
          border: 2px solid var(--color-border);
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 25px;
          background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Removed hover styles for .btn-outline-secondary */

        .text-primary {
          color: var(--color-primary) !important;
        }

        .spinner-border.text-primary {
          color: var(--color-primary) !important;
        }

        .table td {
          padding: 8px 0;
          border: none;
        }

        .table td:first-child {
          width: 40%;
          color: var(--color-muted);
        }

        .badge.bg-dark {
          background: rgba(0, 0, 0, 0.7) !important;
        }

        .text-success {
          color: var(--color-success) !important;
        }

        .text-warning {
          color: var(--color-warning) !important;
        }

        .border-primary {
          border-color: var(--color-primary) !important;
        }

        .container {
          max-width: 1200px;
        }

        .creative-image-card {
          position: relative;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }

        .main-project-image {
          transition: none;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            color-mix(in srgb, var(--color-primary) 10%, transparent) 0%,
            transparent 30%,
            transparent 70%,
            color-mix(in srgb, var(--color-primary) 10%, transparent) 100%
          );
          opacity: 0;
          transition: none;
          pointer-events: none;
          border-radius: 20px;
        }

        /* Removed hover styles for creative image overlay */

        .placeholder-container {
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          border: 2px dashed color-mix(in srgb, var(--color-primary) 20%, transparent);
        }

        .pricing-card {
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          border: 2px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pricing-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            color-mix(in srgb, var(--color-primary) 5%, transparent) 50%,
            transparent 70%
          );
          transform: rotate(-45deg);
          transition: none;
        }

        /* Removed hover styles for .pricing-card */

        .pricing-badge {
          position: relative;
          z-index: 2;
        }

        .pricing-amount {
          color: var(--color-primary);
          font-weight: 800;
          text-shadow: 0 2px 6px color-mix(in srgb, var(--color-primary) 10%, transparent);
          font-size: 1.25rem;
        }

        /* Tweak pricing card spacing and visual balance */
        .pricing-card {
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
        }

        /* Placeholder image styling */
        .placeholder-container {
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
        }

        /* Right column card body adjustments to match theme */
        .sticky-top .card {
          border-radius: 16px;
          padding: 0;
          overflow: visible;
        }

        .sticky-top .card .card-body {
          padding: 18px;
        }

        /* Ensure action buttons stack nicely and full width where expected */
        .sticky-top .btn {
          width: 100%;
        }

        /* Subtle alert style for notification messages */
        .enhanced-alert {
          border-left: 4px solid color-mix(in srgb, var(--color-primary) 60%, transparent);
          background: color-mix(in srgb, var(--color-primary) 6%, white);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          margin-top: 8px;
        }

        .breadcrumb {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 8px 16px;
          border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
        }

        @media (max-width: 768px) {
          .page-header .row {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }

          .back-button {
            font-size: 0.85rem;
            padding: 6px 12px;
          }

          .sticky-top {
            position: static;
          }

          .card-body {
            padding: 1rem;
          }
        }
      `}</style>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  Request Call Back
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowInquiryModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <h6>Interested in {project.title}?</h6>
                  <p className="text-muted">
                    Our property experts will call you back within 24 hours to discuss this project.
                  </p>
                </div>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message (Optional)</label>
                    <textarea className="form-control" rows="3" placeholder="Any specific questions about the project?"></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowInquiryModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Handle form submission here
                    alert('Thank you! We will call you back within 24 hours.');
                    setShowInquiryModal(false);
                  }}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;