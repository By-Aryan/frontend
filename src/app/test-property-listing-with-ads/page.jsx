"use client";
import { useState } from 'react';
import PropertyFiltering from '@/components/listing/grid-view/grid-full-1-col-v1/PropertyFiltering';

// Mock property data for testing
const mockProperties = [
  {
    _id: '1',
    name: 'Luxury Apartment in Downtown',
    price: 1500000,
    location: { address: 'Downtown, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 3,
      bathrooms: 2,
      size: { value: 1200 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    },
    isFeatured: true
  },
  {
    _id: '2',
    name: 'Modern Villa with Pool',
    price: 2500000,
    location: { address: 'Palm Jumeirah, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 5,
      bathrooms: 4,
      size: { value: 3500 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    }
  },
  {
    _id: '3',
    name: 'Cozy Studio Apartment',
    price: 800000,
    location: { address: 'Business Bay, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 1,
      bathrooms: 1,
      size: { value: 600 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    }
  },
  {
    _id: '4',
    name: 'Spacious Family Home',
    price: 1800000,
    location: { address: 'Jumeirah, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 4,
      bathrooms: 3,
      size: { value: 2200 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    }
  },
  {
    _id: '5',
    name: 'Waterfront Penthouse',
    price: 3200000,
    location: { address: 'Marina, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 3,
      bathrooms: 3,
      size: { value: 1800 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    }
  },
  {
    _id: '6',
    name: 'Affordable Studio',
    price: 650000,
    location: { address: 'Deira, Dubai' },
    details: { 
      purpose: 'Sell',
      bedrooms: 1,
      bathrooms: 1,
      size: { value: 500 }
    },
    developer_notes: {
      images: [{ full_url: '/images/listings/propertiesAdsDemo.jpg' }]
    }
  }
];

export default function TestPropertyListingWithAds() {
  const [showModal, setShowModal] = useState(false);
  const [filterFunctions] = useState({
    handlelocation: () => {},
    location: ''
  });
  const [handleFilterChange] = useState(() => () => {});
  const [currentSortingOption, setCurrentSortingOption] = useState('Newest');
  const [showAll, setShowAll] = useState(false);

  // Mock locations data
  const locations = [
    { name: 'Dubai' },
    { name: 'Abu Dhabi' },
    { name: 'Sharjah' },
    { name: 'Ajman' }
  ];

  const visibleLocations = locations.slice(0, 3);

  return (
    <div className="container-fluid py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1>Property Listing with Ads Test</h1>
          <p className="text-muted">This page demonstrates property listings with integrated ads in the sidebar.</p>
          <div className="alert alert-info">
            <p className="mb-1"><strong>Note:</strong> Only active ads with valid placements will be displayed.</p>
            <p className="mb-0">If no sidebar ads are configured in the admin panel, the sidebar will be empty.</p>
          </div>
        </div>
      </div>
      
      <PropertyFiltering
        showModal={showModal}
        setShowModal={setShowModal}
        filterFunctions={filterFunctions}
        handleFilterChange={handleFilterChange}
        sortedFilteredData={mockProperties}
        filteredData={mockProperties}
        currentPage={0}
        totalRecords={mockProperties.length}
        limit={6}
        currentSortingOption={currentSortingOption}
        setCurrentSortingOption={setCurrentSortingOption}
        visibleLocations={visibleLocations}
        showAll={showAll}
        setShowAll={setShowAll}
        locations={locations}
      />
    </div>
  );
}