"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const FavouriteCard = ({ listing, onDelete }) => {
  const getPropertyImageUrl = (listing) => {
    if (listing.developer_notes?.images && listing.developer_notes.images.length > 0) {
      return listing.developer_notes.images[0].full_url || "/images/listings/propertiesAdsDemo.jpg";
    }
    return "/images/listings/propertiesAdsDemo.jpg";
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Price on request";

    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const getLocation = () => {
    const location = listing.location || {};
    return location.city || location.neighborhood || location.street || "Location not available";
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48">
        <Image
          width={400}
          height={192}
          className="w-full h-full object-cover"
          src={getPropertyImageUrl(listing)}
          alt={listing.reference_number || "Property"}
          priority={true}
        />

        {/* Heart button */}
        <button
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          onClick={() => onDelete(listing._id)}
          title="Remove from Favourites"
        >
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Featured badge if applicable */}
        {listing.isFeatured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            FEATURED
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-2">
            AED {formatPrice(listing.price || 0)}
            {listing.details?.purpose === "Rent" && (
              <span className="text-base font-medium text-gray-600">Yearly</span>
            )}
          </div>
        </div>

        {/* Property type and details */}
        <div className="flex items-center gap-4 mb-2 text-sm text-gray-900">
          <span className="font-semibold">
            {listing.details?.property_type || 'Apartments'}
          </span>
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-xs"></i>
            <span>{listing.details?.bedrooms || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-xs"></i>
            <span>{listing.details?.bathrooms || 'N/A'}</span>
          </div>
          <span>
            Area: {listing.details?.size?.value || "N/A"} sqft
          </span>
        </div>

        {/* Property features tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="text-blue-600 text-xs font-medium">
            {listing.details?.furnishing === "yes" ? "Furnished" : "Unfurnished"}
          </span>
          <span className="text-blue-600 text-xs font-medium">| Vacant</span>
          <span className="text-blue-600 text-xs font-medium">| Large Balcony</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
          <i className="fas fa-map-marker-alt text-xs"></i>
          <span>
            {getLocation()}, {listing.location?.city || listing.location?.emirate || 'Dubai'}
          </span>
        </div>

        {/* Action Button */}
        <Link
          href={`/single-v1/${listing._id}`}
          className="w-full btn-theme-primary hover:bg-primary-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FavouriteCard;