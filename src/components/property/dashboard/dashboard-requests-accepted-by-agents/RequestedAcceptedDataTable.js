"use client"
import { useEffect, useState } from 'react';

function RequestedAcceptedDataTable({ data: propData }) {
  const [requestData, setRequestData] = useState([]);
  const [downloading, setDownloading] = useState({});

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
    return property?.approval_status?.status || property?.status || "Approved";
  }

  function getPropertyPurpose(property) {
    return property?.details?.purpose || property?.purpose || "Not specified";
  }

  function getApproverInfo(property) {
    const approver = property?.approval_status?.approved_by || property?.assignedAgent;
    if (!approver) return "Admin";
    if (typeof approver === 'string') return approver;
    return approver.fullname || approver.name || approver.email || "Admin";
  }

  function getDocumentCount(property) {
    return property?.document_count || property?.documents?.length || 0;
  }

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
          <th scope="col">Requested By</th>
          <th scope="col">Documents</th>
          <th scope="col">Requested Date</th>
          <th scope="col">Accepted Date</th>
          <th scope="col">Action</th>
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
                      <div className="h6 list-title">{getPropertyName(property)}</div>
                      <p className="list-text mb-0">{getPropertyAddress(property)}</p>
                      <div className="list-price">
                        <a href="#">{getPropertyArea(property)}</a>
                      </div>
                    </div>
                  </div>
                </th>

                <td className="vam">
                  <span className="fz15">{property?.seller?.fullname || property?.name || "N/A"}</span>
                  <br />
                  <span className="fz13 text-muted">{property?.seller?.email || property?.email || ""}</span>
                </td>

                <td className="vam">
                  <div className="d-flex align-items-center gap-2">
                    <i className="flaticon-document text-primary"></i>
                    <span className="fz15 fw-medium">
                      {docCount} {docCount === 1 ? 'Document' : 'Documents'}
                    </span>
                  </div>
                </td>

                <td className="vam">{formatDate(property?.createdAt)}</td>
                <td className="vam">
                  <span>{formatDate(property?.acceptedAt || property?.approval_status?.approved_on)}</span>
                </td>

                <td className="vam">
                  {docCount > 0 ? (
                    <button
                      className="ud-btn btn-white2"
                      onClick={() => handleDownloadDocuments(requestId)}
                      disabled={downloading[requestId]}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: downloading[requestId] ? '#f3f4f6' : '#fff',
                        cursor: downloading[requestId] ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
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
                          Download ZIP
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-muted fz14">No documents</span>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              No approved properties found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default RequestedAcceptedDataTable;
