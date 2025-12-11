"use client";
import { useState, useEffect } from 'react';
import { filterActiveAds } from '@/utils/adUtils';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

const PropertyAd = ({ placement = 'property-listing' }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchAd();
  }, [placement]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);

      // Try HTTPS first, then fall back to HTTP for localhost
      let apiUrl = API;
      if (API.includes('localhost') && API.startsWith('https:')) {
        apiUrl = API.replace('https:', 'http:');
      }

      const response = await fetch(`${apiUrl}/api/ads`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Filter for active ads in the specified placement using utility function
          const activeAds = filterActiveAds(data.data, placement);

          // Select a random ad from the active ones
          if (activeAds.length > 0) {
            const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
            setAd(randomAd);
          }
        }
      } else {
        setError('Failed to load ad');
      }
    } catch (err) {
      // Silently fail - don't show ads if backend is unavailable
      setError('Failed to load ad');
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Ad service unavailable:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = () => {
    if (ad && ad.redirect_url) {
      // Open in new tab
      window.open(ad.redirect_url, '_blank', 'noopener,noreferrer');
      
      // In a real implementation, you would also track the click on the backend
      console.log('Ad clicked:', ad.title);
    }
  };

  const handleImageError = () => {
    console.log('Ad image failed to load, showing fallback');
    setImageError(true);
  };

  // If loading, show nothing
  if (loading) {
    return null;
  }

  // If there's an error or no ad available, show nothing
  if (error || !ad) {
    return null;
  }

  // Render the actual ad
  return (
    <div className="col-md-12" style={{ marginBottom: "20px" }}>
      <div
        className="ad-card"
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #eee",
          minHeight: "250px",
          cursor: ad.redirect_url ? "pointer" : "default",
        }}
        onClick={handleAdClick}
      >
        <div style={{ position: "relative", width: "100%", height: "200px" }}>
          {ad.image_url && !imageError ? (
            // Use img tag instead of Next.js Image component to avoid optimization errors
            <img
              src={`${API}${ad.image_url}`}
              alt={ad.title}
              style={{ 
                objectFit: "cover",
                width: "100%",
                height: "100%"
              }}
              onError={handleImageError}
            />
          ) : (
            // Fallback when no image URL is provided or image failed to load
            <div 
              className="ad-image-fallback d-flex align-items-center justify-content-center w-100"
              style={{
                height: '200px',
                backgroundColor: '#f0f0f0',
                fontSize: '48px'
              }}
            >
              📢
            </div>
          )}
          
          {/* Ad badge */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#0f8363",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Ad
          </div>
        </div>
        
        <div style={{ padding: "15px" }}>
          <h3 
            style={{ 
              margin: "0 0 10px 0", 
              color: "#2c3e50",
              fontSize: "18px",
              fontWeight: "600"
            }}
          >
            {ad.title}
          </h3>
          
          {ad.description && (
            <p 
              style={{ 
                color: "#7f8c8d", 
                marginBottom: "15px",
                fontSize: "14px",
                lineHeight: "1.4"
              }}
            >
              {ad.description.length > 100 
                ? `${ad.description.substring(0, 100)}...` 
                : ad.description}
            </p>
          )}
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderTop: "1px solid #eee",
            paddingTop: "15px"
          }}>
            <span style={{ 
              fontSize: "12px", 
              color: "#95a5a6",
              fontStyle: "italic"
            }}>
              Sponsored
            </span>
            
            {ad.redirect_url && (
              <button
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#0f8363",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdClick();
                }}
              >
                Learn More
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .ad-card {
            min-height: 200px;
          }
          
          h3 {
            font-size: 16px !important;
          }
          
          p {
            font-size: 13px !important;
          }
          
          .ad-image-fallback {
            height: 150px !important;
          }
        }
        
        @media (max-width: 576px) {
          .ad-card {
            min-height: 180px;
          }
          
          .ad-card > div:first-child {
            height: 150px;
          }
          
          .ad-image-fallback {
            height: 150px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyAd;