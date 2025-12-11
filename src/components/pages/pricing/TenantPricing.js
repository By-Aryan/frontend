"use client";
import useAxiosPost from "@/hooks/useAxiosPost";
import { loadStripe } from "@stripe/stripe-js";

import React, { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// const pricingPackages = [
//   {
//     packageTitle: "Basic",
//     price: "1500 AED",
//     priceIcon: "images/icon/pricing-icon-2.svg",
//     features: [
//       "No Expiry of Plan",
//       "Contact Upto 10",
//       "Ejari Assistance",
//       "Documents Processing",
//       "24/7 Full support",
//     ],
//   },
//   {
//     packageTitle: "Intermediate ",
//     price: "2000 AED",
//     priceIcon: "images/icon/pricing-icon-1.svg",
//     uniqueClass: "unique-class", // Add a unique class for Professional package
//     features: [
//       "No Expiry of Plan",
//       "Contact Upto 20",
//       "Ejari Assistance",
//       "Documentation",
//       "Dedicated expert help",
//       "Viewing assistance",
//       "24/7 Full support",
//     ],
//   },
//   {
//     packageTitle: "Dedicated Expert ",
//     price: "2500 AED",
//     priceIcon: "images/icon/pricing-icon-3.svg",
//     features: [
//      "No Expiry of Plan",
//       "Contact Unlimited",
//       "Ejari Assistance",
//       "Documentation",
//       "Dedicated expert help",
//       "Viewing assistance",
//       "Site visit assistance",
//       "24/7 Full support",
//     ],
//   },
// ];
const RentPricing = ({ tenantPlans }) => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  // Define the specific prices for rent plans based on plan name
  const getPlanPrice = (planName) => {
    const priceMap = {
      "Basic Plan": 1500,
      "Intermediate Plan": 2000,
      "Premium Plan": 2500
    };
    return priceMap[planName] || 1500; // Default to 1500 if plan name not found
  };

  const mutation = useAxiosPost("/payments/create-checkout-session");

  const handleCheckout = async (id) => {
    setLoadingPlanId(id);
    const stripe = await stripePromise;

    mutation.mutate(
      { planId: id },
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
        {tenantPlans?.map((item, index) => (
          <div className="hover:scale-102 duration-300 " key={index}>
            <div className={`pricing_packages flex flex-col h-[90%]`}>
              <div className="heading ">
                <h5 className={`package_title ${item.uniqueClass || ""}`}>
                  {item.name}
                </h5>
                <h2 className=" text-[#0f8363]">AED {item?.price || getPlanPrice(item.name)}</h2>
              </div>
              <div className="details flex flex-col justify-between h-full">
                <p className="text mb25">
                  Contact Credits{" "}
                  <span className="font-semibold">
                    {item.name == "Premium Plan" ? "Unlimited" : item.contacts}
                  </span>{" "}
                  {/* Display the first feature */}
                </p>
                <div className="list-style1 mb40">
                  <ul>
                    {item.features.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-[15px] leading-4">
                        <i className="far fa-check text-white bgc-dark fz15" />
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
                    {loadingPlanId === item._id
                      ? "Processing..."
                      : "Choose Plan"}
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

export default RentPricing;
