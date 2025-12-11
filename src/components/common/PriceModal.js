"use client";
import React, { useState, useEffect } from 'react';

const PriceModal = ({ 
  isOpen, 
  onClose, 
  selectedMinPrice = "",
  selectedMaxPrice = "",
  onSelectionChange 
}) => {
  const [minPrice, setMinPrice] = useState(selectedMinPrice);
  const [maxPrice, setMaxPrice] = useState(selectedMaxPrice);

  // Predefined price ranges for quick selection
  const priceRanges = [
    { label: "Under 500K", min: 0, max: 500000 },
    { label: "500K - 1M", min: 500000, max: 1000000 },
    { label: "1M - 2M", min: 1000000, max: 2000000 },
    { label: "2M - 5M", min: 2000000, max: 5000000 },
    { label: "5M - 10M", min: 5000000, max: 10000000 },
    { label: "Over 10M", min: 10000000, max: "" },
  ];

  useEffect(() => {
    setMinPrice(selectedMinPrice);
    setMaxPrice(selectedMaxPrice);
  }, [selectedMinPrice, selectedMaxPrice]);

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const handlePriceRangeSelect = (range) => {
    setMinPrice(range.min.toString());
    setMaxPrice(range.max ? range.max.toString() : "");
  };

  const handleDone = () => {
    onSelectionChange(minPrice, maxPrice);
    onClose();
  };

  const formatPrice = (price) => {
    if (!price) return "";
    const num = parseInt(price);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    }
    return num.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="modal-content bg-white rounded-lg p-4" style={{
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        zIndex: 999999
      }}>
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0" style={{ fontSize: '18px', fontWeight: '600' }}>
              Price Range (AED)
            </h6>
            <button 
              onClick={onClose}
              className="btn-close"
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>

        {/* Custom Price Inputs */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3" style={{ fontSize: '16px', color: '#374151' }}>
            Custom Range
          </h6>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#374151' }}>
                Minimum Price
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ 
                  fontSize: '14px',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0f8363';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 131, 99, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#374151' }}>
                Maximum Price
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ 
                  fontSize: '14px',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0f8363';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 131, 99, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Price Ranges */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3" style={{ fontSize: '16px', color: '#374151' }}>
            Quick Selection
          </h6>
          <div className="row g-2">
            {priceRanges.map((range, index) => {
              const isSelected = minPrice === range.min.toString() && 
                               maxPrice === (range.max ? range.max.toString() : "");
              return (
                <div key={index} className="col-6">
                  <button
                    type="button"
                    className={`btn w-100 rounded-pill px-3 py-2 border ${
                      isSelected 
                        ? "btn-theme-success text-white border-success" 
                        : "bg-light text-dark border-light hover:bg-gray-100"
                    }`}
                    onClick={() => handlePriceRangeSelect(range)}
                    style={{ 
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      minHeight: '42px'
                    }}
                  >
                    {range.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="d-flex justify-content-between gap-3">
          <button 
            onClick={handleReset}
            className="btn btn-outline-secondary flex-fill"
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            Reset
          </button>
          <button 
            onClick={handleDone}
            className="btn btn-success flex-fill"
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            Done
          </button>
        </div>

        {/* Selected range display */}
        {(minPrice || maxPrice) && (
          <div className="text-center mt-3">
            <small className="text-muted">
              Range: {minPrice ? `AED ${formatPrice(minPrice)}` : 'Any'} - {maxPrice ? `AED ${formatPrice(maxPrice)}` : 'Any'}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceModal;
