"use client";
import CallToActions from "@/components/common/CallToActions";
import RentalPricing from "@/components/pages/rental-pricing/rentalsPricing";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const RentalPricingPlan = () => {
  // Clean rental pricing page - no debug info
  const params = useParams();
  const propertyId = params.propertyId || "";

  const [rentalPlans, setRentalPlans] = useState([]);
  const [propertyType, setPropertyType] = useState(null);

  // Fetch all plans
  const { data, error, isError, isLoading } = useAxiosFetch("/plans");

  // Fetch property details to determine type
  const { data: propertyData, isLoading: propertyLoading } = useAxiosFetch(
    propertyId ? `/property/propertyById/${propertyId}` : null
  );



  useEffect(() => {
    if (propertyData?.data) {
      const purpose = propertyData.data.details?.purpose;
      const isRental = purpose === "Rent" ||
        (purpose && purpose.toLowerCase().includes("rent"));
      setPropertyType(isRental ? "rental" : "sale");
    }
  }, [propertyData]);

  useEffect(() => {
    if (data?.plans) {
      // Always use the same boost plans, regardless of property type
      const rentalPlans = data.plans.filter(
        (plan) => plan.category === "boost"
      );

      setRentalPlans(rentalPlans);
    }
  }, [data]);

  return (
    <>
      {/* Breadcrumb Sections */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Rental Plans</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Rental Plans</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Rental Pricing Section Area */}
      <section className="our-pricing pb90 pt-0">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center mb30">
                <h2>Rental Boost Plans</h2>
                <p>Purchase a plan to feature your rental property and get more visibility.</p>
                {propertyLoading && (
                  <div className="text-muted small">
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Loading property details...
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End .row */}



          {isLoading || propertyLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading rental plans...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              <h5>Error Loading Rental Plans</h5>
              <p>{error.message}</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : rentalPlans?.length === 0 ? (
            <div className="alert alert-warning text-center">
              <h5>No Rental Plans Available</h5>
              <p>No rental boost plans found. Please contact support.</p>
            </div>
          ) : (
            <RentalPricing rentalPlans={rentalPlans} propertyType={propertyType} />
          )}
        </div>
        {/* End .container */}
      </section>

      {/* End Pricing Section Area */}

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}
    </>
  );
};

export default RentalPricingPlan;