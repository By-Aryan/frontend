import React, { useState, useEffect } from "react";
import useAxiosFetch from "@/hooks/useAxiosFetch";

// Custom hook for getting userId from localStorage
const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const id = localStorage.getItem("id");
      setUserId(id);
    } catch (error) {
      console.error("Failed to retrieve userId from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userId, isLoading };
};

// File validation functions
const validateFile = (file) => {
  const errors = {};
  
  if (file.type !== "application/pdf") {
    errors.propertyPDF = "Only PDF files are accepted";
  } else if (file.size > 5 * 1024 * 1024) {
    errors.propertyPDF = "File size exceeds 5MB limit";
  }
  
  return errors;
};

const PropertyTitleDeedUpload = ({ onFileSelect, externalFormErrors = {} }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previousDocs, setPreviousDocs] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [showPreviousDocs, setShowPreviousDocs] = useState(true);

  // Get user ID from localStorage
  const { userId, isLoading: userIdLoading } = useUserId();
  
  // Fetch documents only when userId is available
  const { data, isLoading, isError } = useAxiosFetch(
    userId ? `/seller/title-deed?userId=${userId}` : null
  );

  // Update previous documents when data is loaded
  useEffect(() => {
    if (data?.documentFile && userId) {
      // Transform file paths into document objects
      const documents = data.documentFile.map((filePath, index) => {
        // Extract the filename from the path
        const fileName = filePath.split('/').pop();
        
        return {
          id: index.toString(), // Use index as ID if no specific ID is available
          name: fileName,
          path: filePath,
          date: new Date().toLocaleDateString(), // Use current date if no upload date is provided
        };
      });
      
      setPreviousDocs(documents);
    }
  }, [data, userId]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newErrors = validateFile(file);

    if (Object.keys(newErrors).length === 0) {
      // Store file with additional metadata for consistency
      const fileData = {
        name: file.name,
        file: file, // Keep the actual file object for upload
        isExisting: false
      };
      setSelectedFile(fileData);
      setFormErrors({});

      // Notify parent component about the file selection
      if (onFileSelect) {
        onFileSelect(file);
      }
    } else {
      setFormErrors(newErrors);
      // Notify parent about error
      if (onFileSelect) {
        onFileSelect(null);
      }
    }
  };

  // Select a previously uploaded document
  const handleSelectPreviousDoc = (docId) => {
    const selected = previousDocs.find((doc) => doc.id === docId);
    const fileData = {
      name: selected.name,
      path: selected.path,
      isExisting: true,
      id: docId
    };
    setSelectedFile(fileData);
    setFormErrors({});

    // Notify parent that an existing document was selected
    // For existing documents, we pass null as the file since it's already uploaded
    if (onFileSelect) {
      onFileSelect(null, fileData.path);
    }
  };

  // Clear selection
  const handleCancelSelection = () => {
    setSelectedFile(null);

    // Notify parent about cleared selection
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Toggle visibility of previous documents
  const togglePreviousDocs = () => {
    setShowPreviousDocs(!showPreviousDocs);
  };

  // User loading and error states
  if (userIdLoading) {
    return <div className="loading">Loading user information...</div>;
  }

  if (!userIdLoading && !userId) {
    return <div className="error">Unable to retrieve user information. Please login again.</div>;
  }

  // Render document item
  const renderDocumentItem = (doc) => {
    const isSelected = selectedFile?.isExisting && selectedFile.id === doc.id;
    
    return (
      <div
        key={doc.id}
        className={`doc-item d-flex align-items-center p-3 mb-2 border rounded ${
          isSelected ? "bg-light" : ""
        }`}
        style={isSelected ? { borderColor: '#0f8363' } : {}}
      >
        <div className="doc-icon me-3">
          <i className="fa fa-file-pdf text-danger fs-4"></i>
        </div>
        <div className="doc-details flex-grow-1">
          <div className="doc-name fw600">{doc.name}</div>
          <div className="doc-date text-muted small">Uploaded on: {doc.date}</div>
        </div>
        <div className="doc-actions">
          <button
            type="button"
            className={`btn btn-sm`}
            style={{
              background: isSelected ? 'linear-gradient(135deg, #0f8363 0%, #0a6b52 100%)' : 'transparent',
              color: isSelected ? 'white' : '#0f8363',
              border: `1.5px solid #0f8363`,
              fontWeight: 600
            }}
            onClick={() => handleSelectPreviousDoc(doc.id)}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    );
  };

  // Render selected file notification
  const renderSelectedFileNotification = () => {
    if (!selectedFile) return null;
    
    return (
      <div className="alert alert-success mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <i className="fa fa-check-circle me-2"></i>
            {selectedFile.isExisting ? "Using previously uploaded document: " : "Selected new document: "}
            <strong>{selectedFile.name}</strong>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleCancelSelection}
          >
            {selectedFile.isExisting ? "Cancel Selection" : "Cancel Upload"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="property-document-section">
      {/* Loading state */}
      {isLoading && <div className="loading">Loading documents...</div>}
      
      {/* Error state */}
      {isError && (
        <div className="alert alert-danger">
          Error loading documents. Please try again later.
        </div>
      )}
      
      {/* Previous documents section */}
      {!isLoading && !isError && previousDocs.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="heading-color ff-heading fw600">Previously Uploaded Documents</h4>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: 'transparent',
                color: '#0f8363',
                border: '1.5px solid #0f8363',
                fontWeight: 600
              }}
              onClick={togglePreviousDocs}
            >
              {showPreviousDocs ? "Hide" : "Show"} Documents
            </button>
          </div>

          {/* Previous documents list */}
          {showPreviousDocs && (
            <div className="previous-docs-container mt-3">
              {previousDocs.map(renderDocumentItem)}
            </div>
          )}

          {/* Selected previous document notification */}
          {selectedFile && selectedFile.isExisting && renderSelectedFileNotification()}

          {/* Separator */}
          <div className="mt-3 mb-4">
            <div className="separator text-center">
              <span className="bg-white px-3 text-muted">OR</span>
            </div>
          </div>
        </div>
      )}

      {/* File upload section */}
      <div className="col-lg-12">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            {previousDocs.length > 0
              ? "Upload New Property Title-Deed PDF"
              : "Upload Property Title-Deed PDF"}
          </label>
          <input
            type="file"
            className={`form-control ${(formErrors.propertyPDF || externalFormErrors.propertyPDF) ? "is-invalid" : ""}`}
            name="propertyPDF"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={selectedFile && selectedFile.isExisting}
          />
          {(formErrors.propertyPDF || externalFormErrors.propertyPDF) && (
            <div className="invalid-feedback">{formErrors.propertyPDF || externalFormErrors.propertyPDF}</div>
          )}

          {/* Selected new file notification */}
          {selectedFile && !selectedFile.isExisting && renderSelectedFileNotification()}
        </div>
      </div>
    </div>
  );
};

export default PropertyTitleDeedUpload;