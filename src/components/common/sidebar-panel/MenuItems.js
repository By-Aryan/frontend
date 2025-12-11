import Link from "next/link";

const MenuItems = () => {
  const mainMenuItems = [
    { id: 1, title: "Buy", href: "/for-sale/properties/uae?purpose=buy" },
    { id: 2, title: "Rent", href: "/for-rent/properties/uae?purpose=rent" },
    { id: 3, title: "New Projects", href: "/projects-by-country/uae" },
  ];

  const propertyTypes = [
    { id: 4, title: "Apartments" },
    { id: 5, title: "Bungalow" },
    { id: 6, title: "Houses" },
    { id: 7, title: "Loft" },
    { id: 8, title: "Office" },
    { id: 9, title: "Townhome" },
    { id: 10, title: "Villa" },
  ];

  return (
    <ul className="navbar-nav">
      {/* Main Navigation Items */}
      {mainMenuItems.map((item) => (
        <li className="nav-item" key={item.id}>
          <Link 
            className="nav-link" 
            href={item.href}
            style={{
              fontSize: "16px",
              fontWeight: "600",
              padding: "12px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              color: item.title === "New Projects" ? "#0f8363" : "inherit",
              background: item.title === "New Projects" ? "rgba(15, 131, 99, 0.1)" : "transparent"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = item.title === "New Projects" ? "rgba(15, 131, 99, 0.2)" : "rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = item.title === "New Projects" ? "rgba(15, 131, 99, 0.1)" : "transparent";
            }}
          >
            {item.title}
          </Link>
        </li>
      ))}
      
      {/* Divider */}
      <li className="nav-item">
        <hr className="my-3" style={{ borderColor: "#e9ecef" }} />
      </li>
      
      {/* Property Types */}
      <li className="nav-item">
        <span className="nav-link" style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d", textTransform: "uppercase" }}>
          Property Types
        </span>
      </li>
      {propertyTypes.map((item) => (
        <li className="nav-item" key={item.id}>
          <a className="nav-link" href="#" role="button" style={{ fontSize: "14px", paddingLeft: "24px" }}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
