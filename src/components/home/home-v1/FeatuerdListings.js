"use client";
import { usePropertyStore } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect } from "react";

const FeaturedListings = () => {
  const { properties, setProperties } = usePropertyStore();
  
  // Fetch featured properties from API
  const { data: featuredData, isLoading, error } = useAxiosFetch("/property/featured");
  
  useEffect(() => {
    if (featuredData && featuredData.length > 0) {
      // Transform API data to match expected format
      const transformedProperties = featuredData.map(property => ({
        id: property._id,
        image: property.developer_notes?.images?.[0] ? 
               `https://147.93.98.24:5001${property.developer_notes.images[0]}` : 
               "/images/listings/g1-1.jpg",
        slug: property._id,
        title: property.title || property.name,
        city: property.location?.city || "",
        location: property.location?.address || "",
        bed: property.details?.bedrooms?.toString() || "0",
        bath: property.details?.bathrooms?.toString() || "0",
        sqft: property.details?.size?.value || 0,
        price: `AED ${property.price?.toLocaleString() || '0'}`,
        forRent: property.details?.purpose?.toLowerCase() === 'rent',
        tags: ["property"],
        propertyType: property.details?.property_type || "Property",
        yearBuilding: property.building_information?.year_of_completion || 2020,
        featured: true,
        lat: property.location?.latitude || 40.7279707552121,
        long: property.location?.longitude || -74.07152705896405,
        features: [
          ...(property.features_amenities || []),
          ...(property.other_amenities || [])
        ],
      }));
      
      setProperties(transformedProperties);
    }
  }, [featuredData, setProperties]);

  const backendBaseUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <p>Loading featured properties...</p>
      </div>
    );
  }

  // Show error state  
  if (error) {
    return (
      <div className="text-center py-5">
        <p>Error loading properties. Please try again later.</p>
      </div>
    );
  }

  // Show empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-5">
        <p>No featured properties available.</p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        className="items-stretch"
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".featured-next__active",
          prevEl: ".featured-prev__active",
        }}
        pagination={{
          el: ".featured-pagination__active",
          clickable: true,
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {properties?.slice(0, 4).map((listing) => (
          <SwiperSlide key={listing.id} className=" ">
            <Link
              href={`/single-v1/${listing.id}`}
              className="item"
            >
              <div className="listing-style1">
                <div className="list-thumb w-[100%] h-[248px]">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 object-cover"
                    src={listing.image}
                    alt="listings"
                  />
                  <div className="sale-sticker-wrap">
                    {listing.featured && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}
                  </div>

                  <div className="list-price">
                    {listing.price} <span></span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="fz18  min-w-[50px] text-nowrap truncate">
                    <a
                      className="text-[#0f8363]"
                      style={{ color: "#0f8363" }}
                      href={`/single-v2/${listing.id}`}
                    >
                      {listing.title}
                    </a>
                  </h6>
                  <p className="list-text">
                    {typeof listing.location === 'string' 
                      ? listing.location 
                      : listing.location?.address || 
                        `${listing.location?.city || ''}, ${listing.location?.emirate || ''}`.replace(/^, |, $/, '') || 
                        'Location not available'
                    }
                  </p>
                  <div className="list-meta d-flex align-items-center gap-1">
                    <a href="#">
                      <span className="flaticon-bed" />{" "}
                      {listing.bed} bed
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" />{" "}
                      {listing.bath} bath
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" />{" "}
                      {listing.sqft} sqft
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">
                      For {listing.forRent ? 'Rent' : 'Sale'}
                    </span>
                    <div className="icons d-flex align-items-center">
                      <a href="#">
                        <span className="flaticon-fullscreen" />
                      </a>
                      <a href="#">
                        <span className="flaticon-new-tab" />
                      </a>
                      <a href="#">
                        <span className="flaticon-like" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="row align-items-center justify-content-center">
        <div className="col-auto">
          <button className="featured-prev__active swiper_button">
            <i className="far fa-arrow-left-long" />
          </button>
        </div>
        {/* End prev */}

        <div className="col-auto">
          <div className="pagination swiper--pagination featured-pagination__active" />
        </div>
        {/* End pagination */}

        <div className="col-auto">
          <button className="featured-next__active swiper_button">
            <i className="far fa-arrow-right-long" />
          </button>
        </div>
        {/* End Next */}
      </div>
      {/* End .col for navigation and pagination */}
    </>
  );
};

export default FeaturedListings;
