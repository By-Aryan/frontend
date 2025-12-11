import CallToActions from "@/components/common/CallToActions";
import Form from "@/components/pages/contact/Form";
import Office from "@/components/pages/contact/Office";

export const metadata = {
  title: "Contact  || ZeroBroker - Real Estate NextJS Template",
};

const Contact = () => {
  return (
    <>
      {/* Our Contact With Map */}
      {/* <section className="p-0">
        <iframe
          className="home8-map contact-page"
          loading="lazy"
          src="https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&t=m&z=14&output=embed&iwloc=near"
          title="London Eye, London, United Kingdom"
          aria-label="London Eye, London, United Kingdom"
        />
      </section> */}
      <section className="p-0"
        style={{
          backgroundImage: "url('/images/background/contactBackground.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "80vh", // Adjust this as needed
          width: "100%",
          position: "relative"
        }}
      ></section>
      {/* End Our Contact With Map */}

      {/* Start Our Contact Form */}
      <section>
        <div className="container">
          <div className="row d-flex align-items-end">
            <div className="col-lg-5 position-relative" style={{ marginTop: "-600px", marginLeft: "-40px" }}>
              <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                <h4 className="form-title mb25">
                  No Cost, No Hassle – We’ll List Your Property for You!
                </h4>
                <Form />
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-5 offset-lg-2">
              <h2 className="mb30 text-capitalize">
                We’d love to hear <br className="d-none d-lg-block" />
                from you.
              </h2>
              <p className="text">
                We are here to answer any question you may have. As a partner of
                corporates, realton has more than 9,000 offices of all sizes and
                all potential of session.
              </p>
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
      {/* End Our Contact Form */}

      {/* Visit our Office */}
      <section className="pt0 pb90 pb10-md">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 m-auto"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="main-title text-center">
                <h2 className="title">Visit Our Office</h2>
                <p className="paragraph">
                  Realton has more than 9,000 offices of all sizes and all
                  potential of session.
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <Office />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End Visit our Office */}

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}
    </>
  );
};

export default Contact;

