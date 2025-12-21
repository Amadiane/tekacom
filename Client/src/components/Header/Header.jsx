// import React, { useEffect, useState } from "react";
// import Logo from "./Logo";
// import Navlinks from "./Navlinks";
// // import Loginbtn from "./Loginbtn";


// const Header = () => {
//   const [scrollWidth, setScrollWidth] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//       const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//       const scrollPercentage = (scrollTop / scrollHeight) * 100;
//       setScrollWidth(scrollPercentage);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className="bg-white body-font fixed top-0 left-0 w-full z-10 shadow-md">
//       <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
//         {/* <Logo /> */}
//         <Navlinks />
//         {/* <LanguageSwitcher /> */}
//         {/* <Loginbtn /> */}
//       </div>

//       {/* Barre de progression positionnée en bas du header */}
//       <div
//   className="absolute bottom-0 left-0 h-[10px] transition-all duration-150"
//   style={{
//     width: `${scrollWidth}%`,
//     backgroundColor: "#142B57", // Bleu du footer de Tamkine
//   }}
// ></div>

//     </header>
//   );
// };

// export default Header;


import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
// import Loginbtn from "./Loginbtn";

const Header = ({ logoColor = "#a34ee5" }) => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      setScrollWidth(scrollPercentage);
      
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
          ? 'bg-dark-100/80 backdrop-blur-xl border-b border-brand-purple/20 shadow-lg' 
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

      {/* Barre de progression avec gradient violet/or */}
      <div
        className="absolute bottom-0 left-0 h-[3px] transition-all duration-150"
        style={{
          width: `${scrollWidth}%`,
          background: 'linear-gradient(90deg, #a34ee5 0%, #fec603 100%)',
          boxShadow: '0 0 10px rgba(163, 78, 229, 0.5)',
        }}
      />
      
      {/* Ligne de base subtile */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-purple/10" />
    </header>
  );
};

export default Header;