"use client";
import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { filterActiveAds } from '@/utils/adUtils';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

const AdsDisplay = ({
  placement = 'sidebar',
  className = '',
  maxAds = 3,
  showTitle = true,
  responsive = true,
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutes
}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const hasLoadedOnce = useRef(false); // Track if we've loaded data at least once

  console.log(`[AdsDisplay ${placement}] Component render - ads.length: ${ads.length}, loading: ${loading}, error: ${error}`);

  const fetchAds = useCallback(async (skipLoadingState = false) => {
    try {
      // Don't show loading if skipLoadingState is true (when we have cached data)
      if (!skipLoadingState) {
        setLoading(true);
      }
      setError(null);
      setImageErrors({});

      const response = await fetch(`${API}/api/ads`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[AdsDisplay] Fetched ads data:`, data);
        console.log(`[AdsDisplay] Placement filter: ${placement}`);

        if (data.success) {
          // Filter ads by placement and status using utility function
          let filteredAds = filterActiveAds(data.data || [], placement);

          // If empty, fallback to sidebar ads
          if (filteredAds.length === 0) {
            filteredAds = filterActiveAds(data.data || [], "sidebar");
          }


          console.log(`[AdsDisplay ${placement}] Filtered ads (${filteredAds.length}):`, filteredAds);

          // Always update ads with fresh data
          setAds(prevAds => {
            // If we have new ads, use them
            if (filteredAds.length > 0) {
              hasLoadedOnce.current = true;
              localStorage.setItem(`ads_${placement}`, JSON.stringify(filteredAds));
              console.log(`[AdsDisplay ${placement}] ✅ Updated with ${filteredAds.length} fresh ads`);
              return filteredAds;
            }

            // If no new ads but we have loaded before, keep previous ads
            if (hasLoadedOnce.current && prevAds.length > 0) {
              console.log(`[AdsDisplay ${placement}] ⚠️ No fresh ads, keeping ${prevAds.length} cached ads`);
              return prevAds;
            }

            // First load with no ads
            console.log(`[AdsDisplay ${placement}] ℹ️ No ads available`);
            localStorage.removeItem(`ads_${placement}`);
            return [];
          });
        } else {
          console.warn('[AdsDisplay] API returned success=false');
          setError('No ads available');
        }
      } else {
        console.error('[AdsDisplay] API request failed:', response.status);
        setError('Failed to fetch ads');
      }
    } catch (err) {
      console.error('[AdsDisplay] Error fetching ads:', err);
      console.error('[AdsDisplay] Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError('Failed to load ads');
    } finally {
      setLoading(false);
    }
  }, [placement, maxAds]);

  // Load cached data on mount and fetch fresh data
  useEffect(() => {
    let isMounted = true;

    // Check if we're in browser (not SSR)
    if (typeof window === 'undefined') {
      return;
    }

    console.log(`[AdsDisplay ${placement}] useEffect triggered - loading cache and fetching`);

    // Load cached data first
    try {
      const cachedAds = localStorage.getItem(`ads_${placement}`);
      console.log(`[AdsDisplay ${placement}] Cache check:`, cachedAds ? 'Found' : 'Not found');

      if (cachedAds) {
        const parsedAds = JSON.parse(cachedAds);
        console.log(`[AdsDisplay ${placement}] Loaded ${parsedAds.length} cached ads`);

        if (isMounted && parsedAds.length > 0) {
          setAds(parsedAds);
          hasLoadedOnce.current = true; // Mark as loaded
          setLoading(false); // Show cached data immediately
          console.log(`[AdsDisplay ${placement}] ✅ Cache applied, fetching fresh data in background`);
          // Fetch fresh data in background without showing loading
          fetchAds(true);
          return; // Exit early since we have cache
        }
      }
    } catch (error) {
      console.error(`[AdsDisplay ${placement}] Error loading cache:`, error);
    }

    // No cache or cache failed, fetch fresh data with loading state
    console.log(`[AdsDisplay ${placement}] No cache, fetching fresh data`);
    if (isMounted) {
      fetchAds(false);
    }

    return () => {
      isMounted = false;
    };
  }, [placement, fetchAds]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchAds, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAds]);

  const handleAdClick = useCallback(async (ad) => {
    try {
      // Track click analytics
      await fetch(`${API}/api/ads/${ad._id}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placement,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to track ad click:', err);
    }

    // Redirect to ad URL
    if (ad.redirect_url) {
      window.open(ad.redirect_url, '_blank', 'noopener,noreferrer');
    }
  }, [placement]);

  const handleImageError = useCallback((adId) => {
    setImageErrors(prev => ({
      ...prev,
      [adId]: true
    }));
  }, []);

  // Memoize image URL construction
  const getImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('http') ? imageUrl : `${API}${imageUrl}`;
  }, []);

  // Memoize ad dimensions based on placement
  const adDimensions = useMemo(() => {
    switch (placement) {
      case 'banner':
        return { width: '100%', height: '80px' };
      case 'header':
        return { width: '80px', height: '60px' };
      case 'footer':
        return { width: '100%', height: '120px' };
      default: // sidebar
        return { width: '100%', height: '150px' };
    }
  }, [placement]);

  // Show loading skeleton only on first load
  const showSkeleton = loading && ads.length === 0 && !hasLoadedOnce.current;

  // Determine what to render
  const hasAdsToShow = ads.length > 0;

  console.log(`[AdsDisplay ${placement}] Render decision - hasAdsToShow: ${hasAdsToShow}, loading: ${loading}, hasLoadedOnce: ${hasLoadedOnce.current}`);

  return (
    <div className={`ads-display ${placement} ${className}`}>

      {/* Show skeleton on first load */}
      {showSkeleton && (
        <>
          {showTitle && (
            <div className="ads-header mb-3">
              <div className="skeleton-text" style={{ width: '80px', height: '16px' }}></div>
            </div>
          )}
          <div className="ads-container">
            {[...Array(maxAds)].map((_, index) => (
              <div key={index} className="ad-item mb-3">
                <div
                  className="skeleton-image w-100 rounded mb-2"
                  style={{ height: adDimensions.height }}
                ></div>
                <div className="skeleton-text mb-1" style={{ width: '80%', height: '14px' }}></div>
                <div className="skeleton-text" style={{ width: '60%', height: '12px' }}></div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Show ads if available */}
      {!showSkeleton && hasAdsToShow && (
        <>
          {showTitle && (
            <div className="ads-header mb-3">
              <h6 className="text-muted small mb-0">Sponsored</h6>
            </div>
          )}

          <div className={`ads-container ${responsive ? 'ads-responsive' : ''}`}>
            {ads.map((ad, index) => (
              <div
                key={ad._id || index}
                className={`ad-item ad-${placement} mb-3`}
                onClick={() => handleAdClick(ad)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAdClick(ad);
                  }
                }}
                role={ad.redirect_url ? 'button' : 'article'}
                tabIndex={ad.redirect_url ? 0 : -1}
                aria-label={`Advertisement: ${ad.title || 'Sponsored content'}`}
                style={{ cursor: ad.redirect_url ? 'pointer' : 'default' }}
              >
                {/* Ad Image */}
                <div className="ad-image-container position-relative">
                  {ad.image_url && !imageErrors[ad._id] ? (
                    <img
                      src={getImageUrl(ad.image_url)}
                      alt={ad.title || 'Advertisement'}
                      className="ad-image w-100 rounded"
                      style={{
                        objectFit: 'cover',
                        height: adDimensions.height,
                        width: adDimensions.width
                      }}
                      onError={() => handleImageError(ad._id)}
                      loading="lazy"
                    />
                  ) : (
                    // Fallback when no image URL is provided or image failed to load
                    <div
                      className="ad-image-fallback d-flex align-items-center justify-content-center w-100 rounded"
                      style={{
                        height: adDimensions.height,
                        backgroundColor: '#f8f9fa',
                        fontSize: placement === 'header' ? '24px' : '48px',
                        color: '#6c757d'
                      }}
                    >
                      📢
                    </div>
                  )}

                  {/* Ad Badge */}
                  <div className="ad-badge position-absolute top-0 end-0 m-2">
                    <span className="badge bg-primary small">Ad</span>
                  </div>
                </div>

                {/* Ad Content */}
                <div className="ad-content mt-2">
                  <h6 className="ad-title mb-1 fw-bold" style={{ fontSize: '14px' }}>
                    {ad.title || 'Advertisement'}
                  </h6>

                  {ad.description && (
                    <p className="ad-description text-muted small mb-0" style={{ fontSize: '12px' }}>
                      {ad.description.length > 80
                        ? `${ad.description.substring(0, 80)}...`
                        : ad.description
                      }
                    </p>
                  )}

                  {/* Call to action button for better engagement */}
                  {ad.cta_text && (
                    <button className="btn btn-sm btn-outline-primary mt-2 ad-cta">
                      {ad.cta_text}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Show empty state if no ads and not loading */}
      {!showSkeleton && !hasAdsToShow && (
        <div style={{
          minHeight: '50px',
          padding: '15px',
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '12px'
        }}>
          {/* Empty state - keeps layout but shows nothing */}
        </div>
      )}

      <style jsx>{`
        .ads-display {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e9ecef;
        }

        .ad-item {
          background: white;
          border-radius: 8px;
          padding: 12px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          position: relative !important;
          overflow: hidden;
        }

        .ad-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .ad-item:active {
          transform: translateY(0);
        }

        .ad-image {
          border-radius: 6px;
          transition: transform 0.3s ease;
        }

        .ad-item:hover .ad-image {
          transform: scale(1.02);
        }

        .ad-title {
          color: #333;
          line-height: 1.3;
        }

        .ad-description {
          line-height: 1.4;
        }

        .ad-cta {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Skeleton loading styles */
        .skeleton-image,
        .skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .ads-display {
            padding: 10px;
            margin-bottom: 20px;
          }
          
          .ads-responsive .ad-item {
            margin-bottom: 15px;
            padding: 10px;
          }
          
          .ads-responsive .ad-image,
          .ads-responsive .ad-image-fallback {
            height: 120px !important;
          }
          
          .ad-title {
            font-size: 13px !important;
          }
          
          .ad-description {
            font-size: 11px !important;
          }

          .ad-cta {
            font-size: 10px !important;
            padding: 3px 6px !important;
          }
        }

        @media (max-width: 576px) {
          .ads-display {
            padding: 8px;
          }
          
          .ad-item {
            padding: 8px;
          }
          
          .ads-responsive .ad-image,
          .ads-responsive .ad-image-fallback {
            height: 100px !important;
          }

          .ads-banner .ad-item {
            flex-direction: column;
            text-align: center;
          }

          .ads-banner .ad-image-container {
            width: 100%;
            height: 100px;
            margin-right: 0;
            margin-bottom: 10px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .ads-display {
            background: #2d3748;
            border-color: #4a5568;
          }

          .ad-item {
            background: #1a202c;
            border-color: #4a5568;
          }

          .ad-title {
            color: #e2e8f0;
          }

          .ad-description {
            color: #a0aec0;
          }

          .ad-image-fallback {
            background-color: #4a5568 !important;
            color: #a0aec0 !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .ad-item,
          .ad-image,
          .skeleton-image,
          .skeleton-text {
            transition: none;
            animation: none;
          }

          .ad-item:hover {
            transform: none;
          }

          .ad-item:hover .ad-image {
            transform: none;
          }
        }

        /* Placement-specific styles */
        .ads-sidebar {
          max-width: 100%;
          width: 100%;
        }

        .ads-header .ad-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
        }

        .ads-header .ad-image-container {
          width: 80px;
          height: 60px;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .ads-header .ad-content {
          flex: 1;
          margin-top: 0;
        }

        .ads-footer .ad-item {
          text-align: center;
        }

        .ads-banner .ad-item {
          display: flex;
          align-items: center;
          padding: 15px;
        }

        .ads-banner .ad-image-container {
          width: 120px;
          height: 80px;
          margin-right: 20px;
          flex-shrink: 0;
        }

        .ads-banner .ad-content {
          flex: 1;
          margin-top: 0;
        }
      `}</style>
    </div>
  );
};

export default memo(AdsDisplay);