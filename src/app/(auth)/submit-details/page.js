"use client"
import SubmitDetails from "@/components/common/submit-details/SubmitDetails";
import Image from "next/image";
import Link from "next/link";


const SubmitDetail = () => {

  return (
    <>
      {/* Our Compare Area */}
      <section className="our-compare pt0 pb0 ">
        <Image
          width={1012}
          height={500}
          src="/images/icon/login-page-icon.svg"
          alt="logo"
          className="login-bg-icon contain h-[100vh]"
          data-aos="fade-right"
          data-aos-delay="300"
        />
        <div className="container">
          <div className="row" data-aos="fade-left" data-aos-delay="300">
            <div className="col-lg-6">
              <div className="log-reg-form signup-modal form-style1 bgc-white p40 p30-sm default-box-shadow2 bdrs12 " >
                <div className="text-center mb30">
                  <Link href="/">
                    <Image
                      width={138}
                      height={44}
                      className="mb15"
                      src="/images/logoBlack.png"
                      alt="logo"
                    />
                  </Link>
                  <h2>Submit Details</h2>
                  <p className="text">
                    Provide your details and our agent will create your account.
                  </p>
                </div>
                <SubmitDetails />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default SubmitDetail;
