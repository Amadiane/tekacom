import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
// import Loginbtn from "./Loginbtn";


const Header = () => {
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
    <header className="bg-white body-font fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* <Logo /> */}
        <Navlinks />
        {/* <LanguageSwitcher /> */}
        {/* <Loginbtn /> */}
      </div>

      {/* Barre de progression positionnée en bas du header */}
      <div
  className="absolute bottom-0 left-0 h-[10px] transition-all duration-150"
  style={{
    width: `${scrollWidth}%`,
    backgroundColor: "#142B57", // Bleu du footer de Tamkine
  }}
></div>

    </header>
  );
};

export default Header;