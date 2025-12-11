"use client";

import cities from "@/data/propertyByCities";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const PropertiesByCities = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation]}
        navigation={{
          nextEl: ".property-by-city-next__active",
          prevEl: ".property-by-city-prev__active",
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cities.slice(0, 6).map((city) => (
          <SwiperSlide key={city.id}>
            <Link href={`/properties/All/${encodeURIComponent(city.name)}`}>
              <div className="item cursor-pointer">
                <div className="feature-style1">
                  <div className="feature-img max-h-[400px] md:h-[400px] h-[200px]">
                    <Image
                      width={400}
                      height={200}
                      className="w-100 h-100 object-cover"
                      src={city.image}
                      alt={city.name}
                    />
                  </div>
                  <div className="feature-content bg-black/20">
                    <div className="top-area">
                      <h6 className="title mb-1">{city.name}</h6>
                      <p className="text">{city.propertyCount} Properties</p>
                    </div>
                    <div className="bottom-area">
                      <span className="ud-btn2">
                        See Properties <i className="fal fa-arrow-right-long" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="property-by-city-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        <button className="property-by-city-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
      </div>
    </>
  );
};

export default PropertiesByCities;
