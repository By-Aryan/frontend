import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style1 text-center w-full">
        {/* <h6 className="hero-sub-title animate-up-1" style={{color:"#181a20"}}>THE BEST WAY TO</h6> */}
        <h2
          className="hero-title animate-up-2"
          style={{
            color: "#ffffff",
            textShadow: "4px 4px 10px rgba(0, 0, 0, 1)"
          }}
        >
          Zero Brokerage, Maximum Savings!
        </h2>
        {/* <p className="hero-text fz15 animate-up-3" style={{color:"#181a20"}}>
          We've more than 745,000 apartments, place &amp; plot.
        </p> */}
        <HeroContent />
      </div>
      {/* End Hero content */}

      {/* <!-- Advance Feature Modal Start --> */}
      {/* <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div> */}
      {/* <!-- Advance Feature Modal End --> */}
    </>
  );
};

export default Hero;
