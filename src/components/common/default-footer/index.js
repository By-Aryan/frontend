import Image from "next/image";
import Link from "next/link";
import AppWidget from "./AppWidget";
import ContactMeta from "./ContactMeta";
import Copyright from "./Copyright";
import MenuWidget from "./MenuWidget";
import Social from "./Social";
import Subscribe from "./Subscribe";

const Footer = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="footer-widget mb-4 mb-lg-5">
              <Link className="footer-logo" href="/">
                {/* <Image
                  width={138}
                  height={44}
                  className="mb40"
                  src="/images/logoBlack.png"
                  alt=""
                /> */}
                <Image
                  width={138}
                  height={44}
                  src="/images/logoWhite.png"
                  alt="Header Logo"
                  className="mb-8 w-auto object-contain"
                  style={{ marginBottom: "30px" }}
                />
              </Link>
              <ContactMeta />
              <AppWidget />
              <div className="social-widget">
                <h6 className="text-white mb20">Follow us on social media</h6>
                <Social />
              </div>
            </div>
          </div>
          {/* End .col-lg-5 */}

          <div className="col-lg-7">
            <div className="footer-widget mb-4 mb-lg-5">
              <Subscribe />
              <div className="row justify-content-between">
                <MenuWidget />
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}

      <Copyright />
      {/* End copyright */}
    </>
  );
};

export default Footer;
