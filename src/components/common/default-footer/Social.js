import React from "react";

const Social = () => {
  const socialIcons = [
    { icon: "fab fa-facebook-f", link: "www.facebook.com" },
    {icon : "fab fa-twitter", link: "www.twitter.com"},
    {icon : "fab fa-instagram" , link : "www.intagram.com"},
    {icon : "fab fa-linkedin-in", link : "www.linkedin.com"},
    ,
  ];

  return (
    <div className="social-style1">
      {socialIcons.map((iconClass, index) => (
        <a key={index} href={iconClass.link}>
          <i className={iconClass.icon + " list-inline-item"} />
        </a>
      ))}
    </div>
  );
};

export default Social;
