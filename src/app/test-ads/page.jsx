"use client";

import { useState, useEffect } from 'react';
import PropertyAd from '@/components/listing/grid-view/grid-full-1-col-v1/PropertyAd';

export default function TestAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch ads from the API
    const fetchAds = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/ads');
        if (response.ok) {
          const data = await response.json();
          setAds(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading ads...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ad Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Ads from Database</h2>
        {ads.length === 0 ? (
          <p>No ads found in database</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div key={ad._id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{ad.title}</h3>
                <p className="text-gray-600">{ad.description}</p>
                <p className="text-sm text-gray-500">
                  Status: {ad.status}
                </p>
                <p className="text-sm text-gray-500">
                  Placement: {ad.placement}
                </p>
                <p className="text-sm text-gray-500">
                  Start Date: {new Date(ad.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  End Date: {new Date(ad.end_date).toLocaleDateString()}
                </p>
                {ad.image_url && (
                  <div className="mt-2">
                    <img 
                      src={`https://localhost:5001${ad.image_url}`} 
                      alt={ad.title} 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        console.log('Image failed to load:', ad.image_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Ad Component Test</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <PropertyAd placement="property-listing" />
        </div>
      </div>
    </div>
  );
}