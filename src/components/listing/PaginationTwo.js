"use client";
import { useEffect, useRef, useMemo, useCallback } from "react";

const PaginationTwo = ({
  pageNumber,
  setPageNumber,
  data,
  pageCapacity,
  totalRecords
}) => {
  // Validate and normalize props
  const currentPage = Math.max(1, parseInt(pageNumber) || 1);
  const capacity = Math.max(1, parseInt(pageCapacity) || 10);
  
  // Calculate total pages with proper validation
  const totalPages = useMemo(() => {
    if (!capacity) return 0;
    
    if (totalRecords && totalRecords > 0) {
      return Math.ceil(totalRecords / capacity);
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      return Math.ceil(data.length / capacity);
    }
    
    return 0;
  }, [totalRecords, data, capacity]);

  // Ensure current page is within valid bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      console.log('🔄 Page number exceeds total pages, resetting to last page');
      setPageNumber(totalPages);
    } else if (currentPage < 1) {
      console.log('🔄 Page number below 1, resetting to first page');
      setPageNumber(1);
    }
  }, [currentPage, totalPages, setPageNumber]);

  // Debug: Track pageNumber prop changes
  useEffect(() => {
    console.log('🔄 PaginationTwo: pageNumber prop changed to:', currentPage, 'totalPages:', totalPages);
  }, [currentPage, totalPages]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Generate page numbers with improved algorithm
  const pageNumbers = useMemo(() => {
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

        // Calculate middle pages around current page
        let startPage, endPage;
        
        if (currentPage <= 3) {
          // If we're near the beginning, show 1, 2, 3, 4, ..., last
          startPage = 2;
          endPage = Math.min(4, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
          // If we're near the end, show 1, ..., last-3, last-2, last-1, last
          startPage = Math.max(2, totalPages - 3);
          endPage = totalPages - 1;
        } else {
          // If we're in the middle, show 1, ..., current-1, current, current+1, ..., last
          startPage = currentPage - 1;
          endPage = currentPage + 1;
        }

        // Add ellipsis after first page if there's a gap
        if (startPage > 2) {
          result.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          if (i >= 1 && i <= totalPages) {
            result.push(i);
          }
        }

        // Add ellipsis before last page if there's a gap
        if (endPage < totalPages - 1) {
          result.push('...');
        }

        // Always include last page if there's more than 1 page
        if (totalPages > 1) {
          result.push(totalPages);
        }
      }
      return result;
    };

    return generatePageNumbers();
  }, [currentPage, totalPages]);

  // Handler functions with improved logic
  const handlePrevious = useCallback(() => {
    console.log('🔄 Previous clicked - Current page:', currentPage);
    if (currentPage > 1 && setPageNumber) {
      const prevPage = currentPage - 1;
      console.log('✅ Moving to previous page:', prevPage);
      setPageNumber(prevPage);
    } else {
      console.log('❌ Already on first page or invalid state');
    }
  }, [currentPage, setPageNumber]);

  const handleNext = useCallback(() => {
    console.log('🔄 Next clicked - Current page:', currentPage, 'totalPages:', totalPages);
    if (currentPage < totalPages && setPageNumber) {
      const nextPage = currentPage + 1;
      console.log('✅ Moving to next page:', nextPage);
      setPageNumber(nextPage);
    } else {
      console.log('❌ Already on last page or invalid state');
    }
  }, [currentPage, totalPages, setPageNumber]);

  const handlePageClick = useCallback((page) => {
    if (page !== currentPage && typeof page === 'number' && page >= 1 && page <= totalPages && setPageNumber) {
      console.log('🔄 Navigating to page:', page);
      setPageNumber(page);
    }
  }, [currentPage, totalPages, setPageNumber]);

  // Don't render pagination if there are no pages
  if (totalPages <= 0) {
    return null;
  }

  const isNextDisabled = currentPage >= totalPages;
  const isPrevDisabled = currentPage <= 1;

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation" style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
        <li className={`page-item ${isPrevDisabled ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={handlePrevious}
            disabled={isPrevDisabled}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #eee",
              borderRadius: "5px",
              cursor: isPrevDisabled ? "not-allowed" : "pointer",
              opacity: isPrevDisabled ? 0.5 : 1,
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
            }}
          >
            <span className="fas fa-angle-left" />
          </button>
        </li>

        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <li key={`ellipsis-${index}`} style={{ margin: '0 5px' }}>
              <span style={{ color: '#666', fontSize: '16px' }}>...</span>
            </li>
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

        <li className={`page-item ${isNextDisabled ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={handleNext}
            disabled={isNextDisabled}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #eee",
              borderRadius: "5px",
              cursor: isNextDisabled ? "not-allowed" : "pointer",
              opacity: isNextDisabled ? 0.5 : 1,
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
            }}
          >
            <span className="fas fa-angle-right" />
          </button>
        </li>
      </ul>

      <p className="mt10 pagination_page_count text-center" style={{ margin: "15px 0 0", fontSize: "14px", color: "#666" }}>
        {totalRecords ? (
          `${((currentPage - 1) * capacity) + 1}-${Math.min(currentPage * capacity, totalRecords)} of ${totalRecords} properties`
        ) : (
          data && data.length > 0 ? 
            `${((currentPage - 1) * capacity) + 1}-${Math.min(currentPage * capacity, data.length)} of ${data.length}+ property available` :
            'No properties available'
        )}
      </p>

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

export default PaginationTwo;
