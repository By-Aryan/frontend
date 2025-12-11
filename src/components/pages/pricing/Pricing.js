"use client";
import Image from "next/image";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// const pricingPackages = [
//   {
//     packageTitle: "Basic",
//     price: "5000 AED",
//     priceIcon: "images/icon/pricing-icon-2.svg",
//     features: [
//       "No Expiry of Plan",
//       "Contact Upto 10",
//       "Loan Assistance",
//       "24/7 Full support",
//     ],
//   },
//   {
//     packageTitle: "Intermediate ",
//     price: "7500 AED",
//     pricePerMonth: "per month",
//     priceIcon: "images/icon/pricing-icon-1.svg",
//     uniqueClass: "unique-class", // Add a unique class for Professional package
//     features: [
//       "No Expiry of Plan",
//       "Contact Upto 20",
//       "Loan Assistance",
//       "24/7 Full support",
//     ],
//   },
//   {
//     packageTitle: "Dedicated Expert ",
//     price: "10,000 AED",
//     pricePerMonth: "per month",
//     priceIcon: "images/icon/pricing-icon-3.svg",
//     features: [
//       "No Expiry of Plan",
//       "Contact Upto 30",
//       "Loan Assistance",
//       "Dedicated property expert",
//       "Fixing viewings and visits",
//       "Helping negotiations",
//       "24/7 Full support",
//     ],
//   },
// ];


const Pricing = ({buyerPlans}) => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  // Define the specific prices for buyer plans based on plan name
  const getPlanPrice = (planName) => {
    const priceMap = {
      "Basic Plan": 5000,
      "Intermediate Plan": 7500,
      "Premium Plan": 10000
    };
    return priceMap[planName] || 5000; // Default to 5000 if plan name not found
  };

  const mutation = useAxiosPost("/payments/create-checkout-session");

  const handleCheckout = async (id) => {
    setLoadingPlanId(id);
    const stripe = await stripePromise;

    mutation.mutate(
      { planId : id },
      {
        onSuccess: async (details) => {
          setLoadingPlanId(null);
          const sessionId = details.data.sessionId;
          console.log("Checkout response:", details);

          if (sessionId) {
            // Always use Stripe redirect (both development and production)
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
              console.error("Stripe Checkout Error:", error);
            }
          }
        },
        onError: (error) => {
          console.error("Error creating Plan:", error.response?.data?.message);
          setLoadingPlanId(null);
        },
        onSettled: () => {
          setLoadingPlanId(null);
        },
      }
    );
  };

  return (
    <>
      <div
        className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {buyerPlans?.map((item, index) => (
          <div className="hover:scale-102 duration-300" key={index}>
            <div className={`pricing_packages flex flex-col h-[90%]`}>
              <div className="heading">
                <h5 className={`package_title ${item.uniqueClass || ""}`}>
                  {item?.name}
                </h5>
                <h2 className="text-[#0f8363]">AED {item?.price || getPlanPrice(item?.name)}</h2>
                <Image
                  width={60}
                  height={60}
                  className="price-icon "
                  src={`/images/icon/pricing-icon-${item.name == "Basic Plan" ? "2": item.name == "Intermediate Plan" ? "1" : "3"}.svg`}
                  alt="icon"
                  onError={(e) => {
                    console.error("Pricing icon failed to load:", e);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="details flex flex-col justify-between h-full">
                <p className="text mb25">
                  Contacts Credit <span className="font-semibold">{item.contacts}</span> {/* Display the first feature */}
                </p>
                <div className="list-style1 mb20">
                  <ul>
                    {item.features.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-[15px] leading-4">
                        <i className="far fa-check text-white bgc-dark fz10" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-grid ">
                  {/* <a href="#" className="ud-btn btn-thm-border text-thm">
                    Buy
                    <i className="fal fa-arrow-right-long" />
                  </a> */}
                  <button
                    onClick={() => handleCheckout(item._id)}
                    className="ud-btn btn-thm-border text-thm"
                    disabled={loadingPlanId === item._id}
                  >
                    {loadingPlanId === item._id ? "Processing..." : "Choose Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* End .row */}
    </>
  );
};

export default Pricing;
