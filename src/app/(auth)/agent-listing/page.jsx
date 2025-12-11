"use client";
import Image from "next/image";
import Link from "next/link";
import AgentListingForm from "./agent-listingForm";

const AgentListing = () => {
  return (
    <>
      {/* Submit Details Section */}
      <section className="our-compare pt0 pb0">
        <div className="container">
          <div
            className="row align-items-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            {/* LEFT COLUMN: Form */}
            <div className="col-lg-6">
              <div className="log-reg-form signup-modal form-style1 bgc-white p40 p30-sm default-box-shadow2 bdrs12">
                <div className="text-center mb30">
                  <Link href="/">
                    <Image
                      width={138}
                      height={44}
                      className="mb15"
                      src="/images/logoBlack.png"
                      alt="Company logo"
                    />
                  </Link>
                  <h2>Submit Your Details</h2>
                  <p className="text">
                    Please provide your information below. One of our agents
                    will use it to create your property listing.
                  </p>
                </div>
                <AgentListingForm />
              </div>
            </div>

            {/* RIGHT COLUMN: Image */}
            <div
              className="col-lg-6 d-none d-lg-block text-center"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <Image
                width={500}
                height={500}
                src="/images/icon/login-page-icon.svg"
                alt="Illustration of property listing"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AgentListing;
