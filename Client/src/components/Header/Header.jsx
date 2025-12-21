import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
// import Loginbtn from "./Loginbtn";

const Header = ({ logoColor = "#a34ee5" }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      // Effet glassmorphism au scroll
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`body-font fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-dark-100/80 backdrop-blur-xl shadow-lg' 
          : 'bg-dark-200/40 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logo avec prop logoColor pour personnalisation */}
        {/* <Logo color={logoColor} /> */}
        
        {/* Navigation */}
        <Navlinks />
        
        {/* Language Switcher (si vous l'utilisez) */}
        {/* <LanguageSwitcher /> */}
        
        {/* Login Button (si vous l'utilisez) */}
        {/* <Loginbtn /> */}
      </div>
    </header>
  );
};

export default Header;