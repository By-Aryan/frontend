"use client";
import { useState } from 'react';

const ProjectDataTable = ({
  projects = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  onTogglePublished,
  onFilterChange,
  onSearch,
  onCreateNew,
  onViewNotifications,
  filters = {},
  pagination = {}
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (field, value) => {
    onFilterChange(field, value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'planning': { class: 'badge-warning', label: 'Planning' },
      'under-construction': { class: 'badge-primary', label: 'Under Construction' },
      'completed': { class: 'badge-success', label: 'Completed' },
      'on-hold': { class: 'badge-secondary', label: 'On Hold' },
      'cancelled': { class: 'badge-danger', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { class: 'badge-secondary', label: status || 'Unknown' };

    return (
      <span className={`badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getPublishedBadge = (isPublished) => {
    return (
      <span className={`badge ${isPublished ? 'badge-success' : 'badge-danger'}`}>
        {isPublished ? 'Published' : 'Draft'}
      </span>
    );
  };

  return (
    <div className="project-data-table">
      {/* Header with Search and Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <form onSubmit={handleSearchSubmit} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="under-construction">Under Construction</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
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
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.published || ''}
            onChange={(e) => handleFilterChange('published', e.target.value)}
          >
            <option value="">All Published Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSearchTerm('');
              onFilterChange('status', '');
              onFilterChange('category', '');
              onFilterChange('published', '');
              onSearch('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <p>No projects found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <div>
                        <strong>{project.title || 'Untitled Project'}</strong>
                        {project.location && (
                          <div className="text-muted small">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {typeof project.location === 'string' 
                              ? project.location 
                              : project.location?.address || 
                                `${project.location?.city || ''}, ${project.location?.emirate || ''}`.replace(/^, |, $/, '') || 
                                'Location not available'
                            }
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-capitalize">{project.category || 'N/A'}</span>
                    </td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>{getPublishedBadge(project.published)}</td>
                    <td>{formatDate(project.createdAt)}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onView(project)}
                            >
                              <i className="fas fa-eye me-2"></i>
                              View
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onEdit(project)}
                            >
                              <i className="fas fa-edit me-2"></i>
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onTogglePublished(project._id)}
                            >
                              <i className={`fas ${project.published ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
                              {project.published ? 'Unpublish' : 'Publish'}
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onViewNotifications(project)}
                            >
                              <i className="fas fa-bell me-2"></i>
                              Notifications
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => onDelete(project._id)}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-md-6">
            <p className="text-muted">
              Showing {projects.length} of {pagination.totalProjects} projects
            </p>
          </div>
          <div className="col-md-6">
            <nav aria-label="Projects pagination">
              <ul className="pagination justify-content-end">
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <li
                      key={page}
                      className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => pagination.onPageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDataTable;