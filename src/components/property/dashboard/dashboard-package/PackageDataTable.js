"use client";

import React, { useState, useEffect } from "react";

const PackageDataTable = () => {
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchPackageData = async () => {
  //     try {
  //       setLoading(true);
  //       // localStorage.setItem("id", details.data.user_id);
  //       // Access environment variable in Next.js
  //       const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  //       const apiUrl = `${apiBaseUrl}/subscription/get-my-plans`;
        
  //       const response = await fetch(apiUrl);
        
  //       // if (!response.ok) {
  //       //   throw new Error(`https error! Status: ${response.status}`);
  //       // }
        
  //       const data = await response.json();
  //       setPackageData(data);
  //       setError(null);
  //     } catch (err) {
  //       setError(`Failed to fetch package data: ${err.message}`);
  //       console.error("Error fetching package data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPackageData();
  // }, []);


  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
  
        // Get access token from localStorage
        const token = localStorage.getItem("accessToken");
  
        if (!token) {
          throw new Error("Please login to view your plan");
        }
  
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';
        const apiUrl = `${apiBaseUrl}/property/user-plan`;
  
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error(`https error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (data.success) {
          setPackageData(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch plan data");
        }
        
        setError(null);
      } catch (err) {
        setError(`Failed to fetch package data: ${err.message}`);
        console.error("Error fetching package data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPackageData();
  }, []);
  

  if (loading) {
    return <div className="flex justify-center p-8">Loading package data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-style3 table w-full">
        <thead className="t-head bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-2">Current plan</th>
            <th scope="col" className="px-4 py-2">Contacts remaining</th>
            <th scope="col" className="px-4 py-2">Featured remaining</th>
            <th scope="col" className="px-4 py-2">Renewal remaining</th>
            <th scope="col" className="px-4 py-2">Storage Space</th>
            <th scope="col" className="px-4 py-2">Expiry Date</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {packageData ? (
            <tr className="border-b">
              <th scope="row" className="px-4 py-2 font-medium">
                <div className="d-flex align-items-center">
                  <span className={`badge me-2 ${packageData.isExpired ? 'bg-danger' : 'bg-success'}`}>
                    {packageData.isExpired ? 'Expired' : 'Active'}
                  </span>
                  {packageData.planName}
                </div>
              </th>
              <td className="px-4 py-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">{packageData.contactViewsRemaining}</span>
                  <small className="text-muted">/ {packageData.contactViewsLimit}</small>
                </div>
                <div className="progress mt-1" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${packageData.usage?.contactViewsPercentage || 0}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">{packageData.featuredListingsRemaining}</span>
                  <small className="text-muted">/ {packageData.featuredListingsLimit}</small>
                </div>
                <div className="progress mt-1" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${packageData.usage?.featuredListingsPercentage || 0}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">{packageData.renewalRemaining}</span>
                  <small className="text-muted">/ {packageData.renewalLimit}</small>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">{packageData.storageRemaining} MB</span>
                  <small className="text-muted">/ {packageData.storageLimit} MB</small>
                </div>
                <div className="progress mt-1" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${packageData.usage?.storagePercentage || 0}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div>
                  <div className="fw-bold">{new Date(packageData.expiryDate).toLocaleDateString()}</div>
                  <small className="text-muted">{packageData.daysRemaining} days remaining</small>
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center">No package data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PackageDataTable;