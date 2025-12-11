import mobileMenuItems from "@/data/mobileMenuItems";
import { isParentActive } from "@/utilis/isMenuActive";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { sassTrue } from "sass";
import { pageRoutes } from "@/utilis/common";

const ProSidebarContent = () => {
  const path = usePathname();

  const menu = [
    {
      name: "Home",
      url: "/",
      submenu: false,
    },
    {
      name: "Buy",
      url: pageRoutes.buy.properties,
      submenu: false,
    },
    {
      name: "Rent",
      url: pageRoutes.rent.propertyForRent,
      submenu: false,
    },
    // {
    //   name: "Commercial",
    //   url: "/",
    //   submenu: false,
    // },
    {
      name: "New projects",
      url: pageRoutes.propertys,
      submenu: false,
    },
    // {
    //   name: "Find agent",
    //   url: "/",
    //   submenu: false,
    // },
    // {
    //   name: "News",
    //   url: "/",
    //   submenu: false,
    // },
  ];

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {menu.map((item, index) =>
          item.submenu ? (
            <SubMenu
              key={index}
              className={false ? "active" : ""}
              label={item.name}
            >
              {item?.subMenus?.map((subItem, subIndex) => (
                <MenuItem
                  key={subIndex}
                  component={
                    <Link
                      className={subItem.url == path ? "active" : ""}
                      href={subItem.url}
                    />
                  }
                >
                  {subItem.name}
                </MenuItem>
              ))}
            </SubMenu>
          ) : (
            <MenuItem
              key={index}
              component={
                <Link
                  className={item.url == path ? "active" : ""}
                  href={item.url}
                />
              }
            >
              {item.name}
            </MenuItem>
          ),
        )}
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
