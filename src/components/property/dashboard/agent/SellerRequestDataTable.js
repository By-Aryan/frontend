"use client";
import { ApiPutRequest } from "@/axios/apiRequest";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

function SellerRequestsDataTable({ setShowTable, data }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  function formatDate(dateString) {
    if (!dateString) return "Invalid Date"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  async function handleAcceptClick(id) {
    const response = await ApiPutRequest(`/requestproperty/accept/${id}`)
    // console.log(response.data.status)
    if (response.data.status == "success") {
      setShowTable("Accepted")
      window.location.reload();
    }
  }

  const handleViewDetails = (sellerId) => {
    setLoadingId(sellerId);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="fa fa-inbox text-muted" style={{ fontSize: "2rem" }}></i>
        </div>
        <p className="mb-0">No pending seller requests found</p>
      </div>
    );
  }

  return (
    <div>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Seller Name</th>
            <th scope="col">Requested</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {data.map((seller, index) => (
            <tr key={index}>
              <th scope="row">
                <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                  <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                    <div className="h6 list-title">
                      <Link href={`/single-v1/${seller._id}`}>
                        {seller.fullname || "Unnamed Seller"}
                      </Link>
                    </div>
                    <p className="list-text mb-0">{seller.email || "-"}</p>
                    <p className="list-text mb-0">{seller.mobile || "-"}</p>
                  </div>
                </div>
              </th>
              <td className="vam">{formatDate(seller.createdAt)}</td>
              <td className="vam">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/agent/seller-details/${seller._id}`}
                    className="py-1 px-3 hover:bg-[#edfffb] border-1 border-[#0f8363] hover:text-white font-semibold rounded-xl flex items-center justify-center"
                    style={{
                      borderRadius: "10px",
                      fontSize: "14px",
                      color: "#0f8363",
                      minWidth: "100px",
                    }}
                    onClick={() => handleViewDetails(seller._id)}
                  >
                    {loadingId === seller._id ? (
                      <div className="flex items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: "16px", height: "16px" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Please wait...
                      </div>
                    ) : (
                      "View Details"
                    )}
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellerRequestsDataTable;
