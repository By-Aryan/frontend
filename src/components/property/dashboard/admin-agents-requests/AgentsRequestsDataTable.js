"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import useAxiosDelete from "@/hooks/useAxiosDelete";
import useAxiosPost from "@/hooks/useAxiosPost";
import { ApiDeleteRequest } from "@/axios/apiRequest";
import { getPropertyImageStyle, getPropertyImageUrl, handleImageError } from "@/utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import { Tooltip as ReactTooltip } from "react-tooltip";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "pending-style style1";
    case "Approved":
      return "pending-style style2";
    default:
      return "";
  }
};

const AgentsRequestsDataTable = ({ agentsRequests, selectedValue }) => {
  const [status, setStatus] = useState(null);
  const [id, setId] = useState(null);
  const [message, setMessage] = useState("Agent deleted Successfully");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "N/A"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  const AcceptRequestsMutation = useAxiosPost(`/property/approve/${id}`, {
    onSuccess: (details) => {
      setMessage(`Property Approved Successfully`)
      setStatus(true)
      setState((prev) => ({ ...prev, open: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      setStatus(false)
      setMessage(`Unable to Approve Property`)
      setState((prev) => ({ ...prev, open: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
      }, 3000);
    }
  });

  const handleApproveClick = () => {
    AcceptRequestsMutation.mutate();
  }

  const handleDeleteClick = async (propertyId) => {
    try {
      const response = await ApiDeleteRequest(`/property/delete/${propertyId}`);
      setMessage(`Property Deleted Successfully`)
      setStatus(true)
      setState((prev) => ({ ...prev, open: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
        window.location.reload();
      }, 2000);
    } catch (error) {
      setStatus(false)
      setMessage(`Unable to delete Property`)
      setState((prev) => ({ ...prev, open: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }))
      }, 3000);
    }
  }

  return (
    <>
      <table className="table-style3 table at-savesearch" style={{ fontSize: '14px' }}>
        <thead className="t-head">
          <tr>
            <th scope="col" className="py-2">Listing title</th>
            <th scope="col" className="py-2">Date Requested</th>
            <th scope="col" className="py-2">Status</th>
            <th scope="col" className="py-2">Agent</th>
            <th scope="col" className="py-2">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {agentsRequests.length > 0 ? (
            agentsRequests.map((property) => (
              <tr key={property._id} style={{ lineHeight: '1.2' }}>
                <th scope="row" className="py-2">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-thumb" style={{ maxWidth: '90px', height: '60px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getPropertyImageUrl(property) ? (
                        <Image
                          width={90}
                          height={60}
                          className="w-100 h-100"
                          src={getPropertyImageUrl(property)}
                          alt={property.name || "Property"}
                          style={getPropertyImageStyle(getPropertyImageUrl(property))}
                          unoptimized={true}
                          priority={true}
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                          <span className="text-muted">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="list-content py-0 p-0 mt-1 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title mb-1">
                        <Link href={`/single-v1/${property._id}`}>{property?.name || property?.title || "Unnamed Property"}</Link>
                      </div>
                      <p className="list-text mb-0" style={{ fontSize: '12px' }}>{property?.location?.address || property?.location?.city || "No address"}</p>
                      <div className="list-price">
                        <a href="#">{property?.price} {property?.currency}</a>
                      </div>
                    </div>
                  </div>
                </th>
                <td className="vam py-2">{formatDate(property?.created_at)}</td>
                <td className="vam py-2">
                  <span className={getStatusStyle(property?.approval_status?.status)}>
                    {property?.approval_status?.status}
                  </span>
                </td>
                <td className="vam py-2">
                  <div className="flex flex-col justify-center items-center py-2">
                    <a className="">{property?.requested_id?.substring(0, 8) || "N/A"}</a>
                  </div>
                </td>
                <td className="vam py-2">
                  <div className="d-flex gap-2">
                    {property.approval_status.status !== "Approved" && (
                      <button
                        className="icon flex items-center justify-center"
                        style={{ border: "none" }}
                        data-tooltip-id={`approve-${property._id}`}
                        onClick={() => {
                          setId(property._id);
                          handleApproveClick();
                        }}
                      >
                        <span><IoCheckmarkOutline /></span>
                      </button>
                    )}
                    <button
                      className="icon"
                      style={{ border: "none" }}
                      data-tooltip-id={`delete-${property._id}`}
                      onClick={() => {
                        handleDeleteClick(property._id);
                      }}
                    >
                      <span className="flaticon-bin" />
                    </button>

                    <ReactTooltip
                      id={`approve-${property._id}`}
                      place="top"
                      content="Approve"
                    />
                    <ReactTooltip
                      id={`delete-${property._id}`}
                      place="top"
                      content="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No properties found</td>
            </tr>
          )}
        </tbody>
      </table>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default AgentsRequestsDataTable;
