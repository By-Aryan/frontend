"use client";

import CallToActions from "@/components/common/CallToActions";
import Explore from "@/components/common/Explore";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import About from "@/components/home/home-v1/About";
import ApartmentType from "@/components/home/home-v1/ApartmentType";
import Header from "@/components/home/home-v1/Header";
import PopulerProperty from "@/components/home/home-v1/PopulerProperty";
import PropertiesByCities from "@/components/home/home-v1/PropertiesByCities";
import Testimonial from "@/components/home/home-v1/Testimonial";
import Hero from "@/components/home/home-v1/hero";
import Link from "next/link";



const HomePage = () => {
  return (
    <>
      <Header />
      <MobileMenu />

      {/* Home Banner */}
      <section className="home-banner-style1 p0 overflow-hidden sm:min-h-[80vh] min-h-[60vh] rounded-b-4xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="relative w-full min-h-[100vh] cover z-[-1]"
        >
          <source src="/video/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="home-style1 absolute top-0 left-0 w-full h-full bg-black/70 z-0">
          <div className="container">
            <div className="row">
              <div className="col-xl-11 col-md-12 mx-auto">
                <Hero />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <a href="#explore-property">
            <div className="mouse_scroll animate-up-4">
              {/* <Image
                width={20}
                height={105}
                src="/images/about/home-scroll.png"
                alt="scroll image"
              /> */}
            </div>
          </a>
        </div>
      </section>

      {/* Explore Apartment Types */}
      <section id="explore-property" className="pb90 pb30-md">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="main-title text-center" data-aos="fade-up" data-aos-delay="300">
                <h2 className="title">Explore Apartment Types</h2>
                <p className="paragraph">Get some Inspirations from 1800+ skills</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mb30">
            <div className="col-auto">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <button className="prev__active swiper_button">
                    <i className="far fa-arrow-left-long" />
                  </button>
                </div>
                <div className="col-auto">
                  <div className="pagination swiper--pagination pagination__active" />
                </div>
                <div className="col-auto">
                  <button className="next__active swiper_button">
                    <i className="far fa-arrow-right-long" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="explore-apartment-slider" data-aos="fade-up" data-aos-delay="300">
                <ApartmentType />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="pt0 pb40 pb60-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto" data-aos="fade-up" data-aos-delay="300">
              <div className="main-title text-center mb-3 mb-md-5">
                <h2 className="title">See How ZeroBroker Can Helps</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <Explore />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bgc-f7 rounded-4xl md:mx-5 py-3 py-md-4">
        <div className="container">
          <div className="row justify-content-center align-items-center" data-aos="fade-up">
            <div className="col-12">
              <div className="main-title2 text-center">
                <h2 className="title">Discover Our Featured Listings</h2>
                <p className="paragraph">See Featured Listings</p>
              </div>
            </div>
            <div className="col-12">
              <div className="text-center mb-3">
                <Link className="ud-btn btn-thm2" href={"All/properties/uae"}>
                  See All Properties
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                {/* <FeaturedListings /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties by Cities */}
      <section className="pb40-md pb90">
        <div className="container">
          <div className="row justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="100">
            <div className="col-12 col-lg-9">
              <div className="main-title2 text-center text-lg-start">
                <h2 className="title">Properties by Cities</h2>
                <p className="paragraph">Aliquam lacinia diam quis lacus euismod</p>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="text-center text-lg-end mb-3">
                <Link href="/properties/All/uae" className="ud-btn2 cursor-pointer">
                  See All Cities
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider position-relative">
                <PropertiesByCities />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="pt0 pb40-md">
        <div className="container">
          <About />
        </div>
      </section>

      {/* Popular Property */}
      <PopulerProperty />

      {/* Testimonials */}
      <section className="pb100 pb50-md bgc-thm-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="main-title text-center" data-aos="fade-up" data-aos-delay="300">
                <h2 className="title">People Love Living with ZeroBroker</h2>
                <p className="paragraph">Aliquam lacinia diam quis lacus euismod</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center mb30">
                <div className="row align-items-center justify-content-center">
                  <div className="col-auto">
                    <button className="testimonila_prev__active swiper_button">
                      <i className="far fa-arrow-left-long" />
                    </button>
                  </div>
                  <div className="col-auto">
                    <div className="pagination swiper--pagination testimonila_pagination__active" />
                  </div>
                  <div className="col-auto">
                    <button className="testimonila_next__active swiper_button">
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="testimonial-slider" data-aos="fade-up" data-aos-delay="300">
                <Testimonial />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <CallToActions />

      {/* Footer */}
      <section className="footer-style1 pt30 pt60-md pb-0">
        <Footer />
      </section>
    </>
  );
};

export default HomePage;