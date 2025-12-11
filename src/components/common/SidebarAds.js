"use client";
import AdsDisplay from './AdsDisplay';

const SidebarAds = ({ className = '' }) => {
  return (
    <div className={`sidebar-ads-widget ${className}`}>
      <AdsDisplay 
        placement="sidebar"
        maxAds={6}
        showTitle={true}
        responsive={true}
        className="enhanced-sidebar-ads"
      />
      
      <style jsx>{`
        .sidebar-ads-widget {
          margin-bottom: 10px;
          height: calc(100vh - 80px);
          min-height: 700px;
          display: flex;
          flex-direction: column;
        }

        .sidebar-ads-widget :global(.enhanced-sidebar-ads) {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          margin-bottom: 0;
        }

        .sidebar-ads-widget :global(.ads-container) {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .sidebar-ads-widget :global(.ads-container)::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-ads-widget :global(.ads-container)::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .sidebar-ads-widget :global(.ads-container)::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border-radius: 3px;
        }

        .sidebar-ads-widget :global(.ads-container)::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0056b3, #004085);
        }

        .sidebar-ads-widget :global(.ad-item) {
          min-height: 280px;
          margin-bottom: 25px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #e9ecef;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          border-radius: 15px;
          padding: 20px;
          position: relative;
        }

        .sidebar-ads-widget :global(.ad-image),
        .sidebar-ads-widget :global(.ad-image-fallback) {
          height: 180px !important;
          border-radius: 12px;
        }

        .sidebar-ads-widget :global(.ad-image-fallback) {
          font-size: 48px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
        }

        .sidebar-ads-widget :global(.ad-title) {
          font-size: 20px !important;
          font-weight: bold;
          margin-bottom: 12px;
          color: #2c3e50;
          line-height: 1.3;
        }

        .sidebar-ads-widget :global(.ad-description) {
          font-size: 16px !important;
          line-height: 1.5;
          color: #5a6c7d;
          margin-bottom: 18px;
        }

        .sidebar-ads-widget :global(.ad-cta) {
          padding: 15px 25px !important;
          font-size: 16px !important;
          font-weight: bold;
          background: linear-gradient(135deg, #007bff, #0056b3) !important;
          border: none;
          color: white;
          border-radius: 25px;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }



        .sidebar-ads-widget :global(.ads-display) {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          height: 100%;
        }

        .sidebar-ads-widget :global(.ads-header) {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
        }

        .sidebar-ads-widget :global(.ads-header h6) {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .sidebar-ads-widget {
            height: auto;
            min-height: 500px;
            max-height: 80vh;
          }
          
          .sidebar-ads-widget :global(.ad-item) {
            min-height: 180px;
          }
          
          .sidebar-ads-widget :global(.ad-image),
          .sidebar-ads-widget :global(.ad-image-fallback) {
            height: 120px !important;
          }
        }

        @media (max-width: 991px) {
          .sidebar-ads-widget {
            height: auto;
            min-height: auto;
            margin-bottom: 20px;
          }

          .sidebar-ads-widget :global(.ads-container) {
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            gap: 15px;
            padding-bottom: 15px;
          }

          .sidebar-ads-widget :global(.ad-item) {
            flex: none;
            min-width: 280px;
            min-height: 180px;
            margin-bottom: 0;
            margin-right: 15px;
          }

          .sidebar-ads-widget :global(.ad-image),
          .sidebar-ads-widget :global(.ad-image-fallback) {
            height: 100px !important;
          }

          .sidebar-ads-widget :global(.ad-title) {
            font-size: 16px !important;
          }

          .sidebar-ads-widget :global(.ad-description) {
            font-size: 13px !important;
          }
        }

        @media (max-width: 768px) {
          .sidebar-ads-widget :global(.ads-display) {
            padding: 20px;
            border-radius: 12px;
          }

          .sidebar-ads-widget :global(.ad-item) {
            min-width: 250px;
            min-height: 160px;
            padding: 15px;
          }

          .sidebar-ads-widget :global(.ad-image),
          .sidebar-ads-widget :global(.ad-image-fallback) {
            height: 90px !important;
          }

          .sidebar-ads-widget :global(.ad-title) {
            font-size: 15px !important;
          }

          .sidebar-ads-widget :global(.ad-description) {
            font-size: 12px !important;
            margin-bottom: 12px;
          }

          .sidebar-ads-widget :global(.ad-cta) {
            padding: 10px 16px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 576px) {
          .sidebar-ads-widget :global(.ads-display) {
            padding: 15px;
            margin: 10px;
          }

          .sidebar-ads-widget :global(.ad-item) {
            min-width: 220px;
            min-height: 150px;
            padding: 12px;
          }

          .sidebar-ads-widget :global(.ad-image),
          .sidebar-ads-widget :global(.ad-image-fallback) {
            height: 80px !important;
          }

          .sidebar-ads-widget :global(.ads-header h6) {
            font-size: 16px;
          }
        }

        /* Animation for loading */
        .sidebar-ads-widget :global(.ad-item) {
          animation: slideInUp 0.6s ease-out;
        }

        .sidebar-ads-widget :global(.ad-item):nth-child(2) {
          animation-delay: 0.1s;
        }

        .sidebar-ads-widget :global(.ad-item):nth-child(3) {
          animation-delay: 0.2s;
        }

        .sidebar-ads-widget :global(.ad-item):nth-child(4) {
          animation-delay: 0.3s;
        }

        .sidebar-ads-widget :global(.ad-item):nth-child(5) {
          animation-delay: 0.4s;
        }

        .sidebar-ads-widget :global(.ad-item):nth-child(6) {
          animation-delay: 0.5s;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarAds;