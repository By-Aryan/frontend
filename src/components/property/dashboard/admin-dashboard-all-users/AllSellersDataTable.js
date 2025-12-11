"use client";
import StatusSnackbar from "@/components/Snackbar/Snackbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useAxiosDelete from "@/hooks/useAxiosDelete";
import { getUserImageUrl } from "@/utilis/imageHelpers";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return "pending-style style2";
    case "inactive":
      return "pending-style style1";
    case "pending":
      return "pending-style style3";
    default:
      return "";
  }
};

const AllSellersDataTable = ({ role, agents, isLoading }) => {
  const [status, setStatus] = useState(null);
  const [id, setId] = useState(null);
  const [message, setMessage] = useState("Seller deleted Successfully");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const deleteAgentMutation = useAxiosDelete(`/agents/delete/`);

  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "N/A"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  // Get the appropriate image URL, or use a default
  const getUserProfileImage = (seller) => {
    return getUserImageUrl(seller);
  };

  const handleAgentDeleteClick = async (id) => {
    deleteAgentMutation.mutate(id, {
      onSuccess: (details) => {
        setMessage("Seller deleted successfully");
        setStatus(true);
        setState((prev) => ({ ...prev, open: true }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, open: false }));
          window.location.reload();
        }, 3000);
      },
      onError: (error) => {
        setStatus(false);
        setMessage("Unable to delete Seller");
        setState((prev) => ({ ...prev, open: true }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, open: false }));
        }, 3000);
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="" size="md" color="success" />;
  }

  return (
    <>
      <table className="table-style3 table at-savesearch" style={{ fontSize: '14px' }}>
        <thead className="t-head">
          <tr>
            <th scope="col" className="py-2">Name</th>
            <th scope="col" className="py-2">Contacts</th>
            <th scope="col" className="py-2">Role</th>
            <th scope="col" className="py-2">Date Created</th>
            <th scope="col" className="py-2">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {agents && agents.length > 0 ? (
            agents.map((seller) => (
              <tr key={seller._id} style={{ lineHeight: '1.2' }}>
                <th scope="row" className="py-2">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-thumb" style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden' }}>
                      {getUserProfileImage(seller) ? (
                        <Image
                          width={70}
                          height={70}
                          className="w-100 h-100 object-cover"
                          src={getUserProfileImage(seller)}
                          alt={seller.fullname || "Seller"}
                          unoptimized={seller.profile_photo?.startsWith('blob:') || seller.profile_photo?.startsWith('data:')}
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                          <span className="fas fa-user text-muted" style={{ fontSize: '28px' }} />
                        </div>
                      )}
                    </div>
                    <div className="list-content py-0 p-0 mt-1 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title mb-1">{seller.fullname || "Unnamed Seller"}</div>
                      <span className={getStatusStyle(seller.status || "active")}>
                        {seller.status || "active"}
                      </span>
                    </div>
                  </div>
                </th>
                <td className="vam py-2">
                  <p className="list-text mb-1">{seller.email || "N/A"}</p>
                  <p className="list-text mb-0">{seller.mobile || "N/A"}</p>
                </td>
                <td className="vam py-2">{seller.role || "N/A"}</td>
                <td className="vam py-2">{formatDate(seller.createdAt)}</td>
                <td className="vam py-2">
                  <div className="d-flex gap-2">
                    <Link
                      href={`/dashboard/admin/edit-seller/${seller._id}`}
                      className="icon"
                      style={{ border: "none" }}
                      data-tooltip-id={`edit-${seller._id}`}
                    >
                      <span className="fas fa-pen fa" />
                    </Link>
                    <button
                      className="icon"
                      style={{ border: "none" }}
                      data-tooltip-id={`delete-${seller._id}`}
                      onClick={() => {
                        handleAgentDeleteClick(seller._id);
                      }}
                    >
                      <span className="flaticon-bin" />
                    </button>

                    <ReactTooltip
                      id={`edit-${seller._id}`}
                      place="top"
                      content="Edit"
                    />
                    <ReactTooltip
                      id={`delete-${seller._id}`}
                      place="top"
                      content="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No {role}s found</td>
            </tr>
          )}
        </tbody>
      </table>
      <StatusSnackbar message={message} state={state} status={status} />
    </>
  );
};

export default AllSellersDataTable;
