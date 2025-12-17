import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
import Loginbtn from "./Loginbtn";


const NavAdminHeader = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      setScrollWidth(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-white body-font fixed top-0 left-0 w-[250px] h-full z-10 shadow-md">
      {/* Sidebar with content aligned to the left */}
      <div className="flex flex-col p-5 items-start h-full justify-between">
        {/* Upper part of the sidebar */}
        <div className="mb-8"> {/* Adjust the margin here to control distance */}
          <Logo />
        </div>

        <div className="mb-9"> {/* Adjust the margin here to control distance between links */}
          <Navlinks /> {/* Add the specific Navlinks for Admin here */}
        </div>
        
        {/* Spacer to push items to the bottom */}
        <div className="mt-auto">
          {/* <LanguageSwitcher /> */}
          <Loginbtn />
        </div>
      </div>

      {/* Progress bar positioned at the bottom of the header */}
      <div
        className="absolute bottom-0 left-0 h-[10px] transition-all duration-150"
        style={{
          width: `${scrollWidth}%`,
          backgroundColor: "#142B57", // Blue color from footer of Tamkine
        }}
      ></div>
    </header>
  );
};

export default NavAdminHeader;
