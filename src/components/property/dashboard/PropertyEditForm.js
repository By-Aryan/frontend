"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './PropertyEditForm.module.css';

const PropertyEditForm = ({ property, onSave, saving }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    category: '',
    price: '',
    currency: 'AED',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    furnished: '',
    location: {
      address: '',
      area: '',
      city: '',
      emirate: '',
      country: 'UAE'
    },
    amenities: [],
    features: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      whatsapp: ''
    }
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Property types and categories
  const propertyTypes = [
    'apartment',
    'villa',
    'townhouse',
    'penthouse',
    'studio',
    'duplex',
    'compound',
    'office',
    'shop',
    'warehouse',
    'land',
    'building'
  ];

  const categories = [
    'sale',
    'rent',
    'commercial-sale',
    'commercial-rent'
  ];

  const emirates = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain'
  ];

  const commonAmenities = [
    'Swimming Pool',
    'Gym',
    'Parking',
    'Security',
    'Garden',
    'Balcony',
    'Elevator',
    'Central AC',
    'Maid Room',
    'Storage Room',
    'Built-in Wardrobes',
    'Kitchen Appliances',
    'Laundry Room',
    'Study Room',
    'Maids Bathroom',
    'Powder Room',
    'Walk-in Closet',
    'Private Garden',
    'Private Pool',
    'Jacuzzi',
    'Sauna',
    'Steam Room',
    'Barbecue Area',
    'Children Play Area',
    'Tennis Court',
    'Basketball Court',
    'Jogging Track',
    'Concierge Service',
    '24/7 Security',
    'CCTV',
    'Intercom',
    'Maintenance',
    'Cleaning Services',
    'Pet Friendly',
    'Furnished',
    'Semi Furnished',
    'Unfurnished'
  ];

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        propertyType: property.propertyType || '',
        category: property.category || '',
        price: property.price || '',
        currency: property.currency || 'AED',
        area: property.area || '',
        areaUnit: property.areaUnit || 'sqft',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        parking: property.parking || '',
        furnished: property.furnished || '',
        location: {
          address: property.location?.address || '',
          area: property.location?.area || '',
          city: property.location?.city || '',
          emirate: property.location?.emirate || '',
          country: property.location?.country || 'UAE'
        },
        amenities: property.amenities || [],
        features: property.features || [],
        contactInfo: {
          name: property.contactInfo?.name || '',
          phone: property.contactInfo?.phone || '',
          email: property.contactInfo?.email || '',
          whatsapp: property.contactInfo?.whatsapp || ''
        }
      });

      // Set existing images
      if (property.images) {
        const images = [];
        if (property.images.mainImage) {
          images.push({ ...property.images.mainImage, type: 'main' });
        }
        if (property.images.gallery) {
          images.push(...property.images.gallery.map(img => ({ ...img, type: 'gallery' })));
        }
        setExistingImages(images);
      }
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img._id !== imageId));
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Property title is required');
      return;
    }
    
    if (!formData.propertyType) {
      toast.error('Property type is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    
    if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    
    // Add text fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item, index) => {
            submitData.append(`${key}[${index}]`, item);
          });
        } else {
          Object.keys(formData[key]).forEach(subKey => {
            submitData.append(`${key}.${subKey}`, formData[key][subKey]);
          });
        }
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add new images
    newImages.forEach((file, index) => {
      submitData.append('images', file);
    });

    // Add images to delete
    imagesToDelete.forEach((imageId, index) => {
      submitData.append(`deleteImages[${index}]`, imageId);
    });

    onSave(submitData);
  };

  return (
    <div className="css-module-wrapper">
      <div className={styles.propertyEditForm}>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Basic Information */}
            <div className="col-12">
              <div className={`card ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Property Title *</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive property title"
                      required
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Property Type *</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Property Type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <label className={`form-label ${styles.formLabel}`}>Category *</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Description</label>
                    <textarea
                      className={`form-control ${styles.formControl}`}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="Describe your property in detail - highlight key features, location benefits, and unique selling points"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="col-12">
            <div className={`card mb-4 ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Pricing & Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Price *</label>
                    <div className={`input-group ${styles.inputGroup}`}>
                      <select
                        className={`form-select ${styles.formSelect}`}
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        style={{ maxWidth: '120px' }}
                      >
                        <option value="AED">AED</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                      <input
                        type="number"
                        className={`form-control ${styles.formControl}`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price amount"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Area</label>
                    <div className={`input-group ${styles.inputGroup}`}>
                      <input
                        type="number"
                        className={`form-control ${styles.formControl}`}
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="Enter area size"
                      />
                      <select
                        className={`form-select ${styles.formSelect}`}
                        name="areaUnit"
                        value={formData.areaUnit}
                        onChange={handleInputChange}
                        style={{ maxWidth: '120px' }}
                      >
                        <option value="sqft">Sq Ft</option>
                        <option value="sqm">Sq M</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-4 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Bedrooms</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="0">Studio</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-4 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Bathrooms</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-4 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Parking</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="parking"
                      value={formData.parking}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="0">No Parking</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} Space{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Furnished</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="furnished"
                      value={formData.furnished}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-furnished">Semi Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="col-12">
            <div className={`card mb-4 ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Location</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Address</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      placeholder="Enter full street address"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Area</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="location.area"
                      value={formData.location.area}
                      onChange={handleInputChange}
                      placeholder="Enter area/neighborhood"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>City</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Emirate</label>
                    <select
                      className={`form-select ${styles.formSelect}`}
                      name="location.emirate"
                      value={formData.location.emirate}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Emirate</option>
                      {emirates.map(emirate => (
                        <option key={emirate} value={emirate}>{emirate}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Country</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="col-12">
            <div className={`card mb-4 ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Amenities</h5>
              </div>
              <div className="card-body">
                <div className={styles.amenitiesGrid}>
                  {commonAmenities.map(amenity => (
                    <div key={amenity} className={styles.amenityItem}>
                      <div className="form-check">
                        <input
                          className={`form-check-input ${styles.formCheckInput}`}
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <label className={`form-check-label ${styles.formCheckLabel}`} htmlFor={`amenity-${amenity}`}>
                          {amenity}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="col-12">
            <div className={`card mb-4 ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Images</h5>
              </div>
              <div className="card-body">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <h6>Current Images</h6>
                    <div className="row">
                      {existingImages.map((image, index) => (
                        <div key={image._id} className="col-6 col-md-3 mb-3">
                          <div className={`position-relative ${styles.imagePreview}`}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001'}${image.url}`}
                              alt={image.alt || 'Property image'}
                              className="img-fluid"
                              style={{ height: '180px', objectFit: 'cover', width: '100%' }}
                            />
                            <button
                              type="button"
                              className={styles.deleteImageBtn}
                              onClick={() => removeExistingImage(image._id)}
                              title="Delete image"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                            {image.type === 'main' && (
                              <span className={`badge position-absolute bottom-0 start-0 m-2 ${styles.badgePrimary}`}>
                                Main Image
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImages.length > 0 && (
                  <div className="mb-4">
                    <h6>New Images to Upload</h6>
                    <div className="row">
                      {newImages.map((file, index) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                          <div className={`position-relative ${styles.imagePreview}`}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New image ${index + 1}`}
                              className="img-fluid"
                              style={{ height: '180px', objectFit: 'cover', width: '100%' }}
                            />
                            <button
                              type="button"
                              className={styles.deleteImageBtn}
                              onClick={() => removeNewImage(index)}
                              title="Remove image"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                            <span className={`badge position-absolute bottom-0 start-0 m-2`} style={{ background: '#28a745' }}>
                              New
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div className={`mb-4 ${styles.imageUploadSection}`}>
                  <label className={`form-label ${styles.formLabel}`}>Add New Images</label>
                  <input
                    type="file"
                    className={`form-control ${styles.formControl}`}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <small className="form-text text-muted mt-2">
                    📸 Select multiple high-quality images. Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-12">
            <div className={`card mb-4 ${styles.card}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className="mb-0">Contact Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Contact Name</label>
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      name="contactInfo.name"
                      value={formData.contactInfo.name}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${styles.formControl}`}
                      name="contactInfo.phone"
                      value={formData.contactInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Email</label>
                    <input
                      type="email"
                      className={`form-control ${styles.formControl}`}
                      name="contactInfo.email"
                      value={formData.contactInfo.email}
                      onChange={handleInputChange}
                      placeholder="contact@example.com"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className={`form-label ${styles.formLabel}`}>WhatsApp</label>
                    <input
                      type="tel"
                      className={`form-control ${styles.formControl}`}
                      name="contactInfo.whatsapp"
                      value={formData.contactInfo.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="col-12">
            <div className={`card ${styles.card}`}> 
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 justify-content-between">
                  <button
                    type="button"
                    className={`btn btn-secondary ${styles.btnSecondary} w-100 w-md-auto mb-2 mb-md-0`}
                    onClick={() => window.history.back()}
                    disabled={saving}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.btnPrimary} w-100 w-md-auto`}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Update Property
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PropertyEditForm;