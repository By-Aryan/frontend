// "use client";

// import { ApiDeleteRequest, ApiPostRequest } from "@/axios/apiRequest";
// import useAxiosPost from "@/hooks/useAxiosPost";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const FeaturedListings = ({
//   data,
//   colstyle,
//   setIsScheduleTourModal,
//   getImageUrl,
// }) => {
//   console.log("🚀 ~ FeaturedListings ~ data:123435678", data);
//   const router = useRouter();
//   const [showSellerPopup, setShowSellerPopup] = useState(false);
//   const [currentSeller, setCurrentSeller] = useState(null);
//   const isPlanActive = localStorage.getItem("isPlanActive") === "true";
//   console.log("🚀 ~ FeaturedListings ~ isPlanActive:", isPlanActive);
//   const [favorites, setFavorites] = useState({});
//   const [showNoCreditPopup, setShowNoCreditPopup] = useState(false);

//   // Add state to track failed images
//   const [failedImages, setFailedImages] = useState({});

//   // Set up the mutation for tracking contact views
//   const contactViewMutation = useAxiosPost("/subscription/track-contact-view", {
//     onSuccess: (response) => {
//       console.log("🚀 ~ FeaturedListings ~ response:", response.data);
//       if (response.data.status === 1) {
//         setCurrentSeller({
//           name: response.data.sellerDetails?.fullname,
//           phone: response.data.sellerDetails?.mobile,
//           email: response.data.sellerDetails?.email,
//         });
//         setShowSellerPopup(true);
//       } else if (response.data.status === 2) {
//         setShowNoCreditPopup(true);
//       }
//     },
//     onError: (error) => {
//       console.error("Error tracking contact view", error);
//     },
//   });
//   console.log(
//     "🚀 ~ FeaturedListings ~ contactViewMutation:",
//     contactViewMutation.data?.data
//   );

//   const propertyTrackClickMutation = useAxiosPost("/property/track-click", {
//     onSuccess: (response) => {},
//     onError: (error) => {
//       console.error("Error tracking contact view", error);
//     },
//   });

//   // Initialize favorites state from the API data
//   useEffect(() => {
//     if (data && data.length > 0) {
//       const initialFavorites = {};
//       data.forEach((property) => {
//         initialFavorites[property._id] = !!property.is_favourite;
//       });
//       setFavorites(initialFavorites);
//     }
//   }, [data]);

//   // Function to handle favorite toggle
//   const handleFavoriteToggle = async (e, propertyId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       if (favorites[propertyId]) {
//         const response = await ApiDeleteRequest(`/property/favourite`, {
//           property_id: propertyId,
//         });
//         if (response.status === 200) {
//           setFavorites((prev) => ({
//             ...prev,
//             [propertyId]: false,
//           }));
//         }
//       } else {
//         const response = await ApiPostRequest(`/property/favourite`, {
//           property_id: propertyId,
//         });
//         if (response.status === 200) {
//           setFavorites((prev) => ({
//             ...prev,
//             [propertyId]: true,
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Error toggling favorite:", error);
//     }
//   };

//   // Function to handle the "View Number" click
//   const handleViewNumberClick = (e, listing) => {
//     e?.stopPropagation();
//     contactViewMutation.mutate({
//       viewType: "true",
//       propertyId: listing?._id,
//     });
//   };

//   // Close the popups
//   const closePopup = () => {
//     setShowSellerPopup(false);
//   };

//   const getPropertyImageUrl = (listing, index = 0) => {
//     // Create unique key for this image
//     const imageKey = `${listing._id}_${index}`;

//     // If this image has failed before, return default image immediately
//     if (failedImages[imageKey]) {
//       return "/images/listings/propertiesAdsDemo.jpg";
//     }

//     // First try to use processed images (if they exist)
//     if (listing.processedImages && listing.processedImages[index]) {
//       return listing.processedImages[index];
//     }

//     // Use the full_url from developer_notes.images
//     if (
//       listing.developer_notes?.images &&
//       listing.developer_notes.images[index] &&
//       listing.developer_notes.images[index].full_url
//     ) {
//       return listing.developer_notes.images[index].full_url;
//     }

//     // Final fallback to default image
//     return "/images/listings/propertiesAdsDemo.jpg";
//   };

//   // Function to handle image error
//   const handleImageError = (listingId, index) => {
//     const imageKey = `${listingId}_${index}`;
//     setFailedImages(prev => ({
//       ...prev,
//       [imageKey]: true
//     }));
//   };

//   const handlePropertyView = (property_id) => {
//     propertyTrackClickMutation.mutate({ propertyId: property_id });
//     router.push(`/single-v1/${property_id}`);
//   };

//   return (
//     <>
//       {data && data.length > 0 ? (
//         data.map((listing) => (
//           <div
//             className="col-md-12"
//             style={{ cursor: "pointer", marginBottom: "20px" }}
//             key={listing._id}
//             onClick={() => handlePropertyView(listing._id)}
//           >
//             <div
//               className="listing-style1 overflow-hidden"
//               style={{
//                 borderRadius: "8px",
//                 boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//                 border: "1px solid #eee",
//               }}
//             >
//               <div className="list-thumb md:h-[300px] w-full">
//                 <Image
//                   width={382}
//                   height={248}
//                   className="cover h-full w-full object-cover"
//                   src={getPropertyImageUrl(listing, 0)}
//                   alt={`${listing.name || listing.title || "Property"} - Image`}
//                   priority={true}
//                   onError={() => handleImageError(listing._id, 0)}
//                 />
//                 <div className="sale-sticker-wrap">
//                   {/* Show FEATURED badge only for actual featured properties */}
//                   {listing.isFeatured && (
//                     <div
//                       className="list-tag fz12"
//                       style={{
//                         backgroundColor: "#0f8363",
//                         padding: "4px 10px",
//                         borderRadius: "4px",
//                         fontWeight: "600",
//                         fontSize: "12px",
//                         boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                       }}
//                     >
//                       <span className="flaticon-electricity me-1" />⭐ FEATURED
//                     </div>
//                   )}
//                   {/* Show FOR SALE badge for sell properties */}
//                   {listing.details.purpose === "Sell" &&
//                     !listing.isFeatured && (
//                       <div
//                         className="list-tag fz12"
//                         style={{
//                           backgroundColor: "#e74c3c",
//                           padding: "4px 10px",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         <span className="flaticon-home me-1" />
//                         FOR SALE
//                       </div>
//                     )}
//                 </div>

//                 <div
//                   className="list-price md:text-[18px] text-[12px]"
//                   style={{
//                     backgroundColor: "rgba(15, 131, 99, 0.9)",
//                     borderRadius: "4px 0 0 0",
//                   }}
//                 >
//                   AED {listing.price.toLocaleString()} <span></span>
//                 </div>
//               </div>
//               <div className="list-content p-4">
//                 <div className="list-agent">
//                   <Image
//                     width={80}
//                     height={80}
//                     className="rounded-full md:w-[80px] w-[60px] md:h-[80px] h-[60px] object-cover"
//                     src={getPropertyImageUrl(listing, 1)}
//                     alt="agent"
//                     style={{
//                       border: "3px solid white",
//                       boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                     }}
//                     onError={() => handleImageError(listing._id, 1)}
//                   />
//                 </div>
//                 <h6 className="fz18 mb-3">
//                   <span
//                     className="text-[#0f8363]"
//                     style={{
//                       color: "#0f8363",
//                       fontSize: "18px",
//                       fontWeight: "600",
//                     }}
//                   >
//                     {listing.name || listing.title || "Untitled Property"}
//                   </span>
//                 </h6>
//                 <div className="flex md:flex-row flex-col md:gap-[20px] gap-[10px] md:items-center">
//                   <p
//                     className="list-text w-[300px] mb-3"
//                     style={{ fontSize: "14px", color: "#666" }}
//                   >
//                     {listing.location.address}
//                   </p>
//                   <div className="flex gap-1 mb-3">
//                     <button
//                       className="text-white text-center lg:text-[16px] text-[12px] flex justify-center items-center md:gap-[5px] gap-[2px] cursor-pointer md:py-2 py-1 md:px-3 px-2 rounded-lg bg-[#2a9075] hover:bg-[#0f8363] duration-200"
//                       style={{
//                         fontWeight: 500,
//                         height: "38px",
//                         minWidth: "130px",
//                         backgroundColor: "#0f8363",
//                         fontSize: "14px",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseOver={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#0a6e53")
//                       }
//                       onMouseOut={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#0f8363")
//                       }
//                       onClick={(e) => handleViewNumberClick(e, listing)}
//                     >
//                       <i
//                         className="fas fa-eye mr-1"
//                         style={{ fontSize: "14px" }}
//                       ></i>
//                       View Number
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                   className="list-meta d-flex align-items-center gap-3 text-[#0f8363] fsz10 mb-3"
//                   style={{ fontSize: "13px" }}
//                 >
//                   <a
//                     className="d-flex align-items-center"
//                     onClick={(e) => e.stopPropagation()}
//                     href="#"
//                     style={{ height: "28px" }}
//                   >
//                     <span
//                       className="flaticon-bed mr-2"
//                       style={{ display: "flex", alignItems: "center" }}
//                     />{" "}
//                     {listing.details.bedrooms} bed
//                   </a>
//                   <a
//                     className="d-flex align-items-center"
//                     onClick={(e) => e.stopPropagation()}
//                     href="#"
//                     style={{ height: "28px" }}
//                   >
//                     <span
//                       className="flaticon-shower mr-2"
//                       style={{ display: "flex", alignItems: "center" }}
//                     />{" "}
//                     {listing.details.bathrooms} bath
//                   </a>
//                   <a
//                     className="d-flex align-items-center"
//                     onClick={(e) => e.stopPropagation()}
//                     href="#"
//                     style={{ height: "28px" }}
//                   >
//                     <span
//                       className="flaticon-expand mr-2"
//                       style={{ display: "flex", alignItems: "center" }}
//                     />{" "}
//                     {listing.details.size.value} sqft
//                   </a>
//                 </div>
//                 <hr className="mt-3 mb-3" style={{ borderColor: "#f0f0f0" }} />
//                 <div className="list-meta2 d-flex justify-content-between align-items-center">
//                   <span
//                     className="for-what"
//                     style={{
//                       height: "28px",
//                       display: "flex",
//                       alignItems: "center",
//                       fontSize: "13px",
//                       fontWeight: "500",
//                       color: "#666",
//                     }}
//                   >
//                     For {listing.details.purpose}
//                   </span>
//                   <div className="icons d-flex align-items-center gap-2">
//                     <a
//                       href="#"
//                       className="hover:text-[#0f8363]"
//                       onClick={(e) => e.stopPropagation()}
//                       style={{
//                         height: "28px",
//                         width: "28px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#777",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseOver={(e) =>
//                         (e.currentTarget.style.color = "#0f8363")
//                       }
//                       onMouseOut={(e) => (e.currentTarget.style.color = "#777")}
//                     >
//                       <span className="flaticon-new-tab" />
//                     </a>
//                     <a
//                       href="#"
//                       className="hover:text-[#0f8363]"
//                       style={{
//                         height: "28px",
//                         width: "28px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: favorites[listing._id] ? "#e74c3c" : "#777",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseOver={(e) => {
//                         if (!favorites[listing._id]) {
//                           e.currentTarget.style.color = "#0f8363";
//                         }
//                       }}
//                       onMouseOut={(e) => {
//                         if (!favorites[listing._id]) {
//                           e.currentTarget.style.color = "#777";
//                         }
//                       }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleFavoriteToggle(e, listing._id);
//                       }}
//                     >
//                       <span
//                         className={
//                           favorites[listing._id]
//                             ? "fas fa-heart"
//                             : "flaticon-like"
//                         }
//                         style={{
//                           color: favorites[listing._id] ? "#e74c3c" : "inherit",
//                         }}
//                       />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="col-12 text-center py-5">
//           <p style={{ fontSize: "16px", color: "#666" }}>
//             No properties found.
//           </p>
//         </div>
//       )}

//       {/* Seller Info Popup */}
//       {showSellerPopup && currentSeller && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#0f8363]">
//                 Seller Information
//               </h3>
//               <button
//                 onClick={closePopup}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="mb-4">
//               <p className="mb-2">
//                 <span className="font-medium">Name:</span> {currentSeller.name}
//               </p>
//               <p className="mb-2">
//                 <span className="font-medium">Phone:</span>{" "}
//                 {currentSeller.phone}
//               </p>
//               <p>
//                 <span className="font-medium">Email:</span>{" "}
//                 {currentSeller.email}
//               </p>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={closePopup}
//                 className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* No Credit Popup */}
//       {showNoCreditPopup && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
//           onClick={() => setShowNoCreditPopup(false)}
//         >
//           <div
//             className="bg-white rounded-lg p-6 w-full max-w-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#0f8363]">
//                 No Credits Available
//               </h3>
//               <button
//                 onClick={() => setShowNoCreditPopup(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="mb-4">
//               <p className="mb-3">{contactViewMutation.data?.data?.message}</p>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowNoCreditPopup(false)}
//                 className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setShowNoCreditPopup(false);
//                   router.push("/pricing");
//                 }}
//                 className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
//               >
//                 View Plans
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FeaturedListings;
"use client";
import { ApiDeleteRequest, ApiPostRequest } from "@/axios/apiRequest";
import useAxiosPost from "@/hooks/useAxiosPost";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FeaturedListings = ({
  data,
  colstyle,
  setIsScheduleTourModal,
  getImageUrl,
}) => {
  console.log("🚀 ~ FeaturedListings ~ data:123435678", data);
  const router = useRouter();
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const isPlanActive = localStorage.getItem("isPlanActive") === "true";
  console.log("🚀 ~ FeaturedListings ~ isPlanActive:", isPlanActive);
  const [favorites, setFavorites] = useState({});
  const [showNoCreditPopup, setShowNoCreditPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);

  // Add state to track failed images
  const [failedImages, setFailedImages] = useState({});

  // Set up the mutation for tracking contact views
  const contactViewMutation = useAxiosPost("/subscription/track-contact-view", {
    onSuccess: (response) => {
      console.log("🚀 ~ FeaturedListings ~ response:", response.data);
      if (response.data.status === 1) {
        setCurrentSeller({
          name: response.data.sellerDetails?.fullname,
          phone: response.data.sellerDetails?.mobile,
          email: response.data.sellerDetails?.email,
        });
        setShowSellerPopup(true);
      } else if (response.data.status === 2) {
        setShowNoCreditPopup(true);
      }
    },
    onError: (error) => {
      console.error("Error tracking contact view", error);
      if (error.response?.status === 401) {
        setShowLoginPopup(true);
      } else if (error.response?.status === 403) {
        setShowRolePopup(true);
      }
    },
  });

  const propertyTrackClickMutation = useAxiosPost("/property/track-click", {
    onSuccess: (response) => {},
    onError: (error) => {
      console.error("Error tracking contact view", error);
    },
  });

  // Initialize favorites state from the API data
  useEffect(() => {
    if (data && data.length > 0) {
      const initialFavorites = {};
      data.forEach((property) => {
        // Use is_favourite from API response
        initialFavorites[property._id] = !!property.is_favourite;
      });
      setFavorites(initialFavorites);
      console.log("🔍 Initialized favorites from API:", initialFavorites);
    }
  }, [data]);

  // Function to handle favorite toggle
  const handleFavoriteToggle = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🔄 Toggling favorite for property:", propertyId);
    console.log("🔍 Current favorite status:", favorites[propertyId]);

    try {
      // Always use toggle endpoint for consistency
      const response = await ApiPostRequest(`/property/favourite`, {
        property_id: propertyId,
      });

      if (response.data.success) {
        const newFavoriteStatus = response.data.is_favourite;
        setFavorites((prev) => ({
          ...prev,
          [propertyId]: newFavoriteStatus,
        }));
        console.log("✅ Favorite toggled successfully:", newFavoriteStatus);
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
      // If API fails, revert the UI change
      alert("Failed to update favorite. Please try again.");
    }
  };

  // Function to handle the "View Number" click
  const handleViewNumberClick = (e, listing) => {
    e?.stopPropagation();
    
    // Check if user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginPopup(true);
      return;
    }

    // Removed role check - now depends on backend credit validation
    // Let the backend handle access control based on credits

    contactViewMutation.mutate({
      viewType: "true",
      propertyId: listing?._id,
    });
  };

  // Close the popups
  const closePopup = () => {
    setShowSellerPopup(false);
  };

  const getPropertyImageUrl = (listing, index = 0) => {
    // Create unique key for this image
    const imageKey = `${listing?._id}_${index}`;

    // If this image has failed before, return default image immediately
    if (failedImages[imageKey]) {
      return "/images/listings/propertiesAdsDemo.jpg";
    }

    // First try to use processed images (if they exist)
    if (listing.processedImages && listing.processedImages[index]) {
      return listing.processedImages[index];
    }

    // Use the full_url from developer_notes.images
    if (
      listing.developer_notes?.images &&
      listing.developer_notes.images[index] &&
      listing.developer_notes.images[index].full_url
    ) {
      return listing.developer_notes.images[index].full_url;
    }

    // Final fallback to default image
    return "/images/listings/propertiesAdsDemo.jpg";
  };

  // Function to handle image error
  const handleImageError = (listingId, index) => {
    const imageKey = `${listingId}_${index}`;
    setFailedImages((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  const handlePropertyView = (property_id) => {
    propertyTrackClickMutation.mutate({ propertyId: property_id });
    router.push(`/single-v1/${property_id}`);
  };

  return (
    <>
      {data && data.length > 0 ? (
        data.map((listing) => (
          <div
            className="col-md-12"
            style={{ cursor: "pointer", marginBottom: "16px" }}
            key={listing?._id}
            onClick={() => handlePropertyView(listing?._id)}
          >
            <div
              className="property-card"
              style={{
                display: "flex",
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                border: "1px solid lightgrey",
                transition: "all 0.3s ease",
                minHeight: "200px",
              }}
            >
              {/* Left side - Image */}
              <div
                className="property-image-container"
                style={{
                  width: "280px",
                  minWidth: "280px",
                  height: "200px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  width={280}
                  height={200}
                  className="property-image"
                  src={getPropertyImageUrl(listing, 0)}
                  alt={`${listing?.name || listing?.title || "Property"} - Image`}
                  priority={true}
                  onError={() => handleImageError(listing?._id, 0)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* TruCheck Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                ></div>

                {/* Featured/Sale Badge */}
                {listing?.isFeatured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: "#ff6b35",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    FEATURED
                  </div>
                )}

                {/* Heart Icon */}
                <button
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={(e) => handleFavoriteToggle(e, listing?._id)}
                >
                  <i
                    className={
                      favorites[listing?._id] ? "fas fa-heart" : "far fa-heart"
                    }
                    style={{
                      color: favorites[listing?._id] ? "#e74c3c" : "#666",
                      fontSize: "16px",
                    }}
                  ></i>
                </button>

                {/* Navigation arrows - if you want to add them later */}
                <button
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  ‹
                </button>
                <button
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  ›
                </button>

                {/* Image indicators */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor:
                          i === 0 ? "white" : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right side - Content */}
              <div
                className="property-content"
                style={{
                  flex: 1,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Top section */}
                <div>
                  {/* Price */}
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#2c3e50",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                    }}
                  >
                    AED {listing.price ? listing.price.toLocaleString() : 'N/A'}
                    {/* Only show "Yearly" for rent properties */}
                    {listing.details?.purpose === "Rent" && (
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#7f8c8d",
                        }}
                      >
                        Yearly
                      </span>
                    )}
                  </div>

                  {/* Property type and details */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      color: "#2c3e50",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>
                      {listing.details?.property_type || 'N/A'}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i
                        className="fas fa-bed"
                        style={{ fontSize: "12px" }}
                      ></i>
                      <span>{listing.details?.bedrooms || 'N/A'}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i
                        className="fas fa-bath"
                        style={{ fontSize: "12px" }}
                      ></i>
                      <span>{listing.details?.bathrooms || 'N/A'}</span>
                    </div>
                    <span>
                      Area: {listing.details?.size?.value || "N/A"} sqft
                    </span>
                  </div>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "#0066cc",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {listing.details?.furnishing === "yes"
                        ? "Furnished"
                        : "Unfurnished"}
                    </span>
                    <span
                      style={{
                        color: "#0066cc",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      | Vacant
                    </span>
                    <span
                      style={{
                        color: "#0066cc",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      | Large Balcony
                    </span>
                  </div>

                  {/* Location */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "8px",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    <i
                      className="fas fa-map-marker-alt"
                      style={{ fontSize: "12px" }}
                    ></i>
                    <span>
                      {listing.location?.address || 'N/A'}, {listing.location?.city || 'N/A'}
                    </span>
                  </div>

                  {/* Agent info */}
                </div>

                {/* Bottom section - Action buttons */}
                {/* Bottom section - Action buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#0f8363", // Dark Green
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      minWidth: "140px", // 👈 controls button width
                    }}
                    onClick={(e) => handleViewNumberClick(e, listing)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#000"; // Hover Black
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#0f8363"; // Reset to Dark Green
                    }}
                  >
                    <i
                      className="fas fa-phone"
                      style={{ fontSize: "12px" }}
                    ></i>
                    View Number
                  </button>

                  {/* Company logo */}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center py-5">
          <p style={{ fontSize: "16px", color: "#666" }}>
            No properties found.
          </p>
        </div>
      )}

      {/* Seller Info Popup */}
      {showSellerPopup && currentSeller && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0f8363]">
                Seller Information
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-2">
                <span className="font-medium">Name:</span> {currentSeller.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Phone:</span>{" "}
                {currentSeller.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {currentSeller.email}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closePopup}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Credit Popup */}
      {showNoCreditPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowNoCreditPopup(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0f8363]">
                No Credits Available
              </h3>
              <button
                onClick={() => setShowNoCreditPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">{contactViewMutation.data?.data?.message}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoCreditPopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNoCreditPopup(false);
                  router.push("/pricing");
                }}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0f8363]">
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">You need to login to view seller contact details.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  router.push("/login");
                }}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Role Required Popup */}
      {showRolePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowRolePopup(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#e74c3c]">
                Access Restricted
              </h3>
              <button
                onClick={() => setShowRolePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">Only buyers can view seller contact details.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRolePopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedListings;
