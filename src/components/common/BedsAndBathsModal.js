"use client";
import React, { useState, useEffect } from 'react';

const BedsAndBathsModal = ({ 
  isOpen, 
  onClose, 
  selectedBedrooms = 0,
  selectedBathrooms = 0,
  onSelectionChange 
}) => {
  const [bedrooms, setBedrooms] = useState(selectedBedrooms);
  const [bathrooms, setBathrooms] = useState(selectedBathrooms);

  const bedroomsOptions = [
    { id: "bed-any", label: "Any", value: 0 },
    { id: "bed-studio", label: "Studio", value: 0 },
    { id: "bed-1", label: "1+", value: 1 },
    { id: "bed-2", label: "2+", value: 2 },
    { id: "bed-3", label: "3+", value: 3 },
    { id: "bed-4", label: "4+", value: 4 },
    { id: "bed-5", label: "5+", value: 5 },
  ];

  const bathroomsOptions = [
    { id: "bath-any", label: "Any", value: 0 },
    { id: "bath-1", label: "1+", value: 1 },
    { id: "bath-2", label: "2+", value: 2 },
    { id: "bath-3", label: "3+", value: 3 },
    { id: "bath-4", label: "4+", value: 4 },
    { id: "bath-5", label: "5+", value: 5 },
  ];

  useEffect(() => {
    setBedrooms(selectedBedrooms);
    setBathrooms(selectedBathrooms);
  }, [selectedBedrooms, selectedBathrooms]);

  const handleReset = () => {
    setBedrooms(0);
    setBathrooms(0);
  };

  const handleDone = () => {
    onSelectionChange(bedrooms, bathrooms);
    onClose();
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
              Beds & Baths
            </h6>
            <button 
              onClick={onClose}
              className="btn-close"
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>

        {/* Bedrooms Section */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 text-headings" style={{ fontSize: '16px' }}>
            Bedrooms
          </h6>
          <div className="row g-2">
            {bedroomsOptions.map((option) => (
              <div key={option.id} className="col-4">
                <button
                  type="button"
                  className={`btn w-100 rounded-pill px-3 py-2 border ${
                    bedrooms === option.value 
                      ? "btn-theme-success text-white border-success" 
                      : "bg-light text-dark border-light hover:bg-gray-100"
                  }`}
                  onClick={() => setBedrooms(option.value)}
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    minHeight: '42px'
                  }}
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bathrooms Section */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 text-headings" style={{ fontSize: '16px' }}>
            Bathrooms
          </h6>
          <div className="row g-2">
            {bathroomsOptions.map((option) => (
              <div key={option.id} className="col-4">
                <button
                  type="button"
                  className={`btn w-100 rounded-pill px-3 py-2 border ${
                    bathrooms === option.value 
                      ? "btn-theme-success text-white border-success" 
                      : "bg-light text-dark border-light hover:bg-gray-100"
                  }`}
                  onClick={() => setBathrooms(option.value)}
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    minHeight: '42px'
                  }}
                >
                  {option.label}
                </button>
              </div>
            ))}
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

        {/* Selected count */}
        {(bedrooms > 0 || bathrooms > 0) && (
          <div className="text-center mt-3">
            <small className="text-muted">
              {bedrooms > 0 ? `${bedrooms} Bedroom${bedrooms > 1 ? 's' : ''}` : 'Any Bedrooms'}
              {' & '}
              {bathrooms > 0 ? `${bathrooms} Bathroom${bathrooms > 1 ? 's' : ''}` : 'Any Bathrooms'}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedsAndBathsModal;
