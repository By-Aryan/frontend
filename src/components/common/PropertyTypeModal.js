"use client";
import React, { useState, useEffect } from 'react';

const PropertyTypeModal = ({ 
  isOpen, 
  onClose, 
  category = "residential", 
  selectedTypes = [], 
  onSelectionChange 
}) => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(selectedTypes);
  const [activeCategory, setActiveCategory] = useState(category);

  // Property type options based on category
  const getPropertyTypes = (category) => {
    if (category === 'residential') {
      return [
        { value: "Apartment", label: "Apartment" },
        { value: "Villa", label: "Villa" },
        { value: "Townhouse", label: "Townhouse" },
        { value: "Penthouse", label: "Penthouse" },
        { value: "Villa Compound", label: "Villa Compound" },
        { value: "Hotel Apartment", label: "Hotel Apartment" }
      ];
    } else {
      return [
        { value: "Land", label: "Land" },
        { value: "Floor", label: "Floor" },
        { value: "Building", label: "Building" },
        { value: "Office", label: "Office" },
        { value: "Retail", label: "Retail" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Shop", label: "Shop" },
        { value: "Showroom", label: "Showroom" }
      ];
    }
  };

  const propertyTypes = getPropertyTypes(activeCategory);

  useEffect(() => {
    setSelectedPropertyTypes(selectedTypes);
    setActiveCategory(category);
  }, [selectedTypes, category]);

  const handleTypeToggle = (typeValue) => {
    const updated = selectedPropertyTypes.includes(typeValue)
      ? selectedPropertyTypes.filter(type => type !== typeValue)
      : [...selectedPropertyTypes, typeValue];
    
    setSelectedPropertyTypes(updated);
  };

  const handleReset = () => {
    setSelectedPropertyTypes([]);
  };

  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory);
    // Reset selections when switching categories
    setSelectedPropertyTypes([]);
  };

  const handleDone = () => {
    onSelectionChange(selectedPropertyTypes, activeCategory);
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
        {/* Header with Tabs */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0" style={{ fontSize: '18px', fontWeight: '600' }}>
              Property Type
            </h6>
            <button 
              onClick={onClose}
              className="btn-close"
              style={{ fontSize: '12px' }}
            />
          </div>
          
          {/* Category Tabs */}
          <div className="d-flex border-bottom">
            <button
              className={`btn btn-link text-decoration-none px-3 py-2 border-0 ${
                activeCategory === 'residential' 
                  ? 'text-success border-bottom border-success border-2' 
                  : 'text-muted'
              }`}
              style={{ 
                fontSize: '14px', 
                fontWeight: activeCategory === 'residential' ? '600' : '400',
                borderRadius: '0',
                backgroundColor: 'transparent'
              }}
              onClick={() => handleCategoryChange('residential')}
            >
              Residential
            </button>
            <button
              className={`btn btn-link text-decoration-none px-3 py-2 border-0 ${
                activeCategory === 'commercial' 
                  ? 'text-success border-bottom border-success border-2' 
                  : 'text-muted'
              }`}
              style={{ 
                fontSize: '14px', 
                fontWeight: activeCategory === 'commercial' ? '600' : '400',
                borderRadius: '0',
                backgroundColor: 'transparent'
              }}
              onClick={() => handleCategoryChange('commercial')}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Property Type Grid */}
        <div className="row g-3 mb-4">
          {propertyTypes.map((type) => (
            <div key={type.value} className="col-6">
              <label 
                className={`d-flex align-items-center p-3 border rounded-lg cursor-pointer ${
                  selectedPropertyTypes.includes(type.value) 
                    ? 'border-success bg-success bg-opacity-10' 
                    : 'border-light'
                }`}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px'
                }}
                onClick={() => handleTypeToggle(type.value)}
              >
                <input
                  type="checkbox"
                  checked={selectedPropertyTypes.includes(type.value)}
                  onChange={() => handleTypeToggle(type.value)}
                  className="form-check-input me-2"
                  style={{ marginTop: '2px' }}
                />
                <span className={selectedPropertyTypes.includes(type.value) ? 'text-success fw-medium' : ''}>
                  {type.label}
                </span>
              </label>
            </div>
          ))}
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
        {selectedPropertyTypes.length > 0 && (
          <div className="text-center mt-3">
            <small className="text-muted">
              {selectedPropertyTypes.length} property type{selectedPropertyTypes.length > 1 ? 's' : ''} selected
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTypeModal;
