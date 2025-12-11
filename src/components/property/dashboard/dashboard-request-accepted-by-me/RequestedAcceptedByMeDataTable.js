"use client"
import { ApiFetchRequest, ApiPutRequest } from '@/axios/apiRequest';
import useAxiosFetch from '@/hooks/useAxiosFetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function RequestedAcceptedByMeDataTable() {
    const [requestData, setRequestData] = useState([]);
    const router = useRouter();
  
    const { data, isLoading, isError, error } = useAxiosFetch("/requestproperty/accepted-by-me");
    // console.log("Accepted",data.data)
    useEffect(() => {
        if (data) {
          setRequestData(data.data);
        }
      }, [data]);
    
    function formatDate(dateString) {
      
      if (!dateString) return "Invalid Date"; // Handle empty or undefined input
  
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats
  
      const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
    }
  
    // Helper function to safely display location data
    function formatLocation(location) {
      // If location is a GeoJSON object (has type and coordinates)
      if (location && typeof location === 'object' && location.type && location.coordinates) {
        return `${location.type} (${location.coordinates.join(', ')})`;
      }
      
      // If location is a string, return as is
      if (typeof location === 'string') {
        return location;
      }
      
      // Return empty string for any other case
      return '';
    }
  
    return (
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Property Name</th>
            <th scope="col">Requested By</th>
            <th scope="col">Requested Date</th>
            <th scope="col">Accepted Date</th>
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
                    {/* Safely display location with formatting */}
                    <p className="list-text mb-0">{formatLocation(property.location)}</p>
                    <div className="list-price">
                      <a href="#">{property.area} sqft</a>
                    </div>
                  </div>
                </div>
              </th>
              
              <td className="vam">
              <div className="flex flex-col justify-center items-center py-5">
                <a className="">{property.seller?.fullname || 'N/A'}</a>
                <a className="">{property.seller?.email || 'N/A'}</a>
                <a className="">{property.seller?.mobile || 'N/A'}</a>
              </div>
              </td>
              <td className="vam">{formatDate(property.createdAt)}</td>
              <td className="vam">
                <span>{formatDate(property.acceptedAt)}</span>
              </td>
              <td className="vam">
                <span>
                  <Link
                  href={`/dashboard/agent/add-property/${property.request_id}`}
                  className="py-2 px-4 btn-theme-primary hover:bg-primary-600 border-1 border-primary text-primary hover:text-white font-semibold rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: 'white'
                  }}
                >
                  List
                </Link>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default RequestedAcceptedByMeDataTable