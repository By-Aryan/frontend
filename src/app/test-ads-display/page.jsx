"use client";
import AdsDisplay from '@/components/common/AdsDisplay';

export default function TestAdsDisplay() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Ads Display Test</h1>
      <p className="mb-4">This page tests the AdsDisplay component in different placements.</p>
      <p className="mb-4 text-muted">Note: Only active ads with valid placements will be displayed.</p>
      
      <div className="row">
        <div className="col-lg-8">
          <h3>Main Content Area</h3>
          <p>This is the main content area where property listings would appear.</p>
          
          {/* Simulate property listings */}
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Property {item}</h5>
                    <p className="card-text">This is a sample property listing.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-lg-4">
          <h3>Sidebar Ads</h3>
          <p className="text-muted">Showing up to 3 sidebar ads:</p>
          <AdsDisplay placement="sidebar" maxAds={3} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <h3>Banner Ads</h3>
          <p className="text-muted">Showing up to 1 banner ad:</p>
          <AdsDisplay placement="banner" maxAds={1} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <h3>Header Ads</h3>
          <p className="text-muted">Showing up to 1 header ad:</p>
          <AdsDisplay placement="header" maxAds={1} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-info">
            <h4>Note:</h4>
            <p>Only ads that are:</p>
            <ul>
              <li>Marked as "Active"</li>
              <li>Within their start and end dates</li>
              <li>Assigned to the correct placement</li>
            </ul>
            <p>...will be displayed. If no ads match these criteria, nothing will be shown.</p>
          </div>
        </div>
      </div>
    </div>
  );
}