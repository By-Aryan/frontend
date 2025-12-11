'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestMenuPage() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';
        console.log('🔍 TestMenu: Fetching from:', `${API_BASE_URL}/property/header-menu-city-counts`);
        
        const response = await axios.get(`${API_BASE_URL}/property/header-menu-city-counts`);
        console.log('🔍 TestMenu: Response:', response.data);
        
        setApiData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ TestMenu: Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 Menu API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>API Response:</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
          {JSON.stringify(apiData, null, 2)}
        </pre>
      </div>

      {apiData?.success && (
        <div>
          <h2>Expected Menu Structure:</h2>
          
          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <h3>🏠 Buy Menu</h3>
            <ul>
              {apiData.data.headerCities.map((city, index) => (
                <li key={index} style={{ padding: '5px 0' }}>
                  📍 {city.name} ({city.count}) → /for-sale/properties/{city.name.toLowerCase().replace(/\s+/g, '-')}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <h3>🏠 Rent Menu</h3>
            <ul>
              {apiData.data.headerCities.map((city, index) => (
                <li key={index} style={{ padding: '5px 0' }}>
                  📍 {city.name} ({city.count}) → /for-rent/properties/{city.name.toLowerCase().replace(/\s+/g, '-')}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '15px' }}>
            <h3>🏗️ New Projects</h3>
            <p>No submenu - direct link to /projects-by-country/uae</p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#e8f5e8', borderRadius: '5px' }}>
        <h3>✅ Next Steps:</h3>
        <ol>
          <li>Go to <a href="https://localhost:3000" target="_blank">https://localhost:3000</a></li>
          <li>Open browser developer tools (F12)</li>
          <li>Look for console messages starting with "🔍 MainMenu:"</li>
          <li>Hover over "Buy" and "Rent" in the header navigation</li>
          <li>Check if the city counts appear in the dropdown menus</li>
        </ol>
      </div>
    </div>
  );
}