"use client";

import useAxiosPost from "@/hooks/useAxiosPost";
import { usePropertyStore } from "@/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import TopFilterBar from "../map-style/map-v1/TopFilterBar";
import PaginationTwo from "../PaginationTwo";
import ListingSidebar from "../sidebar/index";
import NewProjects from "./NewProjects";

export default function NewProjectListing({
  showModal,
  setShowModal,
  filterFunctions,
  handleFilterChange,
  sortedFilteredData,
  filteredData,
}) {
  const [propData, setPropData] = useState([]);
  const [searchName, setSearchName] = useState("");
  // const [filteredData, setFilteredData] = useState([]);

  const [isScheduleTourModal, setIsScheduleTourModal] = useState(false);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");

  // const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  const { properties } = usePropertyStore();

  useEffect(() => {
    if (properties) {
      setPropData(properties);
    }
  }, [properties]);

  const inputStyle = {
    width: "100%", // The width of the input field (100% of the container's width)
    padding: "10px", // Padding inside the input field
    marginBottom: "10px", // Space below each input field
    border: "1px solid #ddd", // Border style
    borderRadius: "8px", // Rounded corners
    fontSize: "14px", // Font size
    color: "#555", // Text color
  };

  const mutation = useAxiosPost("/savefilter", {
    onSuccess: (details) => {
      console.log("Search Saved successfully:", details);
      setShowModal(false);
    },
    onError: (error) => {
      console.error("Error Saving Search:", error.response.data.message);
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstWord = window.location.pathname.split("/")[1];

    mutation.mutate({ filterName: searchName });
  };

  return (
    <section className="pt0 bgc-f7">
      <div className="container">
        {/* start mobile filter sidebar */}
        <div
          className="offcanvas offcanvas-start p-0"
          // tabIndex="-1"
          id="listingSidebarFilter"
          aria-labelledby="listingSidebarFilterLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="listingSidebarFilterLabel">
              Listing Filter
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar
              filterFunctions={filterFunctions}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>
        {/* End mobile filter sidebar */}

        <div className="row gx-xl-5">
          <div className="col-lg-9">
            <div className="row align-items-center mb20">
              <TopFilterBar
                pageContentTrac={pageContentTrac}
                colstyle={colstyle}
                setColstyle={setColstyle}
                setCurrentSortingOption={setCurrentSortingOption}
              />
            </div>
            {/* End .row */}

            <div className="row mt15">
              {console.log("NewProjectListing passing data:", { filteredDataLength: filteredData?.length, sortedFilteredDataLength: sortedFilteredData?.length })}
              <NewProjects
                colstyle={colstyle}
                data={filteredData}
                setIsScheduleTourModal={setIsScheduleTourModal}
                sortedFilteredData={sortedFilteredData}
              />
            </div>
            {/* End .row */}

            <div className="row text-center">
              <PaginationTwo
                pageCapacity={4}
                data={sortedFilteredData}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </div>
            {/* End .row */}
          </div>
          {/* End col-8 */}

          {/* <div className="col-lg-4 d-none d-lg-block">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div> */}
          {/* Right column removed - Invest In sidebar removed as per request */}

          {/* End col-4 */}
        </div>
        {/* End TopFilterBar */}
      </div>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Save Search</h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2">
                Search Name:
              </label>
              <input
                type="text"
                name="search_name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#ebebeb] rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#188063] text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* End .container */}
    </section>
  );
}
