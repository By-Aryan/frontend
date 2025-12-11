import React from 'react';
import DataTable from 'react-data-table-component';

const ScrollableDataTable = ({ 
  columns, 
  data, 
  loading = false, 
  pagination = true, 
  paginationServer = false, 
  paginationTotalRows = 0, 
  paginationDefaultPage = 1, 
  paginationPerPage = 10, 
  onChangeRowsPerPage, 
  onChangePage, 
  noDataComponent,
  customStyles = {},
  maxHeight = '70vh',
  ...props 
}) => {
  const defaultCustomStyles = {
    table: {
      style: {
        overflowY: 'auto',
        maxHeight: maxHeight,
      },
    },
    tableWrapper: {
      style: {
        overflowY: 'auto',
        maxHeight: maxHeight,
      },
    },
    headRow: {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: '#f8f9fa',
      },
    },
    ...customStyles,
  };

  return (
    <div className="data-table-container scrollable-content">
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        paginationDefaultPage={paginationDefaultPage}
        paginationPerPage={paginationPerPage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        highlightOnHover
        striped
        responsive
        customStyles={defaultCustomStyles}
        noDataComponent={noDataComponent}
        {...props}
      />
    </div>
  );
};

export default ScrollableDataTable;
