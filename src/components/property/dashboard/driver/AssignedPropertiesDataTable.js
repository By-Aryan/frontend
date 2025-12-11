// Random Forest

"use client"
import Link from 'next/link';
import React from 'react';

function AssignedPropertiesDataTable({ assignments }) {
  // Format visiting date to show as DD/MM/YYYY
  function formatDate(dateString) {
    if (!dateString) return "Invalid Date"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  // Format time to 12-hour format with AM/PM
  function formatTime(timeString) {
    if (!timeString) return ""; // Handle empty time

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Location</th>
          <th scope="col">Visit Date</th>
          <th scope="col">Visit Time</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {assignments?.map((assignment, index) => (
          <tr key={index}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    {assignment.locationDetails.building_name}, Apt {assignment.locationDetails.apartment_number}
                  </div>
                  <p className="list-text mb-0">
                    {typeof assignment.locationDetails.address === 'string' ? assignment.locationDetails.address : assignment.locationDetails.address?.address || ''}, {typeof assignment.locationDetails.street === 'string' ? assignment.locationDetails.street : assignment.locationDetails.street?.street || ''}
                  </p>
                  <p className="list-text mb-0">
                    {typeof assignment.locationDetails.neighborhood === 'string' ? assignment.locationDetails.neighborhood : assignment.locationDetails.neighborhood?.name || ''}, {typeof assignment.locationDetails.city === 'string' ? assignment.locationDetails.city : assignment.locationDetails.city?.name || ''}
                  </p>
                </div>
              </div>
            </th>

            <td className="vam">
              <span>{formatDate(assignment.visitingDate)}</span>
            </td>

            <td className="vam">
              <span>{formatTime(assignment.visitingTime)}</span>
            </td>

            <td className="vam">
              <span className={`badge ${assignment.status === 'pending' ? 'bg-warning' :
                assignment.status === 'completed' ? 'bg-success' :
                  'bg-danger'
                }`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </td>

            <td className="vam">
              <div className="d-flex">
                {assignment.status === 'pending' ? (
                  <>
                    <Link
                      href={`/dashboard/driver/add-media/${assignment._id}`}
                      className="btn btn-sm btn-success me-2"
                      style={{
                        backgroundColor: '#0f8363',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: 'white'
                      }}
                    >
                      Upload
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm me-2"
                      style={{
                        backgroundColor: '#dc3545', // Bootstrap red
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: 'white',
                        cursor: 'default',
                      }}
                      disabled
                    >
                      Uploaded
                    </button>
                  </>

                )}
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssignedPropertiesDataTable;

// Random Forest