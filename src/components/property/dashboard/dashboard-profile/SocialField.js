"use client"
import { useEffect, useState } from "react";

const SocialField = ({ data, onChange, handleSubmit }) => {
  const [localData, setLocalData] = useState(data);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setLocalData(data);
    
    // Validate initial data if present
    if (data) {
      const initialErrors = {};
      
      Object.entries(data).forEach(([key, value]) => {
        if (value && !isValidUrl(value)) {
          const suggestion = getSuggestion(key, value);
          initialErrors[key] = {
            error: "Invalid URL format",
            suggestion: suggestion
          };
        }
      });
      
      setErrors(initialErrors);
    }
  }, [data]);
  
  // URL Validation Regex
  const isValidUrl = (url) => {
    // Return true if URL is empty (making it optional)
    if (!url || url.trim() === "") return true;
    
    // More permissive URL pattern that accepts common social media formats
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(:\d+)?(\/.*)?$/i;
    return urlPattern.test(url);
  };
  
  // Get suggestion based on field type
  const getSuggestion = (fieldName, value) => {
    if (!value || value.trim() === "") return null;
    
    // Basic suggestions for common mistakes
    if (!value.includes('.')) {
      return `Suggestion: Include domain like "https://${fieldName}.com"`;
    }
    
    // Platform specific suggestions
    switch(fieldName) {
      case 'facebook':
        return 'Example: https://facebook.com/yourprofile or facebook.com/yourprofile';
      case 'instagram':
        return 'Example: https://instagram.com/yourusername or instagram.com/yourusername';
      case 'twitter':
        return 'Example: https://twitter.com/yourusername or twitter.com/yourusername';
      case 'linkedin':
        return 'Example: https://linkedin.com/in/yourprofile or linkedin.com/in/yourprofile';
      default:
        return 'Format should be: website.com/yourpage';
    }
  };
  
  // Validate Form
  const validateForm = () => {
    let newErrors = {};
    
    // Check each social media URL
    if (localData.facebook && !isValidUrl(localData.facebook)) {
      const suggestion = getSuggestion('facebook', localData.facebook);
      newErrors.facebook = {
        error: "Invalid URL format",
        suggestion: suggestion
      };
    }
    
    if (localData.instagram && !isValidUrl(localData.instagram)) {
      const suggestion = getSuggestion('instagram', localData.instagram);
      newErrors.instagram = {
        error: "Invalid URL format",
        suggestion: suggestion
      };
    }
    
    if (localData.twitter && !isValidUrl(localData.twitter)) {
      const suggestion = getSuggestion('twitter', localData.twitter);
      newErrors.twitter = {
        error: "Invalid URL format",
        suggestion: suggestion
      };
    }
    
    if (localData.linkedin && !isValidUrl(localData.linkedin)) {
      const suggestion = getSuggestion('linkedin', localData.linkedin);
      newErrors.linkedin = {
        error: "Invalid URL format",
        suggestion: suggestion
      };
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...localData, [name]: value };
    setLocalData(updatedData);
    
    // Validate this field in real-time
    if (value && !isValidUrl(value)) {
      const suggestion = getSuggestion(name, value);
      setErrors(prev => ({
        ...prev, 
        [name]: {
          error: "Invalid URL format",
          suggestion: suggestion
        }
      }));
    } else {
      setErrors(prev => ({...prev, [name]: null}));
    }
    
    onChange(updatedData); // Send data back to parent
  };
  
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    
    // Final validation before submitting
    if (validateForm()) {
      console.log("Form validation passed!");
      handleSubmit(localData); // Pass validated data to parent handler
    } else {
      console.log("Form validation failed:", errors);
      // Form submission is prevented due to validation errors
    }
  };

  return (
    <form className="form-style1 responsive-form" onSubmit={handleLocalSubmit}>
      <div className="mobile-form-row">
        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              <i className="fab fa-facebook-f me-2" style={{ color: '#1877f2' }}></i>
              Facebook URL
            </label>
            <input
              type="text"
              name="facebook"
              className={`form-control responsive-form .form-input ${errors.facebook ? 'is-invalid' : ''}`}
              placeholder="https://facebook.com/yourprofile"
              value={localData?.facebook || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
            {errors.facebook && (
              <div className="mobile-mt-1">
                <p className="text-danger mb-1 small">{errors.facebook.error}</p>
                <p className="text-info small fst-italic">{errors.facebook.suggestion}</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              <i className="fab fa-instagram me-2" style={{ color: '#E4405F' }}></i>
              Instagram URL
            </label>
            <input
              type="text"
              className={`form-control responsive-form .form-input ${errors.instagram ? 'is-invalid' : ''}`}
              name="instagram"
              placeholder="https://instagram.com/yourusername"
              value={localData?.instagram || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
            {errors.instagram && (
              <div className="mobile-mt-1">
                <p className="text-danger mb-1 small">{errors.instagram.error}</p>
                <p className="text-info small fst-italic">{errors.instagram.suggestion}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              <i className="fab fa-twitter me-2" style={{ color: '#1DA1F2' }}></i>
              Twitter URL
            </label>
            <input
              type="text"
              name="twitter"
              className={`form-control responsive-form .form-input ${errors.twitter ? 'is-invalid' : ''}`}
              placeholder="https://twitter.com/yourusername"
              value={localData?.twitter || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
            {errors.twitter && (
              <div className="mobile-mt-1">
                <p className="text-danger mb-1 small">{errors.twitter.error}</p>
                <p className="text-info small fst-italic">{errors.twitter.suggestion}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-col-half">
          <div className="mobile-mb-4">
            <label className="heading-color ff-heading fw600 mobile-mb-2 d-block">
              <i className="fab fa-linkedin-in me-2" style={{ color: '#0077B5' }}></i>
              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin"
              className={`form-control responsive-form .form-input ${errors.linkedin ? 'is-invalid' : ''}`}
              placeholder="https://linkedin.com/in/yourprofile"
              value={localData?.linkedin || ''}
              onChange={handleInputChange}
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
            {errors.linkedin && (
              <div className="mobile-mt-1">
                <p className="text-danger mb-1 small">{errors.linkedin.error}</p>
                <p className="text-info small fst-italic">{errors.linkedin.suggestion}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-col-full">
          <div className="mobile-text-center tablet-text-right mobile-mt-4">
            <button 
              type="submit" 
              className="ud-btn btn-dark btn-mobile-full"
              style={{ minHeight: '48px', fontSize: '16px', fontWeight: '600' }}
            >
              Update Social Media
              <i className="fal fa-arrow-right-long ms-2" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SocialField;