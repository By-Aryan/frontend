import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

const PropertyCarousel = ({ Images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!Images || Images.length === 0) return null;
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '');
  return (
    <div className="ps-v6-slider nav_none mt30">
      {/* <Gallery>
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2 position-relative sp-img-content"
        >
          {Images.map((item, i) => (
            <SwiperSlide key={i}>
              <Item original={item} thumbnail={item} width={1206} height={671}>
                {({ ref, open }) => (
                  <Image
                    width={1206}
                    height={671}
                    ref={ref}
                    onClick={open}
                    src={backendBaseUrl+ item}
                    alt="gallery"
                    className="w-100 h-auto bdrs12 pointer"
                  />
                )}
              </Item>
              <button className="all-tag popup-img border-0 pe-none">See All 74 Photos</button>
            </SwiperSlide>
          ))}
        </Swiper>
      </Gallery>

      <div className="row">
        <div className="col-lg-5 col-md-7">
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper mt20"
          >
            {Images.map((item, i) => (
              <SwiperSlide key={i}>
                <Image
                  height={90}
                  width={83}
                  src={backendBaseUrl+item}
                  alt="thumbnail"
                  className="w-100 bdrs12 cover pointer"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div> */}
    </div>
  );
};

export default PropertyCarousel;
