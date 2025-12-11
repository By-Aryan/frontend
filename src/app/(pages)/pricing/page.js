"use client"
import CallToActions from "@/components/common/CallToActions";
import Pricing from "@/components/pages/pricing/Pricing";
import RentPricing from "@/components/pages/pricing/TenantPricing";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect, useState } from "react";


const PricingPlan = () => {
  const [buyerPlans, setBuyerPlans] = useState([])
  const [rentPlans, setRentPlans] = useState([])
  console.log("🚀 ~ PricingPlan ~ rentPlans:", rentPlans)

    const { data, error, isError, isLoading } = useAxiosFetch("/plans/public");
    useEffect(()=>{
      console.log(data)
      const buyerPlans = data?.plans?.filter(plan => plan.category === "buy").sort((a, b) => a.price - b.price);
      const rentPlans = data?.plans?.filter(plan => plan.category === "rent").sort((a, b) => a.price - b.price);
      console.log("🚀 ~ PricingPlan ~ rentPlans:", rentPlans)

      setBuyerPlans(buyerPlans);
      setRentPlans(rentPlans);
    },[data])
  return (
    <>
      {/* Breadcrumb Sections */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Plans</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Plans</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Buyers Pricing Section Area */}
      <section className="our-pricing pb90 pt-0">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center mb30">
                <h2>Buyer Plans</h2>
                <p>Purchase plan to get these benefits.</p>
              </div>
            </div>
          </div>
          {/* End .row */}
          <Pricing buyerPlans={buyerPlans}/>
        </div>
        {/* End .container */}
      </section>

      {/*Tenants Pricing Section Area */}
      <section className="our-pricing pb90 pt-0">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center mb30">
                <h2>Rent Plans</h2>
                <p>Purchase plan to get these benefits.</p>
              </div>
            </div>
          </div>
          {/* End .row */}
          <RentPricing tenantPlans={rentPlans}/>
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

export default PricingPlan;
