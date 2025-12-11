"use client";
import listings from "@/data/listings";
import { pageRoutes } from "@/utilis/common";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const PopularListings = ({data = listings }) => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '');
  return (
    <>
      <Swiper
        spaceBetween={30}
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
            slidesPerView: 4,
          },
        }}
      >
        {data.slice(0, 8).map((listing) => (
          <SwiperSlide key={listing._id}>
            <Link href={`/single-v1/${listing._id}`} className="item">
              <div className="listing-style1">
                <div className="list-thumb w-[100%] h-[228px]">
                  {/* <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 object-cover"
                    src={backendBaseUrl + listing?.developer_notes?.images[0]}
                    alt="listings"
                  /> */}
                  <div className="sale-sticker-wrap">
                    {listing.featured && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}
                  </div>

                  <div className="list-price">
                   AED {listing.price} <span></span>
                  </div>
                </div>
                <div className="list-content">
                <h6 className="fz18 min-w-[50px] text-nowrap truncate">
                    <a
                      className="text-[#0f8363]"
                      style={{ color: "#0f8363" }}
                      href={`/single-v2/${listing._id}`}
                    >
                      {listing.name}
                    </a>
                  </h6>
                  <p className="list-text">{listing.location.address}</p>
                  <div className="list-meta d-flex align-items-center gap-2">
                    <a href="#">
                      <span className="flaticon-bed" /> {listing.details.bedrooms} bed
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {listing.details.bathrooms} bath
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {listing.details.size.value} sqft
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">For {listing.details.purpose}</span>
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
    </>
  );
};

export default PopularListings;
