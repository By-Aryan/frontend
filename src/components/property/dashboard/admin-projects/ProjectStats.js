"use client";

const ProjectStats = ({ stats }) => {
  if (!stats) return null;

  const { overview, statusBreakdown, categoryBreakdown } = stats;

  return (
    <div className="row">
      {/* Overview Stats */}
      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-primary mb-0">{overview.totalProjects}</h3>
              <p className="text mb-0">Total Projects</p>
            </div>
            <div className="icon">
              <span className="flaticon-building text-primary fz40"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-success mb-0">{overview.publishedProjects}</h3>
              <p className="text mb-0">Published</p>
            </div>
            <div className="icon">
              <span className="flaticon-eye text-success fz40"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-warning mb-0">{overview.featuredProjects}</h3>
              <p className="text mb-0">Featured</p>
            </div>
            <div className="icon">
              <span className="flaticon-star text-warning fz40"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-info mb-0">{overview.totalViews?.toLocaleString() || 0}</h3>
              <p className="text mb-0">Total Views</p>
            </div>
            <div className="icon">
              <span className="flaticon-view text-info fz40"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-secondary mb-0">{overview.totalInquiries?.toLocaleString() || 0}</h3>
              <p className="text mb-0">Inquiries</p>
            </div>
            <div className="icon">
              <span className="flaticon-mail text-secondary fz40"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 mb30">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="title text-dark mb-0">{overview.totalProjects - overview.publishedProjects}</h3>
              <p className="text mb-0">Drafts</p>
            </div>
            <div className="icon">
              <span className="flaticon-edit text-dark fz40"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {statusBreakdown && statusBreakdown.length > 0 && (
        <div className="col-xl-6 col-lg-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title mb20">Status Breakdown</h4>
            <div className="row">
              {statusBreakdown.map((item, index) => (
                <div key={index} className="col-6 mb15">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw500 text-capitalize">
                      {item._id?.replace('-', ' ') || 'Unknown'}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(item._id)}`}>
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown && categoryBreakdown.length > 0 && (
        <div className="col-xl-6 col-lg-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title mb20">Category Breakdown</h4>
            <div className="row">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="col-6 mb15">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw500 text-capitalize">
                      {item._id?.replace('-', ' ') || 'Unknown'}
                    </span>
                    <span className="badge bg-light text-dark">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get status badge classes
const getStatusBadgeClass = (status) => {
  const classes = {
    'planning': 'bg-warning text-dark',
    'under-construction': 'bg-info text-white',
    'completed': 'bg-success text-white',
    'on-hold': 'bg-secondary text-white',
    'cancelled': 'bg-danger text-white'
  };
  return classes[status] || 'bg-secondary text-white';
};

export default ProjectStats;