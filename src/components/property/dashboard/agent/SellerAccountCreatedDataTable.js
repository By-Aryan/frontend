"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SellerAccountCreatedDataTable({ data }) {
  const router = useRouter();

  function formatDate(dateString) {
    if (!dateString) return "-"; // Return dash for empty dates

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // Return dash for invalid dates

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  // Function to get badge style based on seller status
  function getTypeBadgeStyle(status) {
    if (status === "agent") {
      return "p-2 rounded-xl bg-blue-100 text-blue-800";
    } else if (status === "self") {
      return "p-2 rounded-xl bg-green-100 text-green-800";
    } else {
      return "p-2 rounded-xl bg-gray-100";
    }
  }

  // Function to get badge text based on seller status
  function getTypeBadgeText(status) {
    if (status === "agent") {
      return "Agent";
    } else if (status === "self") {
      return "Self";
    } else {
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="fa fa-folder-open text-muted" style={{ fontSize: "2rem" }}></i>
        </div>
        <p className="mb-0">No seller accounts found</p>
      </div>
    );
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Sellers Name</th>
          <th scope="col">Requested Date</th>
          <th scope="col">Created Date</th>
          <th scope="col">Status</th>
          {/* <th scope="col">Action</th> */}
          {/* <th scope="col">Created</th>
            <th scope="col">Action</th> */}
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
              <span>{formatDate(seller.acceptedAt)}</span>
            </td>
            <td className="vam">
              <span className={getTypeBadgeStyle(seller.status || "unknown")}>
                {getTypeBadgeText(seller.status || "unknown")}
              </span>
            </td>
            {/* <td className="vam">
                <span>
                  <Link
                  href={`/dashboard/agent/add-property/${property.request_id}`}
                  className="py-2 px-4 hover:bg-[#0f8363] border-1 border-[#0f8363] text-[#0f8363] hover:text-white font-semibold rounded-xl"
                  style={{
                    backgroundColor: '#0f8363',
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: 'white'
                  }}
                >
                  List
                </Link>
                </span>
              </td> */}
            {/* <td className="vam">
                <div className="flex gap-2">
                  <button
                    className="py-1 px-2 bg-[#0f8363] text-white rounded-xl"
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

export default SellerAccountCreatedDataTable