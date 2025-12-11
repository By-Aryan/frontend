"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';
import DashboardHeader from '@/components/common/DashboardHeader';
import MobileMenu from '@/components/common/mobile-menu';
import EnhancedNotifyMeButton from '@/components/property/EnhancedNotifyMeButton';

const NewProjectsPage = () => {
  const { auth, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    emirate: '',
    category: '',
    status: '',
    sortBy: 'newest'
  });
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

  // Initialize favorites from projects data
  useEffect(() => {
    if (projects && projects.length > 0) {
      const initialFavorites = {};
      projects.forEach((project) => {
        initialFavorites[project._id] = !!project.is_favourite;
      });
      setFavorites(initialFavorites);
    }
  }, [projects]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('User not logged in');
        return;
      }

      if (favorites[projectId]) {
        // Remove from favorites
        const response = await axios.delete(
          `${API_BASE_URL}/property/favourite/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { property_id: projectId }
          }
        );
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [projectId]: false,
          }));
        }
      } else {
        // Add to favorites
        const response = await axios.post(
          `${API_BASE_URL}/property/favourite`,
          { property_id: projectId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [projectId]: true,
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Fetch projects
  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);

      // Map UI sort to backend fields
      let sortByField = 'createdAt';
      let sortOrder = 'desc';
      if (filters.sortBy === 'name') {
        sortByField = 'title';
        sortOrder = 'asc';
      } else if (filters.sortBy === 'price-low') {
        sortByField = 'pricing.priceRange.min';
        sortOrder = 'asc';
      } else if (filters.sortBy === 'price-high') {
        sortByField = 'pricing.priceRange.min';
        sortOrder = 'desc';
      }

      // Map status to backend enum values
      const statusMap = {
        upcoming: 'planning',
        'under_construction': 'under-construction',
        ready_to_move: 'completed',
        completed: 'completed',
        cancelled: 'cancelled',
        on_hold: 'on-hold',
      };
      const mappedStatus = filters.status && statusMap[filters.status] ? statusMap[filters.status] : filters.status;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy: sortByField,
        sortOrder,
      });

      if (filters.emirate) queryParams.set('emirate', filters.emirate);
      if (filters.category) queryParams.set('category', filters.category);
      if (mappedStatus) queryParams.set('status', mappedStatus);

      const response = await axios.get(
        `${API_BASE_URL}/projects/public?${queryParams}`
      );

      if (response.data.success) {
        setProjects(response.data.data.projects);
        setTotalProjects(response.data.data.pagination?.totalProjects || 0);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Format currency
  const formatCurrency = (amount, currency = 'AED') => {
    if (!amount) return '';
    return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  };

  // Get status badge
  const getStatusDisplay = (status) => {
    const statusMap = {
      'planning': 'Planning',
      'under-construction': 'Under Construction',
      'completed': 'Ready',
      'on-hold': 'On Hold',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [filters, currentPage]);

  // Check if user is admin
  const isAdmin = isAuthenticated && auth.roles && auth.roles.includes('admin');

  // If admin, render with dashboard layout
  if (isAdmin) {
    return (
      <>
        {/* Dashboard Header for Admin */}
        <DashboardHeader />
        {/* Mobile Nav  */}
        <MobileMenu />
        {/* End Mobile Nav  */}

        <div className="dashboard_content_wrapper">
          <div className="dashboard dashboard_wrapper pr30 pr0-xl">
            <SidebarDashboard />
            {/* End .dashboard__sidebar */}

            <div className="dashboard__main pl0-md" style={{
              height: "auto",
              overflow: "visible"
            }}>
              <div className="dashboard__content bgc-f7" style={{
                minHeight: "calc(100vh - 80px)",
                overflow: "visible",
                height: "auto"
              }}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="dashboard_title_area">
                      <h2>New Projects Management</h2>
                      <p className="text">Manage all new projects in the system</p>
                    </div>
                  </div>
                </div>

                {/* Projects content for admin */}
                <AdminProjectsContent
                  projects={projects}
                  loading={loading}
                  filters={filters}
                  setFilters={setFilters}
                  totalProjects={totalProjects}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Regular public view
  return (
    <div className="new-projects-page">
      {/* Header Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/" className="text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">New Projects</li>
                </ol>
              </nav>
              <h1 className="page-title">New Projects in UAE</h1>
              <p className="page-subtitle">
                Discover the latest residential and commercial developments across the Emirates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters Bar - Mobile Only */}
      <div className="filters-section d-lg-none">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="filters-wrapper">
                <div className="filter-item">
                  <select
                    className="form-select"
                    value={filters.emirate}
                    onChange={(e) => handleFilterChange('emirate', e.target.value)}
                  >
                    <option value="">All Emirates</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                  </select>
                </div>

                <div className="filter-item">
                  <select
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed-use">Mixed Use</option>
                  </select>
                </div>

                <div className="results-count">
                  <span>{projects.length} of {totalProjects} results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-section">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-9">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-building fa-3x mb-3"></i>
                  <h5>No projects found</h5>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {projects.map((project) => (
                    <div key={project._id} className="col-lg-4 col-md-6">
                      <div className="project-card">
                        {/* Project Image */}
                        <div className="project-image" style={{ position: 'relative' }}>
                          {project.images?.mainImage?.url ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1${project.images.mainImage.url}`}
                              alt={project.title}
                              className="img-fluid"
                            />
                          ) : (
                            <div className="placeholder-image">
                              <i className="fas fa-building fa-3x"></i>
                            </div>
                          )}
                          
                          {/* Bottom Overlay - View Count and Like Button */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                              padding: "15px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              zIndex: "10",
                            }}
                          >
                            {/* View Count */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              <i className="fas fa-eye" style={{ fontSize: "16px" }}></i>
                              <span>{project?.views || project?.viewCount || project?.analytics?.views || 0}</span>
                            </div>

                            {/* Heart/Like Button */}
                            <button
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                transition: "all 0.2s ease",
                              }}
                              onClick={(e) => handleFavoriteToggle(e, project._id)}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.backgroundColor = "white";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                              }}
                              aria-label={favorites[project._id] ? "Remove from favorites" : "Add to favorites"}
                            >
                              <i
                                className={favorites[project._id] ? "fas fa-heart" : "far fa-heart"}
                                style={{
                                  color: favorites[project._id] ? "#e74c3c" : "#95a5a6",
                                  fontSize: "16px",
                                }}
                              ></i>
                            </button>
                          </div>
                        </div>

                        {/* Project Content */}
                        <div className="project-content">
                          {/* Developer */}
                          <div className="developer-name">
                            by {project.projectDetails?.developer || 'MERAAS Properties'}
                          </div>

                          {/* Project Title */}
                          <h3 className="project-title">
                            <Link href={`/new-projects/${project.slug || project._id}`}>
                              {project.title}
                            </Link>
                          </h3>

                          {/* Location */}
                          <div className="project-location">
                            <i className="fas fa-map-marker-alt"></i>
                            {project.location?.area}, {project.location?.city}
                          </div>

                          {/* Project Details */}
                          <div className="project-details">
                            <div className="detail-item">
                              <span className="label">LAUNCHED</span>
                              <span className="value">
                                {formatDate(project.createdAt) || 'Q3 2023'}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="label">HANDOVER</span>
                              <span className="value">
                                {formatDate(project.projectDetails?.expectedCompletionDate) || 'Q4 2024'}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="project-actions">
                            <EnhancedNotifyMeButton
                              projectId={project._id}
                              className="notify-btn"
                              onNotificationAdded={() => {
                                console.log('Notification added for project:', project._id);
                              }}
                            />
                            <Link
                              href={`/new-projects/${project.slug || project._id}`}
                              className="view-more-btn"
                            >
                              View More Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="sidebar-filters">
                <div className="filter-section">
                  <h5 className="filter-title">Filter by</h5>

                  <div className="filter-group">
                    <label className="filter-label">Emirate</label>
                    <select
                      className="form-select filter-select"
                      value={filters.emirate}
                      onChange={(e) => handleFilterChange('emirate', e.target.value)}
                    >
                      <option value="">All Emirates</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Property Type</label>
                    <select
                      className="form-select filter-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="mixed-use">Mixed Use</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <select
                      className="form-select filter-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="planning">Planning</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="completed">Ready to Move</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Sort By</label>
                    <select
                      className="form-select filter-select"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-section">
                  <h6 className="stats-title">Quick Stats</h6>
                  <div className="stat-item">
                    <span className="stat-label">Total Projects</span>
                    <span className="stat-value">{totalProjects}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Showing</span>
                    <span className="stat-value">{projects.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {!loading && projects.length > 0 && (
            <div className="pagination-section">
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(Math.ceil(totalProjects / 12))].map((_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage >= Math.ceil(totalProjects / 12) ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalProjects / 12)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .new-projects-page {
          background-color: var(--color-bg-alt);
          min-height: 100vh;
        }

        .hero-section {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          color: white;
          padding: 80px 0 60px;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 0;
        }

        .breadcrumb {
          background: transparent;
          padding: 0;
        }

        .breadcrumb-item a {
          color: rgba(255, 255, 255, 0.8);
        }

        .breadcrumb-item.active {
          color: white;
        }

        .filters-section {
          background: white;
          padding: 30px 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .filters-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-item {
          min-width: 180px;
        }

        .form-select {
          border: 2px solid var(--color-border);
          border-radius: 8px;
          padding: 12px 16px;
          font-weight: 500;
        }

        .form-select:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--color-primary) 25%, transparent);
        }

        .results-count {
          margin-left: auto;
          color: #6c757d;
          font-weight: 500;
        }

        .projects-section {
          padding: 60px 0;
        }

        .project-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: none;
          height: 100%;
        }

        /* Removed hover transform and shadow for .project-card */

        .project-image {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: none;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
        }

        .project-content {
          padding: 24px;
        }

        .developer-name {
          color: var(--color-primary);
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .project-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .project-title a {
          color: #2c3e50;
          text-decoration: none;
          transition: none;
        }

        /* Removed hover color change for project title links */

        .project-location {
          color: #6c757d;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }

        .project-location i {
          margin-right: 6px;
          color: #667eea;
        }

        .project-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--color-bg-alt);
          border-radius: 8px;
        }

        .detail-item {
          text-align: center;
          flex: 1;
        }

        .detail-item .label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-item .value {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-headings);
        }

        .project-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notify-btn {
          width: 100%;
        }

        .view-more-btn {
          display: inline-block;
          background: white;
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          width: 100%;
          text-align: center;
        }

        .view-more-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--color-muted);
        }

        .pagination-section {
          margin-top: 60px;
        }

        .pagination .page-link {
          border: 2px solid var(--color-border);
          color: var(--color-primary);
          font-weight: 500;
          padding: 12px 16px;
          margin: 0 4px;
          border-radius: 8px;
        }

        .pagination .page-item.active .page-link {
          background: var(--ColorPrimaryFallback, var(--color-primary));
          border-color: var(--color-primary);
        }

        /* Removed hover effect for pagination links */

        .sidebar-filters {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
        }

        .filter-section {
          margin-bottom: 30px;
        }

        .filter-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-headings);
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--color-bg-alt);
        }

        .filter-group {
          margin-bottom: 20px;
        }

        .filter-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #6c757d;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--color-primary) 25%, transparent);
        }

        .stats-section {
          background: linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          border-radius: 12px;
          padding: 20px;
        }

        .stats-title {
          font-size: 1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .stat-item:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 700;
          color: #667eea;
        }

        @media (max-width: 991px) {
          .sidebar-filters {
            margin-top: 40px;
            position: static;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .filters-wrapper {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-item {
            min-width: auto;
          }

          .results-count {
            margin-left: 0;
            text-align: center;
          }

          .project-details {
            flex-direction: column;
            gap: 16px;
          }

          .sidebar-filters {
            margin-top: 30px;
          }
        }
      `}</style>
    </div>
  );
};

// Reusable Projects Content Component
const AdminProjectsContent = ({
  projects,
  loading,
  filters,
  setFilters,
  totalProjects,
  currentPage,
  setCurrentPage,
  handleFilterChange
}) => {
  if (loading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="filter-group">
              <select
                className="form-select form-select-sm"
                value={filters.emirate}
                onChange={(e) => handleFilterChange('emirate', e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="">All Emirates</option>
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                className="form-select form-select-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={{ minWidth: '180px' }}
              >
                <option value="">All Status</option>
                <option value="planning">Planning</option>
                <option value="under-construction">Under Construction</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search projects..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ minWidth: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="row">
        <div className="col-12">
          <p className="text-muted mb-4">
            Showing {projects.length} of {totalProjects} results
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-building fa-3x text-muted mb-3"></i>
              <h4>No projects found</h4>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project._id} className="col-xl-4 col-lg-6 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
                <div className="position-relative">
                  {project.images?.mainImage?.url ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1${project.images.mainImage.url}`}
                      alt={project.title}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  ) : (
                    <img
                      src="/images/listings/list-1.jpg"
                      alt={project.title}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`badge ${project.status === 'planning' ? 'bg-info' :
                      project.status === 'under-construction' ? 'bg-warning' :
                        project.status === 'completed' ? 'bg-success' :
                          project.status === 'on-hold' ? 'bg-secondary' :
                            'bg-dark'
                      }`}>
                      {project.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {project.location?.area}, {project.location?.emirate}
                    </small>
                  </div>

                  <h5 className="card-title mb-2 flex-grow-0">{project.title}</h5>
                  <p className="text-muted small mb-3">by {project.projectDetails?.developer || 'Unknown Developer'}</p>

                  <div className="row g-2 mb-3 small text-muted">
                    <div className="col-6">
                      <i className="far fa-calendar me-1"></i>
                      Handover: {project.projectDetails?.expectedCompletionDate ? new Date(project.projectDetails.expectedCompletionDate).toLocaleDateString() : 'TBA'}
                    </div>
                    <div className="col-6">
                      <i className="fas fa-money-bill-wave me-1"></i>
                      From: {project.pricing?.priceRange?.min ? `AED ${project.pricing.priceRange.min.toLocaleString()}` : 'TBA'}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="row g-2 mb-2">
                      <div className="col-12">
                        <EnhancedNotifyMeButton
                          projectId={project._id}
                          onNotificationAdded={() => {
                            console.log('Notification added for project:', project._id);
                          }}
                        />
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col">
                        <Link
                          href={`/new-projects/${project.slug || project._id}`}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          View More Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {projects.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <nav aria-label="Projects pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(Math.ceil(totalProjects / 12))].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage >= Math.ceil(totalProjects / 12) ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalProjects / 12)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default NewProjectsPage;