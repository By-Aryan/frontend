"use client";
import { pageRoutes } from "@/utilis/common";
import Link from "next/link";
import React from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useAxiosFetch from "@/hooks/useAxiosFetch";

const ApartmentType = () => {

  // const { data, isLoading, error } = useAxiosFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property/property-types`);



  // const apartmentType= [
  //   { id: 1, icon: "flaticon-home", url:"/for-sale/Houses/uae", title: "Houses", count: 22 },
  //   { id: 2, icon: "flaticon-corporation", url:"/for-sale/Apartments/uae", title: "Apartments", count: 22 },
  //   { id: 3, icon: "flaticon-network", url:"/for-sale/Office/uae", title: "Office", count: 22 },
  //   { id: 4, icon: "flaticon-garden", url:"/for-sale/Villa/uae", title: "Villa", count: 22 },
  //   { id: 5, icon: "flaticon-chat", url:"/for-sale/Townhome/uae", title: "Townhome", count: 22 },
  //   { id: 6, icon: "flaticon-window", url:"/for-sale/Bungalow/uae", title: "Bungalow", count: 22 },
  //   { id: 7, icon: "flaticon-bird-house", url:"/for-sale/Loft/uae", title: "Loft", count: 22 },
  // ];


  const { data, isLoading, error } = useAxiosFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property/property-types-count`);

// Define all property types you want to display
const allPropertyTypes = [
  'House',
  'Apartment',
  'Office',
  'Villa',
  'Townhome',
  'Bungalow',
  'Loft'
];

// Function to get the appropriate icon based on property type
const getPropertyIcon = (propertyType) => {
  const typeToIcon = {
    'House': 'flaticon-home',
    'Houses': 'flaticon-home',
    'Apartment': 'flaticon-corporation',
    'Apartments': 'flaticon-corporation',
    'Office': 'flaticon-network',
    'Villa': 'flaticon-garden',
    'Townhome': 'flaticon-chat',
    'Bungalow': 'flaticon-window',
    'Loft': 'flaticon-bird-house'
  };

  return typeToIcon[propertyType] || 'flaticon-home'; // Default icon if type not found
};

// Format the data from API response, ensuring all property types are included
const formatPropertyTypes = (apiData) => {
  console.log(apiData?.data);
  
  // Create a map of existing property types from API
  const apiPropertyMap = {};
  if (apiData && Array.isArray(apiData.data)) {
    apiData.data.forEach(item => {
      apiPropertyMap[item.property_type] = item.count || 0;
    });
  }
  
  // Create the final array with all property types
  return allPropertyTypes.map((propertyType, index) => ({
    id: index + 1,
    icon: getPropertyIcon(propertyType),
    url: `/for-sale/${propertyType.toLowerCase()}/uae`,
    title: propertyType,
    count: apiPropertyMap[propertyType] || 0
  }));
};

// Use the formatted data instead of hardcoded array
const apartmentType = isLoading ? [] : formatPropertyTypes(data);

  return (
    <Swiper
      className="overflow-visible"
      spaceBetween={30}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".next__active",
        prevEl: ".prev__active",
      }}
      pagination={{
        el: ".pagination__active",
        clickable: true,
      }}
      breakpoints={{
        300: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
      }}
    >
      {apartmentType.map((type) => (
        <SwiperSlide key={type.id}>
          <div className="item">
            <Link href={type.url}>
              <div className="iconbox-style1">
                <span className={`icon ${type.icon}`} />
                <div className="iconbox-content">
                  <h6 className="title">{type.title}</h6>
                  <p className="text mb-0">{`${type.count} Properties`}</p>
                </div>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ApartmentType;
