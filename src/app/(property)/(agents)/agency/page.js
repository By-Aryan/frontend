import FilteringAgency from "@/components/property/FilteringAgency";

import React from "react";

export const metadata = {
  title: "Agency || ZeroBroker - Real Estate NextJS Template",
};

const Agency = () => {
  return (
    <>
      {/* Breadcumb Sections */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Agencies</h2>
                <div className="breadcumb-list">
                  <a href="#">Home</a>
                  <a href="#">For Rent</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcumb Sections */}

      {/* Agent Section Area */}
      <FilteringAgency/>
      {/* End Agent Section Area */}
    </>
  );
};

export default Agency;
