"use client"
import useAxiosPost from "@/hooks/useAxiosPost";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import Image from "next/image";

const Success = () => {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  console.log(sessionId)
  useEffect(() => {
    setTimeout(() => setShow(true), 200); // Smooth popup effect
  }, []);

  const mutation = useAxiosPost("/webhooks/stripe-webhook")

  useEffect(()=>{
    if (sessionId) {
      // Always use production mode logic (real Stripe sessions)
      mutation.mutate({sessionId},
      {
        onSuccess: async (details) => {
          console.log("Webhook success:", details);
        },
        onError: (error) => {
          console.error("Webhook error:", error.response?.data?.message);
        },
        onSettled: () => {
          // Handle completion
        },
      });
    }
  },[sessionId])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`transition-all duration-500 transform ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        } bg-white text-white p-8 rounded-2xl shadow-lg max-w-5xl text-center relative`}
      >
        <Image 
          src="/images/success.gif" 
          className="relative h-96" 
          width={300} 
          height={300}
          alt="Success"
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute top-[25%]  ">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CiCircleCheck className="text-7xl text-green-500" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold mt-4">Payment Succeeded!</h2>
        <p className="text-gray-500 mt-2">
          Your transaction was completed successfully. Thank you for your purchase!
        </p>

        {/* Button */}
        <Link href={"/dashboard/user/wallet"} className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition">
          Go to Your Dashboard
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
