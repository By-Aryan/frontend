"use client";
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ViewContactButton = ({ propertyId, className = '', variant = 'primary' }) => {
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  const handleViewContact = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to view contact details');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `${API_BASE_URL}/property/view-contact/${propertyId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setContactInfo(response.data.data.contactInfo);
        setShowModal(true);
        toast.success(`Contact details revealed! ${response.data.data.remainingViews} views remaining.`);
      }
    } catch (error) {
      if (error.response?.data?.code === 'LIMIT_EXCEEDED') {
        toast.error('Contact view limit exceeded. Please upgrade your plan.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to view contact');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`btn btn-${variant} ${className}`}
        onClick={handleViewContact}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading...
          </>
        ) : (
          <>
            <i className="fas fa-eye me-2"></i>
            View Contact
          </>
        )}
      </button>

      {/* Contact Details Modal */}
      {showModal && contactInfo && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-address-book me-2"></i>
                  Contact Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="contact-info">
                  <div className="contact-item mb-3">
                    <div className="contact-label">
                      <i className="fas fa-user text-primary me-2"></i>
                      <strong>Name:</strong>
                    </div>
                    <div className="contact-value">{contactInfo.name}</div>
                  </div>
                  
                  <div className="contact-item mb-3">
                    <div className="contact-label">
                      <i className="fas fa-phone text-primary me-2"></i>
                      <strong>Phone:</strong>
                    </div>
                    <div className="contact-value">
                      <a href={`tel:${contactInfo.phone}`} className="text-decoration-none">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-item mb-3">
                    <div className="contact-label">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      <strong>Email:</strong>
                    </div>
                    <div className="contact-value">
                      <a href={`mailto:${contactInfo.email}`} className="text-decoration-none">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-item mb-3">
                    <div className="contact-label">
                      <i className="fab fa-whatsapp text-success me-2"></i>
                      <strong>WhatsApp:</strong>
                    </div>
                    <div className="contact-value">
                      <a 
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none text-success"
                      >
                        {contactInfo.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="btn btn-primary"
                >
                  <i className="fas fa-phone me-2"></i>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .contact-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid var(--color-primary);
        }

        .contact-label {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          color: #666;
        }

        .contact-value {
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
          margin-left: 24px;
        }

        .modal-content {
          border-radius: 15px;
          border: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          color: white;
          border-radius: 15px 15px 0 0;
        }

        .btn-close {
          filter: invert(1);
        }
      `}</style>
    </>
  );
};

export default ViewContactButton;