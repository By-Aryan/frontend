"use client";
import { useState, useEffect } from 'react';
import PropertyAd from '@/components/listing/grid-view/grid-full-1-col-v1/PropertyAd';

export default function TestPropertyAds() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Property Ads Test</h1>
      <p className="mb-4">This page tests the PropertyAd component integration.</p>
      
      <div className="row">
        <div className="col-12 mb-4">
          <h3>Property Listing Ad</h3>
          <PropertyAd placement="property-listing" />
        </div>
        
        <div className="col-12 mb-4">
          <h3>Sidebar Ad</h3>
          <PropertyAd placement="sidebar" />
        </div>
        
        <div className="col-12 mb-4">
          <h3>Banner Ad</h3>
          <PropertyAd placement="banner" />
        </div>
      </div>
    </div>
  );
}