"use client";
import ViewContactButton from './ViewContactButton';

const PropertyCard = ({ property }) => {
  const formatPrice = (price, currency = 'AED') => {
    if (!price) return 'Price on request';
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <div className="card property-card border-0 shadow-sm h-100">
      <div className="position-relative">
        {property.developer_notes?.images?.[0] ? (
          <img
            src={property.developer_notes.images[0].full_url || `${process.env.NEXT_PUBLIC_API_BASE_URL}${property.developer_notes.images[0].file_path}`}
            alt={property.title || property.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              // Don't use placeholder image, show camera icon instead
              e.target.style.display = 'none';
            }}
          />
        ) : property.images?.mainImage?.url ? (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1${property.images.mainImage.url}`}
            alt={property.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
            <i className="fas fa-camera fa-3x text-muted"></i>
          </div>
        )}
        
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary">{property.details?.property_type || 'Property'}</span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold">{property.title || property.name}</h6>
        
        <div className="mb-2">
          <i className="fas fa-map-marker-alt text-primary me-2"></i>
          <small className="text-muted">
            {typeof property.location?.area === 'string' 
              ? property.location.area 
              : property.location?.area?.name || property.location?.area?.area || ''
            }{property.location?.area && property.location?.city ? ', ' : ''}{typeof property.location?.city === 'string' 
              ? property.location.city 
              : property.location?.city?.name || property.location?.city?.city || ''
            }
          </small>
        </div>
        
        <div className="mb-3">
          <div className="fw-bold text-success fs-5">
            {formatPrice(property.price, property.currency)}
          </div>
        </div>
        
        <div className="row mb-3">
          {property.details?.bedrooms > 0 && (
            <div className="col-4 text-center">
              <i className="fas fa-bed text-muted"></i>
              <div className="small">{property.details.bedrooms} Bed</div>
            </div>
          )}
          {property.details?.bathrooms > 0 && (
            <div className="col-4 text-center">
              <i className="fas fa-bath text-muted"></i>
              <div className="small">{property.details.bathrooms} Bath</div>
            </div>
          )}
          {property.details?.size?.value > 0 && (
            <div className="col-4 text-center">
              <i className="fas fa-ruler-combined text-muted"></i>
              <div className="small">{property.details.size.value} {property.details.size.unit}</div>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <ViewContactButton 
              propertyId={property._id} 
              className="w-100"
              variant="primary"
            />
            <button className="btn btn-outline-primary btn-sm">
              <i className="fas fa-eye me-2"></i>
              View Details
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }

        .card-img-top {
          border-radius: 15px 15px 0 0;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default PropertyCard;