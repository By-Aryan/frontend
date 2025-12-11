"use client"
import { useEffect, useState, useRef } from 'react';

function RequestsPendingDataTable({ data: propData }) {
  const [requestData, setRequestData] = useState([]);
  const [uploading, setUploading] = useState({});
  const [downloading, setDownloading] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (propData) {
      setRequestData(propData);
    }
  }, [propData]);

  function formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function getPropertyName(property) {
    return property?.name || property?.title || property?.propertyName || "Unknown";
  }

  function getPropertyAddress(property) {
    return property?.location?.address || property?.address || "No address available";
  }

  function getPropertyArea(property) {
    if (property?.details?.size?.value) {
      const unit = property?.details?.size?.unit || "sqft";
      return `${property.details.size.value} ${unit}`;
    }
    if (property?.area) {
      return `${property.area} sqft`;
    }
    return "Area not specified";
  }

  function getPropertyStatus(property) {
    return property?.approval_status?.status || property?.status || "Pending";
  }

  function getPropertyPurpose(property) {
    return property?.details?.purpose || property?.purpose || "Not specified";
  }

  function getStatusClass(status) {
    switch (status) {
      case "Accepted": return "text-green-600 bg-green-100";
      case "Rejected": return "text-red-600 bg-red-100";
      case "Pending":
      default:
        return "text-amber-600 bg-amber-100";
    }
  }

  function getDocumentCount(property) {
    return property?.document_count || property?.documents?.length || 0;
  }

  const handleUploadClick = (requestId) => {
    fileInputRefs.current[requestId]?.click();
  };

  const handleFileChange = async (event, requestId) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(prev => ({ ...prev, [requestId]: true }));

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('documents', file);
      });

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/requestproperty/upload-documents/${requestId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload documents');
      }

      alert(`${data.data.new_documents.length} document(s) uploaded successfully!`);

      // Update the local state with new document count
      setRequestData(prev => prev.map(prop =>
        (prop._id || prop.id) === requestId
          ? { ...prop, document_count: data.data.total_documents }
          : prop
      ));

      // Clear the file input
      if (fileInputRefs.current[requestId]) {
        fileInputRefs.current[requestId].value = '';
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert(error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDownloadDocuments = async (requestId) => {
    setDownloading(prev => ({ ...prev, [requestId]: true }));

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/request/${requestId}/download-all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download documents');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-${requestId}-documents.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading documents:', error);
      alert('Failed to download documents. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Name</th>
          <th scope="col">Documents</th>
          <th scope="col">Created Date</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {requestData?.length > 0 ? (
          requestData.map((property) => {
            const requestId = property._id || property.id;
            const docCount = getDocumentCount(property);

            return (
              <tr key={requestId}>
                <th scope="row">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title">
                        {getPropertyName(property)}
                      </div>
                      <p className="list-text mb-0">{getPropertyAddress(property)}</p>
                      <div className="list-price">
                        <a href="#">{getPropertyArea(property)}</a>
                      </div>
                    </div>
                  </div>
                </th>

                <td className="vam">
                  <div className="d-flex align-items-center gap-2">
                    <i className="flaticon-document text-primary"></i>
                    <span className="fz15 fw-medium">
                      {docCount} {docCount === 1 ? 'Doc' : 'Docs'}
                    </span>
                  </div>
                </td>

                <td className="vam">{formatDate(property?.createdAt)}</td>

                <td className="vam">
                  <p className={`w-fit rounded-full text-sm py-1 px-2 ${getStatusClass(getPropertyStatus(property))}`}>
                    {getPropertyStatus(property)}
                  </p>
                </td>

                <td className="vam">
                  <div className="d-flex gap-2 align-items-center">
                    {/* Upload Button */}
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[requestId] = el}
                      onChange={(e) => handleFileChange(e, requestId)}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      style={{ display: 'none' }}
                    />
                    <button
                      className="ud-btn btn-white2"
                      onClick={() => handleUploadClick(requestId)}
                      disabled={uploading[requestId]}
                      style={{
                        padding: '6px 12px',
                        fontSize: '13px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: uploading[requestId] ? '#f3f4f6' : '#fff',
                        cursor: uploading[requestId] ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {uploading[requestId] ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="flaticon-upload"></i>
                          Upload
                        </>
                      )}
                    </button>

                    {/* Download Button - Only show if documents exist */}
                    {docCount > 0 && (
                      <button
                        className="ud-btn btn-thm2"
                        onClick={() => handleDownloadDocuments(requestId)}
                        disabled={downloading[requestId]}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          borderRadius: '6px',
                          cursor: downloading[requestId] ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {downloading[requestId] ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <i className="flaticon-download"></i>
                            Download
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">
              No pending properties found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}


export default RequestsPendingDataTable