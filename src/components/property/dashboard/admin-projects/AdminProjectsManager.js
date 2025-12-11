"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import ProjectDataTable from './ProjectDataTable';
import ProjectNotificationsModal from './ProjectNotificationsModal';
import ProjectStats from './ProjectStats';
import ViewProjectModal from './ViewProjectModal';

const AdminProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    published: '',
    search: ''
  });
  const [stats, setStats] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    return null;
  };

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    console.log(`🔧 Admin Filter changed: ${field} = ${value}`);
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    console.log('🧹 Clearing all admin filters');
    setFilters({
      status: '',
      category: '',
      published: '',
      search: ''
    });
    setCurrentPage(1);
  };

  // Fetch projects
  const fetchProjects = async (page = 1, filterParams = null) => {
    try {
      setLoading(true);
      
      // Use provided filterParams or current filters state
      const filtersToUse = filterParams !== null ? filterParams : filters;
      
      // Clean up filter values
      const cleanFilters = {};
      Object.keys(filtersToUse).forEach(key => {
        if (filtersToUse[key] && filtersToUse[key].toString().trim() !== '') {
          cleanFilters[key] = filtersToUse[key].toString().trim();
        }
      });

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...cleanFilters
      });

      console.log('🔍 Admin fetching projects with filters:', cleanFilters);
      console.log('📄 Fetching page:', page, 'Current projects count:', projects.length);

      const response = await axios.get(
        `${API_BASE_URL}/admin/projects?${queryParams}`,
        axiosConfig
      );

      if (response.data.success) {
        const projectsData = response.data.data?.projects || [];
        const paginationData = response.data.data?.pagination || {};

        console.log(`✅ Loaded ${projectsData.length} projects with current statuses:`);
        projectsData.forEach(p => console.log(`  - ${p.title}: status=${p.status}, published=${p.published}`));

        setProjects(projectsData);
        setTotalProjects(paginationData.totalProjects || 0);
        setCurrentPage(paginationData.currentPage || page);
        setTotalPages(paginationData.totalPages || 1);
        setError(null); // Clear any previous errors
      } else {
        throw new Error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch projects');
      toast.error('Failed to fetch projects');
      // Don't clear projects on error, keep showing existing ones
    } finally {
      setLoading(false);
    }
  };

  // Fetch project statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/projects/stats`,
        axiosConfig
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/projects/${projectId}`,
        axiosConfig
      );

      if (response.data.success) {
        toast.success('Project deleted successfully');
        fetchProjects(currentPage, filters);
        fetchStats();
      } else {
        throw new Error(response.data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  // Toggle project status
  const handleToggleStatus = async (projectId, statusType) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/projects/${projectId}/toggle-${statusType}`,
        {},
        axiosConfig
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProjects(currentPage, filters);
        fetchStats();
      } else {
        throw new Error(response.data.message || `Failed to toggle ${statusType} status`);
      }
    } catch (error) {
      console.error(`Error toggling ${statusType} status:`, error);
      toast.error(error.response?.data?.message || `Failed to toggle ${statusType} status`);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchProjects(page, filters);
    }
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProjects(1, newFilters);
  };

  // useEffect to fetch projects when filters change
  useEffect(() => {
    if (currentPage > 0) { // Only fetch if currentPage is valid
      fetchProjects(currentPage, filters);
    }
  }, [filters, currentPage]);

  // Initial load
  useEffect(() => {
    fetchProjects(1, {
      status: '',
      category: '',
      published: '',
      search: ''
    });
    fetchStats();
  }, []);

  // Modal handlers
  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleViewNotifications = (project) => {
    setSelectedProject(project);
    setShowNotificationsModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowNotificationsModal(false);
    setSelectedProject(null);
  };

  const handleProjectCreated = () => {
    // Show success message
    toast.success('Project created successfully!');
    
    // Close modal
    handleModalClose();
    
    // Refresh the projects list and stats immediately
    fetchProjects(1, filters);
    fetchStats();
    
    // Reset to first page after refresh
    setCurrentPage(1);
  };

  const handleProjectUpdated = () => {
    console.log('🔄 Project updated, refreshing list...');
    handleModalClose();
    // Refresh immediately with current filters
    fetchProjects(currentPage, filters);
    fetchStats();
    toast.success('Project updated successfully!');
  };



  if (loading && projects.length === 0) {
    return (
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
        <div className="text-center py-5">
          <div className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          <h5 className="text-danger">Error Loading Projects</h5>
          <p className="text-muted">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setError(null);
              fetchProjects();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard_content_wrapper">
      <div className="dashboard_title_area">
        <h2>Project Management</h2>
        <p className="text">Manage new development projects with comprehensive content management system</p>
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="row mb30">
          <div className="col-12">
            <ProjectStats stats={stats} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="packages_table table-responsive">
              <ProjectDataTable 
                projects={projects}
                loading={loading}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={handleViewProject}

                onTogglePublished={(id) => handleToggleStatus(id, 'published')}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onCreateNew={handleCreateProject}
                onViewNotifications={handleViewNotifications}
                filters={filters}
                pagination={{
                  currentPage,
                  totalPages,
                  totalProjects,
                  onPageChange: handlePageChange
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={handleModalClose}
          onSuccess={handleProjectCreated}
        />
      )}

      {showEditModal && selectedProject && (
        <EditProjectModal
          isOpen={showEditModal}
          project={selectedProject}
          onClose={handleModalClose}
          onSuccess={handleProjectUpdated}
        />
      )}

      {showViewModal && selectedProject && (
        <ViewProjectModal
          isOpen={showViewModal}
          project={selectedProject}
          onClose={handleModalClose}
          onEdit={() => {
            handleModalClose();
            handleEditProject(selectedProject);
          }}
        />
      )}

      {showNotificationsModal && selectedProject && (
        <ProjectNotificationsModal
          isOpen={showNotificationsModal}
          project={selectedProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminProjectsManager;