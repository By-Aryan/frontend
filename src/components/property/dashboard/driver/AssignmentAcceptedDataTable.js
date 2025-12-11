"use client"
import { ApiFetchRequest, ApiPutRequest } from '@/axios/apiRequest';
import useAxiosFetch from '@/hooks/useAxiosFetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function AssignmentAcceptedDataTable({assignments}) {
    const [acceptedData, setAcceptedData] = useState([]);
    const router = useRouter();
  
  
    // const { data, isLoading, isError, error } = useAxiosFetch("/requestproperty/accepted-by-me");
          
  
    useEffect(() => {
        if (data) {
          setAcceptedData(data?.data);
        }
      }, [data !== undefined]);
    
    
    function formatDate(dateString) {
      if (!dateString) return "Invalid Date"; // Handle empty or undefined input
  
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats
  
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
            <th scope="col">Assigned By</th>
            <th scope="col">Accepted Date</th>
            <th scope="col">Action</th>
            {/* <th scope="col">Created</th>
            <th scope="col">Action</th> */}
          </tr>
        </thead>
        <tbody className="t-body">
          {acceptedData?.map((property, index) => (
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
                    <p className="list-text mb-0">
                      {typeof property.location === 'string' 
                        ? property.location 
                        : property.location?.address || 
                          `${property.location?.city || ''}, ${property.location?.emirate || ''}`.replace(/^, |, $/, '') || 
                          'Location not available'
                      }
                    </p>
                    <div className="list-price">
                      <a href="#">{property.area} sqft</a>
                    </div>
                  </div>
                </div>
              </th>
              
              <td className="vam">
              <div className="flex flex-col justify-center items-center py-5">
                <a className="">{property.seller.fullname}</a>
                <a className="">{property.seller.email}</a>
              </div>
              </td>
              <td className="vam">
                <span>{formatDate(property.acceptedAt )}</span>
              </td>
              <td className="vam">
                <span>
                  <Link
                  href={`/dashboard/driver/add-Media/1`}
                  className="py-2 px-4 btn-theme-primary hover:bg-primary-600 border-1 border-primary text-primary hover:text-white font-semibold rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: 'white'
                  }}
                >
                  Upload
                </Link>
                </span>
              </td>
              {/* <td className="vam">
                <div className="flex gap-2">
                  <button
                    className="py-1 px-2 btn-theme-primary text-white rounded-xl"
                    style={{
                      borderRadius: "10px",
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      handleAcceptClick(property._id);
                    }}
                  >
                    Accept
                  </button>
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default AssignmentAcceptedDataTable