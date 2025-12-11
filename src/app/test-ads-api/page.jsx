"use client";
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5001';

export default function TestAdsAPI() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API}/api/ads`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAds(data.data || []);
        } else {
          setError('API returned success: false');
        }
      } else {
        setError(`https ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-5">Loading ads...</div>;
  if (error) return <div className="container py-5 text-danger">Error: {error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Ads API Test</h1>
      <p className="mb-4">Found {ads.length} ads</p>
      
      <div className="row">
        {ads.map((ad, index) => (
          <div key={ad._id || index} className="col-md-6 col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{ad.title}</h5>
                <p className="card-text">
                  <strong>Status:</strong> {ad.status}<br />
                  <strong>Placement:</strong> {ad.placement}<br />
                  <strong>Start Date:</strong> {new Date(ad.start_date).toLocaleDateString()}<br />
                  <strong>End Date:</strong> {new Date(ad.end_date).toLocaleDateString()}<br />
                  {ad.image_url && (
                    <div className="mt-2">
                      <strong>Image URL:</strong> {ad.image_url}
                    </div>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={fetchAds}
        className="btn btn-primary"
      >
        Refresh Ads
      </button>
    </div>
  );
}