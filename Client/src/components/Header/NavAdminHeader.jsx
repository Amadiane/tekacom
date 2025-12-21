// import React, { useEffect, useState } from "react";
// import Logo from "./Logo";
// import Navlinks from "./Navlinks";
// import Loginbtn from "./Loginbtn";


// const NavAdminHeader = () => {
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
//     <header className="bg-white body-font fixed top-0 left-0 w-[250px] h-full z-10 shadow-md">
//       {/* Sidebar with content aligned to the left */}
//       <div className="flex flex-col p-5 items-start h-full justify-between">
//         {/* Upper part of the sidebar */}
//         <div className="mb-8"> {/* Adjust the margin here to control distance */}
//           <Logo />
//         </div>

//         <div className="mb-9"> {/* Adjust the margin here to control distance between links */}
//           <Navlinks /> {/* Add the specific Navlinks for Admin here */}
//         </div>
        
//         {/* Spacer to push items to the bottom */}
//         <div className="mt-auto">
//           {/* <LanguageSwitcher /> */}
//           <Loginbtn />
//         </div>
//       </div>

//       {/* Progress bar positioned at the bottom of the header */}
//       <div
//         className="absolute bottom-0 left-0 h-[10px] transition-all duration-150"
//         style={{
//           width: `${scrollWidth}%`,
//           backgroundColor: "#142B57", // Blue color from footer of 
//         }}
//       ></div>
//     </header>
//   );
// };

// export default NavAdminHeader;



import React, { useEffect, useState } from "react";
import Logo from "./admin/Logo";
import Navlinks from "./admin/Navlinks";
import Loginbtn from "./admin/Loginbtn";

/**
 * 🎨 NavAdminHeader - Sidebar Admin avec thème dark
 * 
 * Features:
 * - Fond dark avec gradient
 * - Barre de progression violet/or
 * - Effets de profondeur (blobs)
 * - Border violet subtile
 */

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
    <header className="bg-gradient-to-b from-dark-100 to-dark-200 body-font fixed top-0 left-0 w-[250px] h-full z-50 shadow-glow border-r border-brand-purple/20">
      {/* Sidebar with content aligned to the left */}
      <div className="flex flex-col p-5 items-start h-full justify-between relative">
        
        {/* Decorative gradient blobs for depth */}
        <div className="absolute top-20 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-40 left-0 w-24 h-24 bg-brand-purple-dark/10 rounded-full blur-2xl opacity-40"></div>

        {/* Upper part of the sidebar */}
        <div className="mb-8 relative z-10">
          <Logo color="#a34ee5" />
        </div>

        {/* Navigation links */}
        <div className="mb-9 flex-1 relative z-10 w-full overflow-y-auto">
          <Navlinks /> {/* Admin navigation links */}
        </div>
        
        {/* Bottom section - Login button */}
        <div className="mt-auto relative z-10 w-full">
          {/* <LanguageSwitcher /> */}
          <Loginbtn />
        </div>
      </div>

      {/* Progress bar with gradient violet/or */}
      <div
        className="absolute bottom-0 left-0 h-[3px] transition-all duration-150"
        style={{
          width: `${scrollWidth}%`,
          background: 'linear-gradient(90deg, #a34ee5 0%, #fec603 100%)',
          boxShadow: '0 0 10px rgba(163, 78, 229, 0.5)',
        }}
      />

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-purple/10"></div>
    </header>
  );
};

export default NavAdminHeader;