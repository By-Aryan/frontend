"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";
import { useParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// console.log("🚀 ~ router:~123456", router.query)
const SellerPricing = ({ sellerPlans }) => {
  let APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const params = useParams();
  const propertyId = params.propertyId || "";
  console.log("🚀 ~ SellerPricing ~ propertyId:", propertyId);
  console.log("🚀 ~ APP_BASE_URL:", APP_BASE_URL);

  const [loadingPlanId, setLoadingPlanId] = useState(null);

  // Define the specific prices for seller boost plans based on plan name
  const getPlanPrice = (planName) => {
    const priceMap = {
      "Basic Boost Plan": 30,
      "Standard Boost Plan": 50,  // Added this mapping
      "Intermediate Boost Plan": 50,
      "Premium Boost Plan": 180,
      "Basic Plan": 30,
      "Intermediate Plan": 50,
      "Dedicated Expert Plan": 180,
      "Premium Plan": 180
    };
    return priceMap[planName] || 30; // Default to 30 if plan name not found
  };

  // Define the specific days for seller boost plans based on plan name
  const getPlanDays = (planName) => {
    const daysMap = {
      "Basic Boost Plan": 3,
      "Standard Boost Plan": 7,  // Added this mapping
      "Intermediate Boost Plan": 7,
      "Premium Boost Plan": 30,
      "Basic Plan": 3,
      "Intermediate Plan": 7,
      "Dedicated Expert Plan": 30,
      "Premium Plan": 30
    };
    return daysMap[planName] || 3; // Default to 3 if plan name not found
  };

  const mutation = useAxiosPost("/property/boost-create-checkout-session");
  const clearMutation = useAxiosPost("/property/clear-pending-boost-payments");

  const handleCheckout = async (id) => {
    setLoadingPlanId(id);
    const stripe = await stripePromise;

    const requestData = {
      planId: id,
      propertyId: propertyId,
      success_url: APP_BASE_URL + `/seller-pricing/${propertyId}`,
      cancel_url: APP_BASE_URL + `/seller-pricing/${propertyId}`,
    };

    console.log('🚀 Boost checkout request data:', requestData);

    mutation.mutate(
      requestData,
      {
        onSuccess: async (details) => {
          setLoadingPlanId(null);
          const sessionId = details.data.sessionId;
          console.log("Boost checkout response:", details);

          if (sessionId) {
            // Always use Stripe redirect (both development and production)
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
              console.error("Stripe Checkout Error:", error);
            }
          }
        },
        onError: (error) => {
          const errorData = error.response?.data;
          const errorMessage = errorData?.error || errorData?.message || error.message || 'Unknown error occurred';
          const errorCode = errorData?.code;

          console.error("Error creating Plan:", {
            message: errorMessage,
            code: errorCode,
            status: error.response?.status,
            data: errorData
          });

          // Show user-friendly error message based on error code or message
          if (errorCode === 'MISSING_EMAIL') {
            alert('❌ Your account is missing an email address. Please update your profile and try again.');
          } else if (errorCode === 'MISSING_REQUIRED_FIELDS') {
            alert('❌ Missing required information. Please refresh the page and try again.');
          } else if (errorCode === 'INVALID_PLAN_ID' || errorCode === 'PLAN_NOT_FOUND') {
            alert('❌ Invalid plan selected. Please refresh the page and try again.');
          } else if (errorCode === 'INVALID_PROPERTY_ID') {
            alert('❌ Invalid property. Please check the URL and try again.');
          } else if (errorCode === 'INVALID_PLAN_CATEGORY') {
            alert('❌ This plan cannot be used for boosting properties. Please contact support.');
          } else if (errorMessage.includes('Property not found')) {
            alert('❌ Property not found. Please check the URL and try again.');
          } else if (errorMessage.includes("don't have permission")) {
            alert('❌ You don\'t have permission to boost this property. Only the property owner can boost it.');
          } else if (errorMessage.includes('pending_delist') || errorMessage.includes('delisted')) {
            alert('❌ This property cannot be boosted because it is delisted or pending deletion. Please relist the property first.');
          } else if (errorMessage.includes('already boosted')) {
            alert('⚠️ This property is already boosted. Please wait for the current boost to expire before purchasing a new one.');
          } else if (errorMessage.includes('not approved') || errorMessage.includes('visible to buyers')) {
            alert('❌ This property must be approved and visible to buyers before it can be boosted.');
          } else if (errorCode === 'PENDING_BOOST_PAYMENT' || errorMessage.includes('pending boost payment')) {
            const pendingPayment = errorData?.pendingPayment;
            let message = '⚠️ There is an incomplete payment for this property.\n\n' +
              'This usually happens when a previous checkout was started but not completed.\n\n';

            if (pendingPayment) {
              message += `Plan: ${pendingPayment.planName}\n`;
              message += `Amount: AED ${pendingPayment.amount}\n`;
              if (pendingPayment.createdAt) {
                const createdDate = new Date(pendingPayment.createdAt).toLocaleString();
                message += `Created: ${createdDate}\n`;
              }
              message += '\n';
            }

            message += 'Would you like to clear the pending payment and try again?\n\n' +
              'Click OK to clear and retry, or Cancel to go back.';

            const confirmClear = window.confirm(message);

            if (confirmClear) {
              // Call the cleanup endpoint first
              clearPendingPayments(id);
            }
          } else if (error.response?.status === 401) {
            alert('❌ Authentication failed. Please log in again.');
            window.location.href = '/login';
          } else if (error.response?.status === 403) {
            alert('❌ Access denied. You don\'t have permission to perform this action.');
          } else {
            alert(`❌ Error: ${errorMessage}`);
          }

          setLoadingPlanId(null);
        },
        onSettled: () => {
          setLoadingPlanId(null);
        },
      }
    );
  };

  const clearPendingPayments = (planId) => {
    console.log('🧹 Clearing pending payments for property:', propertyId);

    clearMutation.mutate(
      { propertyId: propertyId },
      {
        onSuccess: () => {
          console.log("✅ Pending payments cleared, retrying checkout...");
          // Retry the original checkout after clearing
          setTimeout(() => {
            handleCheckout(planId);
          }, 500);
        },
        onError: (error) => {
          console.error("Failed to clear pending payments:", error);
          const errorMessage = error.response?.data?.error || error.message || 'Unknown error';

          if (error.response?.status === 403) {
            alert("❌ Access denied. You don't have permission to clear payments for this property.");
          } else if (error.response?.status === 404) {
            alert("❌ Property not found. Please check the URL and try again.");
          } else {
            alert(`❌ Failed to clear pending payments: ${errorMessage}\n\nPlease try again or contact support.`);
          }
          setLoadingPlanId(null);
        }
      }
    );
  };

  const getCardBackground = (planName) => {
    if (planName === "Intermediate Boost Plan" || planName === "Standard Boost Plan") {
      return "bg-[#e8f4f8]"; // Light blue/teal background
    }
    return "bg-white";
  };



  return (
    <>
      <div
        className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-6xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {sellerPlans?.map((item, index) => (
          <div
            className="hover:scale-105 duration-300 transition-transform"
            key={index}
          >
            <div
              className={`${getCardBackground(
                item.name
              )} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}
            >
              {/* Header Section */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {item?.name}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  AED {getPlanPrice(item?.name)}
                </div>
                <p className="text-sm text-gray-600">
                  Featured for {getPlanDays(item?.name)} Days
                </p>
              </div>

              {/* Features Section */}
              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {item?.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button Section */}
              <div className="mt-auto">
                <button
                  onClick={() => handleCheckout(item._id)}
                  className="w-full py-3 px-6 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingPlanId === item._id}
                >
                  {loadingPlanId === item._id ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="https://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Choose Plan"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerPricing;
