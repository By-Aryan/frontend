"use client";
import { ApiPutRequest } from "@/axios/apiRequest";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AssignedDriversDataTable({ setShowTable }) {
  const [requestData, setRequestData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const router = useRouter();

  const { data, isLoading, isError, error } = useAxiosFetch("/driver/agent/assignments");
  const { data: driversData } = useAxiosFetch("/agents/role/driver");

  useEffect(() => {
    if (data) {
      setRequestData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (driversData) {
      // The API returns { data: { data: [...] } } structure
      // driversData is the response body
      // driversData.data is the object containing { data: [], page: ... }
      // driversData.data.data is the array of drivers
      setAvailableDrivers(driversData.data?.data || []);
    }
  }, [driversData]);

  function formatDate(dateString) {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleEditClick = (assignmentId, currentDriverId) => {
    setEditingId(assignmentId);
    setSelectedDriverId(currentDriverId);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedDriverId("");
  };

  const handleSaveDriver = async (assignmentId) => {
    try {
      console.log("Attempting to reassign driver:", { assignmentId, newDriverId: selectedDriverId });

      const response = await ApiPutRequest(`/driver/reassign/${assignmentId}`, {
        newDriverId: selectedDriverId
      });

      console.log("Reassign response:", response);
      console.log("Response structure:", {
        hasData: !!response?.data,
        hasSuccess: response?.data?.success,
        hasResponse: !!response?.response,
        responseStatus: response?.response?.status,
        responseData: response?.response?.data
      });

      if (response?.data?.success) {
        // Update local state
        setRequestData(prevData =>
          prevData.map(item =>
            item._id === assignmentId
              ? { ...item, driver: response.data.data.driver }
              : item
          )
        );
        setEditingId(null);
        setSelectedDriverId("");
        alert("Driver reassigned successfully!");
      } else {
        // Handle error returned by ApiPutRequest
        const errorMsg = response?.response?.data?.message || response?.data?.message || response?.message || "Failed to reassign driver.";
        console.error("Reassignment failed:", errorMsg);
        console.error("Full error response:", response);
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error reassigning driver:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      const errorMsg = error.response?.data?.message || error.message || "Failed to reassign driver. Please try again.";
      alert(`Error: ${errorMsg}`);
    }
  };
  if (isError) {
    return <div className="text-center py-4 text-red-500">Error loading data: {error?.message || "Unknown error"}</div>;
  }

  if (!requestData || requestData.length === 0) {
    return <div className="text-center py-4">No assignments found.</div>;
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Name</th>
          <th scope="col">Seller</th>
          <th scope="col">Driver</th>
          <th scope="col">Assigned</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {requestData.every(item => !item.property) ? (
          <tr>
            <td colSpan="6" className="text-center py-3">No data found</td>
          </tr>
        ) : (
          requestData.map((item, index) => (
            item.property ? (
              <tr key={index}>
                <th scope="row" className="py-2">
                  <div className="d-flex flex-column">
                    <div className="fw-bold fs-6 mb-0">
                      <Link href={`/single-v1/${item.property._id}`} className="text-decoration-none">
                        {item.property.title || "Untitled Property"}
                      </Link>
                    </div>
                    <small className="text-muted mb-0">{item.property.address || "No address"}</small>
                    <small className="text-muted mb-0">{item.property.type || "Not specified"}</small>
                    <small className="fw-bold">
                      {item.property.price ? `AED ${item.property.price}` : "Price not available"}
                    </small>
                  </div>
                </th>
                <td className="vam py-2">
                  <div className="d-flex flex-column">
                    {item.property?.seller ? (
                      <>
                        <small className="fw-medium">{item.property.seller.fullname || "No name"}</small>
                        <small className="text-muted">{item.property.seller.email || "No email"}</small>
                      </>
                    ) : (
                      <small className="text-muted">Seller info not available</small>
                    )}
                  </div>
                </td>
                <td className="vam py-2">
                  {editingId === item._id ? (
                    <select
                      className="form-select form-select-sm"
                      value={selectedDriverId}
                      onChange={(e) => setSelectedDriverId(e.target.value)}
                    >
                      <option value="">Select Driver</option>
                      {availableDrivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.fullname} - {driver.mobile}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="d-flex flex-column">
                      {item.driver ? (
                        <>
                          <small className="fw-medium">{item.driver.fullname || "No name"}</small>
                          <small className="text-muted">{item.driver.email || "No email"}</small>
                          <small className="text-muted">{item.driver.mobile || "No phone"}</small>
                        </>
                      ) : (
                        <small className="text-muted">Driver info not available</small>
                      )}
                    </div>
                  )}
                </td>
                <td className="vam py-2">
                  <small>{formatDate(item.assignedAt)}</small>
                </td>
                <td className="vam py-2">
                  <span className={`badge rounded-pill ${item.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {item.status || "Unknown"}
                  </span>
                </td>
                <td className="vam py-2">
                  {/* Only show edit option for pending status */}
                  {item.status === 'pending' ? (
                    editingId === item._id ? (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleSaveDriver(item._id)}
                          disabled={!selectedDriverId}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditClick(item._id, item.driver?._id)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    )
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ) : null
          ))
        )}
      </tbody>
    </table>
  );
}

export default AssignedDriversDataTable;