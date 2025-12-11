import Link from "next/link";
import React from "react";

const ChangePasswordForm = () => {
  return (
    <div className="responsive-form">
      <div className="mobile-form-row">
        <div className="form-col-full">
          <div className="mobile-mb-4">
            <div className="d-flex align-items-center mobile-mb-3">
              <i className="fas fa-lock me-2" style={{ color: '#6c757d' }}></i>
              <span className="text-responsive-base">Password Security</span>
            </div>
            <p className="text-muted mobile-mb-4" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              For security reasons, password changes are handled through our secure verification system. 
              This ensures your account remains protected.
            </p>
          </div>
        </div>
        
        <div className="form-col-full">
          <div className="mobile-text-center tablet-text-right">
            <Link 
              href="/verification/verify-email" 
              className="ud-btn btn-dark btn-mobile-full"
              style={{ 
                minHeight: '48px', 
                fontSize: '16px', 
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <i className="fas fa-shield-alt me-2"></i>
              Change Password Securely
              <i className="fal fa-arrow-right-long ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
