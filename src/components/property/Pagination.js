// "use client";
// import { useEffect, useState } from "react";

// const Pagination = ({
//   currentPage = 0,
//   totalRecords = 0,
//   limit = 10,
//   onPageChange,
//   itemName = "properties"
// }) => {
//   const totalPages = Math.ceil(totalRecords / limit);
//   const [pageNumbers, setPageNumbers] = useState([]);

//   // Generate page numbers whenever dependencies change
//   useEffect(() => {
//     const generatePageNumbers = () => {
//       const result = [];
//       const maxPagesToShow = 5;

//       // Don't generate anything if there are no pages
//       if (totalPages <= 0) return [];

//       if (totalPages <= maxPagesToShow) {
//         // Show all pages if total pages are less than or equal to maxPagesToShow
//         for (let i = 0; i < totalPages; i++) {
//           result.push(i);
//         }
//       } else {
//         // Always include first page
//         result.push(0);

//         // Calculate middle pages
//         let startPage, endPage;

//         if (currentPage <= 2) {
//           // If we're near the beginning
//           startPage = 1;
//           endPage = Math.min(3, totalPages - 2);
//         } else if (currentPage >= totalPages - 3) {
//           // If we're near the end
//           startPage = Math.max(totalPages - 4, 1);
//           endPage = totalPages - 2;
//         } else {
//           // We're in the middle
//           startPage = currentPage - 1;
//           endPage = currentPage + 1;
//         }

//         // Add ellipsis after first page if needed
//         if (startPage > 1) {
//           result.push('...');
//         }

//         // Add middle pages
//         for (let i = startPage; i <= endPage; i++) {
//           result.push(i);
//         }

//         // Add ellipsis before last page if needed
//         if (endPage < totalPages - 2) {
//           result.push('...');
//         }

//         // Always include last page if more than 1 page
//         if (totalPages > 1) {
//           result.push(totalPages - 1);
//         }
//       }

//       return result;
//     };

//     setPageNumbers(generatePageNumbers());
//   }, [currentPage, totalPages, totalRecords, limit]);

//   const handlePageClick = (page) => {
//     if (page >= 0 && page < totalPages && onPageChange) {
//       onPageChange(page);
//     }
//   };

//   // Don't render pagination if there's only one page or no data
//   if (totalPages <= 1) return null;

//   return (
//     <div className="mbp_pagination text-center">
//       <ul className="page_navigation" style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
//         <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
//           <button
//             className="page-link"
//             onClick={() => currentPage > 0 && handlePageClick(currentPage - 1)}
//             disabled={currentPage === 0}
//             style={{
//               width: "40px",
//               height: "40px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid #eee",
//               borderRadius: "5px",
//               cursor: currentPage === 0 ? "not-allowed" : "pointer",
//               opacity: currentPage === 0 ? 0.5 : 1,
//               backgroundColor: "transparent",
//               transition: "background-color 0.3s ease",
//             }}
//           >
//             <span className="fas fa-angle-left" />
//           </button>
//         </li>

//         {pageNumbers.map((page, index) => (
//           page === '...' ? (
//             <li key={`ellipsis-${index}`} style={{ margin: '0 5px' }}>...</li>
//           ) : (
//             <li key={`page-${page}`} className={currentPage === page ? "active" : ""}>
//               <button
//                 onClick={() => handlePageClick(page)}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   border: "1px solid #eee",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   backgroundColor: currentPage === page ? "#0f8363" : "transparent",
//                   color: currentPage === page ? "#fff" : "inherit",
//                   transition: "background-color 0.3s ease",
//                 }}
//                 className="pagination-button"
//               >
//                 {page + 1}
//               </button>
//             </li>
//           )
//         ))}

//         <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
//           <button
//             className="page-link"
//             onClick={() => currentPage < totalPages - 1 && handlePageClick(currentPage + 1)}
//             disabled={currentPage === totalPages - 1}
//             style={{
//               width: "40px",
//               height: "40px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid #eee",
//               borderRadius: "5px",
//               cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
//               opacity: currentPage === totalPages - 1 ? 0.5 : 1,
//               backgroundColor: "transparent",
//               transition: "background-color 0.3s ease",
//             }}
//           >
//             <span className="fas fa-angle-right" />
//           </button>
//         </li>
//       </ul>

//       {totalRecords > 0 && (
//         <p className="mt10 pagination_page_count text-center" style={{ margin: "15px 0 0", fontSize: "14px", color: "#666" }}>
//           {totalRecords > 0 ? `${currentPage * limit + 1}-${Math.min((currentPage + 1) * limit, totalRecords)} of ${totalRecords} ${itemName}` : `0 ${itemName}`}
//         </p>
//       )}

//       <style jsx global>{`
//         .pagination-button:hover {
//           background-color: #f5f5f5 !important;
//         }
//         .active .pagination-button {
//           background-color: #0f8363 !important;
//           color: white !important;
//         }
//         .page-link:hover:not(:disabled) {
//           background-color: #f5f5f5;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Pagination;
"use client";
import { useEffect, useState } from "react";

const Pagination = ({
  currentPage = 1,
  totalRecords = 0,
  limit = 10,
  onPageChange,
  itemName = "properties"
}) => {
  const totalPages = Math.ceil(totalRecords / limit);
  const [pageNumbers, setPageNumbers] = useState([]);

  // Generate page numbers whenever dependencies change
  useEffect(() => {
    const generatePageNumbers = () => {
      const result = [];
      const maxPagesToShow = 5;

      // Don't generate anything if there are no pages
      if (totalPages <= 0) return [];

      if (totalPages <= maxPagesToShow) {
        // Show all pages if total pages are less than or equal to maxPagesToShow
        for (let i = 1; i <= totalPages; i++) {
          result.push(i);
        }
      } else {
        // Always include first page
        result.push(1);

        // Calculate middle pages
        let startPage, endPage;

        if (currentPage <= 3) {
          // If we're near the beginning
          startPage = 2;
          endPage = Math.min(4, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
          // If we're near the end
          startPage = Math.max(totalPages - 3, 2);
          endPage = totalPages - 1;
        } else {
          // We're in the middle
          startPage = currentPage - 1;
          endPage = currentPage + 1;
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
          result.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          result.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          result.push('...');
        }

        // Always include last page if more than 1 page
        if (totalPages > 1) {
          result.push(totalPages);
        }
      }

      return result;
    };

    setPageNumbers(generatePageNumbers());
  }, [currentPage, totalPages, totalRecords, limit]);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  // Don't render if there's no data at all
  if (totalRecords <= 0) return null;

  return (
    <div className="mbp_pagination text-center">
      {/* Only show navigation buttons if there are multiple pages */}
      {totalPages > 1 && (
        <ul className="page_navigation" style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #eee",
                borderRadius: "5px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              }}
            >
              <span className="fas fa-angle-left" />
            </button>
          </li>

          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <li key={`ellipsis-${index}`} style={{ margin: '0 5px' }}>...</li>
            ) : (
              <li key={`page-${page}`} className={currentPage === page ? "active" : ""}>
                <button
                  onClick={() => handlePageClick(page)}
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: currentPage === page ? "#0f8363" : "transparent",
                    color: currentPage === page ? "#fff" : "inherit",
                    transition: "background-color 0.3s ease",
                  }}
                  className="pagination-button"
                >
                  {page}
                </button>
              </li>
            )
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #eee",
                borderRadius: "5px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              }}
            >
              <span className="fas fa-angle-right" />
            </button>
          </li>
        </ul>
      )}

      {/* Always show the record count info */}
      {totalRecords > 0 && (
        <p className="mt10 pagination_page_count text-center" style={{ margin: "15px 0 0", fontSize: "14px", color: "#666" }}>
          {totalRecords > 0 ? `${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalRecords)} of ${totalRecords} ${itemName}` : `0 ${itemName}`}
        </p>
      )}

      <style jsx global>{`
        .pagination-button:hover {
          background-color: #f5f5f5 !important;
        }
        .active .pagination-button {
          background-color: #0f8363 !important;
          color: white !important;
        }
        .page-link:hover:not(:disabled) {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default Pagination;