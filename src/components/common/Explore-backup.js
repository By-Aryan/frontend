import Link from "next/link";

const Explore = () => {
  // Array of iconbox data
  const iconboxData = [
    {
      id: 1,
      icon: "/images/zero-broker/icon/property-buy.svg",
      title: "Buy a property",
      text: "Discover luxury apartments, waterfront villas, and investment-ready properties across Dubai's prime locations.",
      linkText: "Find a home",
      url: "/for-sale/Houses/uae",
    },
    {
      id: 2,
      icon: "/images/zero-broker/icon/property-sell.svg",
      title: "Sell a property",
      text: "List your Dubai property with us for maximum visibility and connect with serious buyers instantly.",
      linkText: "Place an ad",
      url: "/dashboard/seller/request-to-add-new-property",
    },
    {
      id: 3,
      icon: "/images/zero-broker/icon/property-rent.svg",
      title: "Rent a property",
      text: "Explore a wide range of rental options from downtown apartments to beachfront residences, all over Dubai.",
      linkText: "Find a rental",
      url: "/for-rent/properties/uae",
    },
  ];

  return (
    <>
      {iconboxData.map((item) => (
        <div
          className="col-sm-6 col-lg-4"
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={(item.id + 1) * 100} // Increase delay for each item
        >
          <div className="iconbox-style2 text-center">
            <div className="icon md:w-[150px] w-[100px] md:h-[150px] h-[100px]">
              {/* Alternative method using regular img tag instead of Next.js Image */}
              <img 
                width={150} 
                height={150} 
                src={item.icon} 
                alt="icon" 
                className="w-full h-full"
                onError={(e) => {
                  console.error('SVG loading failed:', e.target.src);
                  // Fallback to a default icon or hide the icon
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="iconbox-content">
              <h4 className=" md:text-base text-sm">{item.title}</h4>
              <p className="text md:text-base text-sm">{item.text}</p>
              <Link href={item.url} className="ud-btn btn-thm3">
                {item.linkText}
                <i className="fas fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Explore;