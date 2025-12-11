"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import FavouriteCard from "./FavouriteCard";

const ListingsFavourites = () => {
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  // Fetch favourite properties
  const fetchFavouriteProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/property/favourites`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setFavoriteListings(response.data.data || []);
      } else {
        setError("Failed to fetch favourite properties");
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
      setError("Failed to load favourite properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchFavouriteProperties();
    }
  }, [auth.accessToken]);

  const handleDeleteListing = async (propertyId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/property/favourite/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.data.success) {
        // Remove from local state
        setFavoriteListings((prev) => 
          prev.filter((listing) => listing._id !== propertyId)
        );
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
      alert("Failed to remove from favourites");
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price;
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12 px-6">
          <div className="relative inline-block w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-t-[#0f8363] border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading your favourite properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h5 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Favourites</h5>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="inline-flex items-center px-4 py-2 btn-theme-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            onClick={fetchFavouriteProperties}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {favoriteListings.length === 0 ? (
        <div className="w-full">
          <div className="text-center py-8 px-4">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favourite Properties Yet</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              You haven't added any properties to your favourites yet.
              Start exploring properties and add them to your favourites!
            </p>
            <Link
              href="/for-sale/properties/uae"
              className="inline-flex items-center px-4 py-2 btn-theme-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Properties
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {favoriteListings.map((listing) => (
              <div key={listing._id} className="w-full">
                <FavouriteCard
                  listing={listing}
                  onDelete={handleDeleteListing}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsFavourites;
