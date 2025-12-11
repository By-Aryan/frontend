import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found | ZeroBroker - Real Estate Properties in Dubai",
  description: "Sorry, the page you are looking for doesn't exist or has been moved. Browse our property listings in Dubai.",
};

export default function NotFound() {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Error/404 Section */}
      <section className="our-error">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6" data-aos="fade-left">
              <div className="animate_content text-center text-xl-start">
                <div className="animate_thumb">
                  <Image
                    width={591}
                    height={452}
                    className="w-100 h-100 cover"
                    src="/images/icon/error-page-img.svg"
                    alt="404 error illustration"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5 offset-xl-1 wow fadeInLeft" data-aos="fade-right">
              <div className="error_page_content mt80 mt50-lg text-center text-xl-start">
                <div className="erro_code">
                  <span className="text-thm">40</span>4
                </div>
                <div className="h2 error_title">Oops! It looks like you're lost.</div>
                <p className="text fz15 mb20">
                  The page you're looking for isn't available. Try to search again{" "}
                  <br className="d-none d-lg-block" /> or use the go to.
                </p>
                <Link href="/" className="ud-btn btn-dark">
                  Go Back To Homepages
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Error/404 Section */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
}