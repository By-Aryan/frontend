"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SellerAccountCreatedDataTable({ 
  data, 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange 
}) {
  const router = useRouter();

  function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function getStatusBadgeStyle(status) {
    const statusLower = status?.toLowerCase() || 'unknown';
    switch (statusLower) {
      case "active":
        return "p-2 rounded-xl bg-green-100 text-green-800";
      case "inactive":
        return "p-2 rounded-xl bg-gray-100 text-gray-800";
      case "suspended":
        return "p-2 rounded-xl bg-red-100 text-red-800";
      case "approved":
        return "p-2 rounded-xl bg-blue-100 text-blue-800";
      default:
        return "p-2 rounded-xl bg-gray-100 text-gray-800";
    }
  }

  function getStatusBadgeText(status) {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} entries
        </div>
        <nav aria-label="Table pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {startPage > 1 && (
              <>
                <li className="page-item">
                  <button className="page-link" onClick={() => onPageChange(1)}>
                    1
                  </button>
                </li>
                {startPage > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const page = startPage + i;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button className="page-link" onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="fa fa-folder-open text-muted" style={{ fontSize: "2rem" }}></i>
        </div>
        <p className="mb-0">No seller accounts found</p>
      </div>
    );
  }

  return (
    <div>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Seller Details</th>
            <th scope="col">Request Date</th>
            <th scope="col">Accepted Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {data.map((seller, index) => (
            <tr key={seller._id || index}>
              <th scope="row">
                <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                  <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                    <div className="h6 list-title">
                      <Link href={`/single-v1/${seller._id}`}>
                        {seller.full_name || seller.fullname || "Unnamed Seller"}
                      </Link>
                    </div>
                    <p className="list-text mb-0">{seller.email || "-"}</p>
                    <p className="list-text mb-0">{seller.mobile || "-"}</p>
                  </div>
                </div>
              </th>
              <td className="vam">{formatDate(seller.createdAt)}</td>
              <td className="vam">
                <span>{formatDate(seller.acceptedAt || seller.updatedAt)}</span>
              </td>
              <td className="vam">
                <span className={getStatusBadgeStyle(seller.status || "active")}>
                  {getStatusBadgeText(seller.status || "active")}
                </span>
              </td>
              <td className="vam">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      borderRadius: "10px",
                      fontSize: "14px",
                    }}
                  >
                    Actions
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        href={`/dashboard/seller-profile/${seller._id}`}
                      >
                        <i className="fa fa-eye me-2"></i>View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        href={`/dashboard/seller-properties/${seller._id}`}
                      >
                        <i className="fa fa-building me-2"></i>View Properties
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-warning"
                        onClick={() => {
                          // Handle suspend action
                          if (confirm('Are you sure you want to suspend this seller?')) {
                            // Add your suspend logic here
                          }
                        }}
                      >
                        <i className="fa fa-pause me-2"></i>Suspend Account
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}

export default SellerAccountCreatedDataTable;