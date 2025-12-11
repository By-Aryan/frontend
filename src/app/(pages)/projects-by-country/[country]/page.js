"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import NewProjects from '@/components/listing/new-project/NewProjects';

const ProjectsByCountryPage = () => {
  const params = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    emirate: ''
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Build query params
        const queryParams = new URLSearchParams({
          country: params.country?.toUpperCase() || 'UAE',
          ...filters
        });

        // Remove empty filter values
        Object.keys(filters).forEach(key => {
          if (!filters[key]) {
            queryParams.delete(key);
          }
        });

        console.log('🔍 Fetching public projects with params:', queryParams.toString());

        const response = await axios.get(
          `${API_BASE_URL}/projects/public?${queryParams}`
        );

        if (response.data.success) {
          const projectsData = response.data.data?.projects || [];
          console.log(`✅ Loaded ${projectsData.length} public projects`);
          projectsData.forEach(p => console.log(`  - ${p.title}: status=${p.status}, published=${p.published}`));
          setProjects(projectsData);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [params.country, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-fluid py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-2">New Projects in {params.country?.toUpperCase() || 'UAE'}</h1>
            <p className="text-muted">Discover the latest property development projects</p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="under-construction">Under Construction</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.category}
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
              value={filters.emirate}
              onChange={(e) => handleFilterChange('emirate', e.target.value)}
            >
              <option value="">All Emirates</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Dubai">Dubai</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
            </select>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setFilters({ status: '', category: '', emirate: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Projects List */}
        {!loading && !error && (
          <div className="row">
            {projects.length > 0 ? (
              <NewProjects data={projects} />
            ) : (
              <div className="col-12 text-center py-5">
                <div className="text-muted">
                  <i className="fas fa-building fa-3x mb-3"></i>
                  <h5>No projects found</h5>
                  <p>Try adjusting your filters or check back later for new listings.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsByCountryPage;
