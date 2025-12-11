"use client";
import { useState, useEffect } from 'react';
import AdsDisplay from '@/components/common/AdsDisplay';
import PropertyAd from '@/components/listing/grid-view/grid-full-1-col-v1/PropertyAd';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5001';

export default function TestAdDates() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/ads`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAds(data.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-5">Loading ads data...</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Ad Date Filtering Test</h1>
      <p className="mb-4 text-muted">
        This page tests that ads are properly filtered by their active date ranges.
      </p>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">All Ads from API</h5>
            </div>
            <div className="card-body">
              <p>Total ads in system: {ads.length}</p>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Placement</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Currently Active</th>
                      <th>Image Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad, index) => {
                      const startDate = new Date(ad.start_date);
                      const endDate = new Date(ad.end_date);
                      const now = new Date();
                      const isActive = startDate <= now && endDate >= now;
                      
                      return (
                        <tr key={ad._id || index}>
                          <td>{ad.title}</td>
                          <td>
                            <span className={`badge ${ad.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                              {ad.status}
                            </span>
                          </td>
                          <td>{ad.placement}</td>
                          <td>{startDate.toLocaleDateString()}</td>
                          <td>{endDate.toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {ad.image_url ? (
                              <div style={{ width: '100px', height: '50px', overflow: 'hidden' }}>
                                <img 
                                  src={`${API}${ad.image_url}`} 
                                  alt={ad.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                                <span style={{ display: 'none', color: 'red' }}>Image failed</span>
                              </div>
                            ) : (
                              <span>No Image</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <h3>Property Listings with Inline Ads</h3>
          <p className="text-muted">Ads will appear between property listings:</p>
          
          {/* Simulate property listings with ads in between */}
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Property 1</h5>
                  <p className="card-text">This is a sample property listing.</p>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="alert alert-info">
                <h5>Property Ad (property-listing placement)</h5>
                <p>Only ads that are currently active and placed in "property-listing" will appear here:</p>
              </div>
              <PropertyAd placement="property-listing" />
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Property 2</h5>
                  <p className="card-text">This is a sample property listing.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Property 3</h5>
                  <p className="card-text">This is a sample property listing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <h3>Sidebar Ads</h3>
          <p className="text-muted">Ads will appear in the sidebar:</p>
          <div className="alert alert-info">
            <p>Only ads that are currently active and placed in "sidebar" will appear here:</p>
          </div>
          <AdsDisplay placement="sidebar" maxAds={3} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <h3>Banner Ads</h3>
          <p className="text-muted">Full-width banner ads:</p>
          <div className="alert alert-info">
            <p>Only ads that are currently active and placed in "banner" will appear here:</p>
          </div>
          <AdsDisplay placement="banner" maxAds={1} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-warning">
            <h5>How Date Filtering Works</h5>
            <p>Ads are only displayed if:</p>
            <ul>
              <li>Their status is "Active"</li>
              <li>The current date is between their start_date and end_date</li>
              <li>They are placed in the correct location (sidebar, banner, etc.)</li>
            </ul>
            <p>Ads that don't meet these criteria will not be displayed at all.</p>
          </div>
        </div>
      </div>
    </div>
  );
}