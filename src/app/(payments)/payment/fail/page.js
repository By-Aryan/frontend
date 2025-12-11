"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";

const Fail = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200); // Smooth popup effect
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`transition-all duration-500 transform ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        } bg-white text-white p-8 rounded-2xl shadow-lg max-w-5xl text-center relative`}
      >
        <div className="">
        {/* Success Icon */}
        <div className="flex justify-center">
          <MdOutlineErrorOutline className="text-7xl text-red-500" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold mt-4">Payment Failed!</h2>
        <p className="text-gray-500 mt-2">
          Your transaction was Failed.
        </p>

        {/* Button */}
        <Link href={"/pricing"} className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition">
          Go to Your Dashboard
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Fail;
