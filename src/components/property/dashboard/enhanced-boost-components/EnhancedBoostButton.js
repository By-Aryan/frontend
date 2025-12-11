'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const EnhancedBoostButton = ({ property, onBoostClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  // Determine boost status
  const isBoosted = property.isBoosted || 
                   property.isFeatured || 
                   property.featured?.isFeatured;
  
  const expiresAt = property.boostExpiresAt || 
                   property.featuredExpiresAt || 
                   property.featured?.expiresAt;

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!expiresAt) return 0;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();

  // Check if property is eligible for boost
  const isEligible = () => {
    if (property.listing_status === 'delisted' || 
        property.listing_status === 'pending_delist') {
      return false;
    }
    if (property.approval_status?.status !== 'Approved') {
      return false;
    }
    return true;
  };

  const handleBoostClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isEligible()) {
      alert('This property is not eligible for boosting');
      return;
    }

    if (isBoosted) {
      // Show boost details instead of boosting
      setShowTooltip(!showTooltip);
      return;
    }

    setIsLoading(true);
    
    try {
      if (onBoostClick) {
        await onBoostClick(property._id);
      } else {
        router.push(`/seller-pricing/${property._id}`);
      }
    } catch (error) {
      console.error('Boost error:', error);
      alert('Failed to initiate boost. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If property is boosted, show status
  if (isBoosted) {
    return (
      <div className="position-relative">
        <button
          onClick={handleBoostClick}
          className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
          style={{
            width: "80px",
            height: "32px",
            padding: "0",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "600"
          }}
          title={`Boosted - ${daysRemaining} days remaining`}
        >
          <i className="fas fa-rocket me-1" style={{ fontSize: "10px" }}></i>
          {daysRemaining}d
        </button>
        
        {showTooltip && (
          <div 
            className="position-absolute bg-dark text-white p-2 rounded shadow"
            style={{
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            <div>🚀 Property is boosted</div>
            <div>⏰ Expires: {new Date(expiresAt).toLocaleDateString()}</div>
            <div>📊 {daysRemaining} days remaining</div>
            <div 
              className="position-absolute"
              style={{
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid #000'
              }}
            ></div>
          </div>
        )}
      </div>
    );
  }

  // If not eligible, show disabled state
  if (!isEligible()) {
    return (
      <button
        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
        style={{
          width: "32px",
          height: "32px",
          padding: "0",
          borderRadius: "4px",
          cursor: "not-allowed",
          opacity: 0.5
        }}
        disabled
        title="Property not eligible for boosting"
      >
        <i className="fas fa-ban" style={{ fontSize: "12px" }}></i>
      </button>
    );
  }

  // Regular boost button
  return (
    <button
      onClick={handleBoostClick}
      disabled={isLoading}
      className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center position-relative"
      style={{
        width: "32px",
        height: "32px",
        padding: "0",
        border: "2px solid #ffc107",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        background: isLoading ? '#fff3cd' : 'transparent'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#fff3cd';
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.transform = 'scale(1)';
      }}
      title="Boost this property for better visibility"
    >
      {isLoading ? (
        <div 
          className="spinner-border spinner-border-sm text-warning" 
          style={{ width: '14px', height: '14px' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <i 
          className="fas fa-rocket" 
          style={{ 
            fontSize: "14px",
            color: '#ffc107'
          }}
        ></i>
      )}
      
      {/* Pulse animation for better visibility */}
      <div 
        className="position-absolute"
        style={{
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          border: '2px solid #ffc107',
          borderRadius: '6px',
          animation: 'pulse 2s infinite',
          opacity: 0.3
        }}
      ></div>
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </button>
  );
};

export default EnhancedBoostButton;