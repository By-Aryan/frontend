import {
  homeItems,
  blogItems,
  listingItems,
  propertyItems,
  pageItems,
} from "@/data/navItems";
import { pageRoutes } from "@/utilis/common";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useCityData } from "@/hooks/useCityData";

const MainMenu = ({ navbar, isMobile = false, onItemClick }) => {
  const pathname = usePathname();
  const [topMenu, setTopMenu] = useState("");
  const [submenu, setSubmenu] = useState("");
  const [activeLink, setActiveLink] = useState("");
  
  // Use the optimized city data hook
  const { cityCounts, isLoading } = useCityData();

  useEffect(() => {
    homeItems.forEach((elm) => {
      if (elm.href.split("/")[1] == pathname.split("/")[1]) {
        setTopMenu("home");
      }
    });
    blogItems.forEach((elm) => {
      if (elm.href.split("/")[1] == pathname.split("/")[1]) {
        setTopMenu("blog");
      }
    });
    pageItems.forEach((elm) => {
      if (elm.href.split("/")[1] == pathname.split("/")[1]) {
        setTopMenu("pages");
      }
    });
    propertyItems.forEach((item) =>
      item.subMenuItems.forEach((elm) => {
        if (elm.href.split("/")[1] == pathname.split("/")[1]) {
          setTopMenu("property");
          setSubmenu(item.label);
        }
      })
    );
    listingItems.forEach((item) =>
      item.submenu.forEach((elm) => {
        if (elm.href.split("/")[1] == pathname.split("/")[1]) {
          setTopMenu("listing");
          setSubmenu(item.title);
        }
      })
    );
  }, [pathname]);

  const handleActive = (link) => {
    if (link.split("/")[1] == pathname.split("/")[1]) {
      return "menuActive";
    }
  };

  // Memoized city submenus generation
  const citySubmenus = useMemo(() => {
    const generateCitySubmenus = (purpose) => {
      return cityCounts.map(city => {
        const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
        const url = purpose === 'buy' 
          ? `/for-sale/properties/${citySlug}` 
          : `/for-rent/properties/${citySlug}`;
        
        return {
          name: `${city.name} (${city.count})`,
          url: url
        };
      });
    };

    return {
      buy: generateCitySubmenus('buy'),
      rent: generateCitySubmenus('rent')
    };
  }, [cityCounts]);

  const menu = [
    {
      name: "Buy",
      url: pageRoutes.buy.properties,
      submenu: true,
      subMenus: citySubmenus.buy
    },
    {
      name: "Rent",
      url: pageRoutes.rent.propertyForRent,
      submenu: true,
      subMenus: citySubmenus.rent
    },
    {
      name: "New projects",
      url: pageRoutes.newProjects,
      submenu: false,
    },
  ];

  // Determine the text color based on the current route and navbar prop
  const isHome = pathname === "/";
  const textColorClass = isHome ? "!text-white" : "!text-black";

  return (
    <ul className={`ace-responsive-menu ${textColorClass} ${isMobile ? 'mobile-menu' : ''}`}>
      {menu?.map((res, index) => {
        return res?.submenu ? (
          <li className="visible_list dropitem" key={index}>
            <a 
              className="list-item !text-black" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={isMobile ? { minHeight: '44px', display: 'flex', alignItems: 'center' } : {}}
            >
              <span
                className={topMenu == res.name.toLowerCase() ? "title menuActive" : "title"}
              >
                {res.name}
                {isLoading && (
                  <span className="ms-1 text-xs opacity-60">↻</span>
                )}
              </span>
              <span className="arrow !text-black"></span>
            </a>
            <ul className={`sub-menu !text-black ${isMobile ? 'mobile-submenu' : ''}`}>
              {res?.subMenus?.map((item, index2) => {
                return (
                  <li key={"submenu-" + index + "-" + index2}>
                    <Link 
                      className={`${handleActive(item.url)}`} 
                      href={item.url}
                      onClick={onItemClick}
                      style={isMobile ? { minHeight: '44px', display: 'flex', alignItems: 'center', padding: '12px 16px' } : {}}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ) : (
          <li
            className="visible_list !text-black"
            key={index}
          >
            <Link
              className="list-item !text-black"
              href={res.url}
              onClick={onItemClick}
              style={isMobile ? {
                color: "#000000",
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px'
              } : {
                color: "#000000"
              }}
            >
              {res.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default MainMenu;
