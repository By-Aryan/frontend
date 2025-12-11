"use client";
import { useState } from 'react';
import AdsDisplay from '@/components/common/AdsDisplay';
import PropertyAd from '@/components/listing/grid-view/grid-full-1-col-v1/PropertyAd';

export default function TestAdsImageErrors() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Ads Image Error Handling Test</h1>
      <p className="mb-4 text-muted">
        This page tests how ads handle missing or invalid images.
      </p>
      
      <div className="alert alert-info mb-4">
        <h5>What to expect:</h5>
        <ul>
          <li>Ads with valid images will display normally</li>
          <li>Ads with missing images will show a fallback emoji (📢)</li>
          <li>No error messages should appear in the console for missing images</li>
        </ul>
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
          <AdsDisplay placement="sidebar" maxAds={3} />
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-12">
          <h3>Banner Ads</h3>
          <p className="text-muted">Full-width banner ads:</p>
          <AdsDisplay placement="banner" maxAds={1} />
        </div>
      </div>
    </div>
  );
}