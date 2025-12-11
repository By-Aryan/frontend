"use client";
import { useState, useEffect } from 'react';
import AdsDisplay from '@/components/common/AdsDisplay';

export default function TestAdsRefresh() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [cacheInfo, setCacheInfo] = useState('');

  useEffect(() => {
    // Check localStorage on mount
    const checkCache = () => {
      const sidebarCache = localStorage.getItem('ads_sidebar');
      const bannerCache = localStorage.getItem('ads_banner');
      
      setCacheInfo(`
        Sidebar Cache: ${sidebarCache ? `${JSON.parse(sidebarCache).length} ads` : 'Empty'}
        Banner Cache: ${bannerCache ? `${JSON.parse(bannerCache).length} ads` : 'Empty'}
      `);
    };
    
    checkCache();
    
    // Update cache info every 2 seconds
    const interval = setInterval(checkCache, 2000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    window.location.reload();
  };

  const clearCache = () => {
    localStorage.removeItem('ads_sidebar');
    localStorage.removeItem('ads_banner');
    setCacheInfo('Cache cleared!');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1>Ads Refresh Test Page</h1>
          <p className="text-muted">Test karo ki ads refresh ke baad visible hain ya nahi</p>
          
          <div className="alert alert-info mb-4">
            <h5>Cache Status:</h5>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{cacheInfo}</pre>
            <p className="mb-2"><strong>Refresh Count:</strong> {refreshCount}</p>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleRefresh}>
                🔄 Refresh Page
              </button>
              <button className="btn btn-danger" onClick={clearCache}>
                🗑️ Clear Cache & Refresh
              </button>
            </div>
          </div>

          <div className="alert alert-warning">
            <h6>Instructions:</h6>
            <ol>
              <li>Pehle ads load hone do (niche dekho)</li>
              <li>"Refresh Page" button click karo</li>
              <li>Dekho ki ads immediately visible hain ya nahi</li>
              <li>Console logs check karo (F12)</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Main Content Area</h5>
            </div>
            <div className="card-body">
              <p>Yeh main content area hai. Sidebar me ads dikhne chahiye.</p>
              <div style={{ height: '400px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3>Content Area</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Sidebar Ads</h5>
            </div>
            <div className="card-body">
              <div style={{ border: '3px dashed #28a745', padding: '10px', minHeight: '400px' }}>
                <p className="text-muted small mb-3">👇 Ads should appear below 👇</p>
                <AdsDisplay placement="sidebar" maxAds={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="mb-0">Banner Ads</h5>
            </div>
            <div className="card-body">
              <div style={{ border: '3px dashed #ffc107', padding: '10px' }}>
                <p className="text-muted small mb-3">👇 Banner ad should appear below 👇</p>
                <AdsDisplay placement="banner" maxAds={1} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 mb-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Console Logs</h5>
            </div>
            <div className="card-body">
              <p>Browser console (F12) me yeh logs dikhne chahiye:</p>
              <ul>
                <li><code>[AdsDisplay sidebar] Cache check: Found/Not found</code></li>
                <li><code>[AdsDisplay sidebar] Loaded X cached ads</code></li>
                <li><code>[AdsDisplay] Fetched ads data</code></li>
                <li><code>[AdsDisplay] Filtered ads (X)</code></li>
              </ul>
              <p className="text-danger mb-0">
                <strong>Agar koi error dikhe toh screenshot bhejo!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
