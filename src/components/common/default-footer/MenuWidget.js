import React from "react";

const MenuWidget = () => {
  const menuSections = [
    {
      title: "Popular Search",
      links: [
        { label: "Apartment for Rent", href: "/for-rent/Apartments/uae" },
        { label: "Apartment Low to HIgh", href: "for-sale/properties/uae" },
        { label: "Offices for Buy", href: "/for-sale/Office/uae" },
        { label: "Offices for Rent", href: "/for-rent/Office/uae" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Terms of Use", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Pricing Plans", href: "/pricing" },
        { label: "Our Services", href: "#" },
        { label: "Contact Support", href: "#" },
        { label: "Careers", href: "#" },
        { label: "FAQs", href: "#" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Dubai", href: "/properties/All/dubai" },
        { label: "Abu Dhabi", href: "/properties/All/abu dhabi" },
        { label: "Sharjah", href: "/properties/All/Sharjah" },
        { label: "Ajman", href: "/properties/All/Ajman" },
      ],
    },
  ];

  return (
    <>
      {menuSections.map((section, index) => (
        <div className="col-auto" key={index}>
          <div className="link-style1 mb-3">
            <h6 className="text-white mb25">{section.title}</h6>
            <ul className="ps-0">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuWidget;
