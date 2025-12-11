"use client";
import { ApiFetchRequest, ApiPutRequest } from "@/axios/apiRequest";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function MediaRequestRejectedDataTable() {
  const [requestData, setRequestData] = useState([]);
  const router = useRouter();

  const { data, isLoading, isError, error } = useAxiosFetch(
    "/requestproperty/rejected-by-agent"
  );

  useEffect(() => {
    if (data) {
      setRequestData(data.data);
    }
  }, [data]);

  useEffect(() => {
    console.log(requestData);
  }, [requestData]);

  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "N/A"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Name</th>
          <th scope="col">Requested Date</th>
          <th scope="col">Rejected Date</th>
          <th scope="col">Reason</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {requestData?.map((property, index) => (
          <tr key={index}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/single-v1/${property._id}`}>
                      {property.propertyName}
                    </Link>
                  </div>
                  <p className="list-text mb-0">{property.address}</p>
                  {property.area && (
                    <div className="list-price">
                      <a href="#">{property.area} sqft</a>
                    </div>
                  )}
                </div>
              </div>
            </th>
            <td className="vam">{formatDate(property.createdAt)}</td>
            <td className="vam">
              <span>{formatDate(property.acceptedAt)}</span>
            </td>
            <td className="vam">
              <div className="d-flex align-items-center">
                <span className="me-2">{property.reason || "No reason provided"}</span>
                <div className="dropdown">
                  <button type="button" className="border-0 bg-transparent" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li><span className="dropdown-item">{property.reason || "No reason provided"}</span></li>
                  </ul>
                </div>
              </div>
            </td>
            <td className="vam">
              <button 
                onClick={() => router.push(`/dashboard/driver/add-media/${property._id}`)} 
                className="btn btn-sm btn-primary" 
                type="button"
              >
                <i className="fa fa-upload me-1" aria-hidden="true"></i>
                Upload Media
              </button>
            </td>
          </tr>
        ))}
        {requestData?.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center py-4">
              No rejected requests found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default MediaRequestRejectedDataTable;