"use client";
import { ApiPostRequest, ApiPutRequest } from "@/axios/apiRequest";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

function RequestsDataTable({setShowTable}) {
  const [requestData, setRequestData] = useState([]);
  const router = useRouter();

 
    const { data, isLoading, isError, error } = useAxiosFetch("/requestproperty/pending");
 

  useEffect(() => {
    if (data) {
      setRequestData(data.data);
    }
  }, [data]);

  useEffect(() => {
    console.log("requested:",requestData);
  }, [requestData]);
  
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
    if(response.data.status == "success"){
      setShowTable("Accepted")
      window.location.reload();
      
    }
  }


  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Name</th>
          <th scope="col">Requested By</th>
          <th scope="col">Property Type</th>
          <th scope="col">Purpose</th>
          <th scope="col">Requested</th>
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
                  {/* <p className="list-text mb-0">{property.location}</p> */}
                  <div className="list-price">
                    <a href="#">{property.area} sqft</a>
                  </div>
                </div>
              </div>
            </th>
            <div className="flex flex-col justify-center items-center py-4">
              <a className="">{property.name}</a>
              <a className="">{property.email}</a>
              <a className="">{property.phone}</a>
            </div>
            <td className="vam">{property.propertyType}</td>
            <td className="vam">
              <span>{property.purpose}</span>
            </td>
            <td className="vam">{formatDate(property.createdAt)}</td>
            <td className="vam">
              <div className="flex gap-2">
                <button
                  className="py-1 px-3 btn-theme-outline-primary hover:btn-theme-primary border-1 border-primary text-primary hover:text-white font-semibold rounded-xl"
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestsDataTable;
