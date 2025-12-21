// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { Search, Menu, X, Globe, ChevronDown, Users, Image, Video, Handshake, Newspaper, Phone, Calendar, Info } from "lucide-react";
// import logo from "../../assets/logo.jpg";
// import { useTranslation } from "react-i18next";

// const Navlinks = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [searchResults, setSearchResults] = useState([]);
//   const { i18n, t } = useTranslation();
//   const [language, setLanguage] = useState(i18n.language || "fr");
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);
//   const dropdownTimeoutRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
//     };
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         setSearchOpen(false);
//         setMobileMenuOpen(false);
//         setMobileActiveDropdown(null);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleKeyDown);
//     document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "unset";
//       if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     };
//   }, [searchOpen, mobileMenuOpen]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     setLanguage(lang);
//   };

//   const allPages = [
//     { title: t("nav.news"), path: "/actualites", keywords: ["news", "actualités"], icon: Newspaper },
//     { title: t("nav.president_word"), path: "/motPresident", keywords: ["président"], icon: Users },
//     { title: t("nav.missions"), path: "/nosMissions", keywords: ["missions"], icon: Info },
//     { title: t("nav.team"), path: "/notreEquipe", keywords: ["équipe"], icon: Users },
//     { title: t("nav.calendrier"), path: "/programs", keywords: ["calendrier"], icon: Calendar },
//     { title: t("nav.photos"), path: "/phototheque", keywords: ["photos"], icon: Image },
//     { title: t("nav.videos"), path: "/videotheque", keywords: ["vidéos"], icon: Video },
//     { title: t("nav.partenaires"), path: "/partner", keywords: ["partenaires"], icon: Handshake },
//     { title: t("nav.acceuil"), path: "/Acceuil", keywords: ["acceuil"], icon: Newspaper },
//     { title: t("nav.contact"), path: "/contacter-tamkine", keywords: ["contact"], icon: Phone },
//     { title: t("nav.community"), path: "/community", keywords: ["communauté"], icon: Users },
//     { title: t("nav.homePost"), path: "/homePost", keywords: ["Home"], icon: Users },
//   ];

//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     if (value.trim().length > 1) {
//       const results = allPages.filter(page =>
//         page.title.toLowerCase().includes(value.toLowerCase()) ||
//         page.keywords.some(keyword => keyword.toLowerCase().includes(value.toLowerCase()))
//       ).slice(0, 5);
//       setSearchResults(results);
//     } else setSearchResults([]);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
//     const exactMatch = allPages.find(page =>
//       page.title.toLowerCase() === searchTerm.toLowerCase() ||
//       page.keywords.some(k => k.toLowerCase() === searchTerm.toLowerCase())
//     );
//     if (exactMatch) navigate(exactMatch.path);
//     else navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     setSearchTerm("");
//     setSearchOpen(false);
//     setSearchResults([]);
//     setMobileMenuOpen(false);
//   };

//   const handleResultClick = (path) => {
//     navigate(path);
//     setSearchTerm("");
//     setSearchOpen(false);
//     setSearchResults([]);
//     setMobileMenuOpen(false);
//   };

//   const handleMouseEnter = (index) => {
//     if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     setActiveDropdown(index);
//   };
//   const handleMouseLeave = () => {
//     dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
//   };

//   const toggleMobileDropdown = (index) => {
//     setMobileActiveDropdown(mobileActiveDropdown === index ? null : index);
//   };

//   const handleMobileNavClick = (path) => {
//     navigate(path);
//     setMobileMenuOpen(false);
//     setMobileActiveDropdown(null);
//   };

//   const navItems = [
//     { title: t("nav.home"), path: "/profesionnalarea", icon: Newspaper },
//     {
//       title: t("nav.Viali"),
//       isDropdown: true,
//       icon: Users,
//       items: [
//         // { title: t("nav.president_word"), path: "/motPresident" },
//         { title: t("nav.missions"), path: "/nosMissions" },
//         // { title: t("nav.values"), path: "/nosValeurs" },
//         { title: t("nav.team"), path: "/notreEquipe" },
//         { title: t("nav.partenaires"), path: "/partner", icon: Handshake },
//       ]
//     },
//     // {
//     //   title: t("nav.product"),
//     //   isDropdown: true,
//     //   icon: Users,
//     //   items: [
//     //     // { title: t("nav.president_word"), path: "/motPresident" },
//     //     // { title: t("nav.sardine"), path: "/sardineProduct" },
//     //     // { title: t("nav.tuna"), path: "/thonProduct" },
//     //   ]
//     // },
//     // // {
//     // //   title: t("nav.recipes"),
//     // //   isDropdown: true,
//     // //   icon: Users,
//     // //   items: [
//     //     // { title: t("nav.president_word"), path: "/motPresident" },
//     //     { title: t("nav.sardine"), path: "/sardineRecipes" },
//     //     { title: t("nav.tuna"), path: "/thonRecipes" },
//     //   ]
//     // },
//     // { title: t("nav.calendrier"), path: "/programs", icon: Calendar },
//     // { title: t("nav.news"), path: "/actualites", icon: Newspaper },
//     // {
//     //   title: t("nav.medias"),
//     //   isDropdown: true,
//     //   icon: Video,
//     //   items: [
//     //     { title: t("nav.photos"), path: "/professionalArea" },
//     //     { title: t("nav.videos"), path: "/professionalArea" },
//     //   ]
//     // },
//     // { title: t("nav.profesionnalarea"), path: "/professionalArea", icon: Handshake },
//     // {
//     //   title: t("nav.join_us"),
//     //   isDropdown: true,
//     //   icon: Users,
//     //   items: [
//     //     { title: t("nav.contact"), path: "/contacternous" },
//     //     { title: t("nav.community"), path: "/community" },
//     //   ]
//     // },
//   ];

//   return (
//     <>
//       <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-2xl shadow-orange-400/20" : "bg-white"}`}>
//         {/* 🎨 Barre du logo - FOND BLANC */}
//         <div className="border-b-2 border-[#F47920]/30">
//           <div className="w-full flex items-center justify-center">
//             <div className="flex items-center justify-between w-[95%] lg:w-[90%] xl:w-[85%] py-3">
//               <NavLink to="/home" className="flex items-center space-x-3 group">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-40 blur-lg rounded-full group-hover:opacity-60 animate-pulse transition-all"></div>
//                   <img src={logo} alt="VIALI" className="relative h-14 w-14 rounded-full border-2 border-[#F47920] shadow-2xl shadow-orange-400/60 object-cover group-hover:scale-105 transition-transform" />
//                 </div>
//                 <div className="hidden sm:block">
//                   <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] font-black text-2xl tracking-tight">VIALI</h1>
//                   <p className="text-gray-700 text-xs font-bold">{t("nav.slogan")}</p>
//                 </div>
//               </NavLink>

//               <div className="hidden lg:flex items-center space-x-4">
//                 <button onClick={() => navigate("/motPresident")} className="relative group overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] opacity-30 blur-xl group-hover:opacity-50 transition-opacity animate-pulse"></div>
//                   <div className="relative px-6 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-lg text-white text-sm font-bold tracking-wide transition-all flex items-center gap-2 shadow-2xl shadow-orange-400/60 hover:scale-105">
//                     <Info size={16} />
//                     {t("nav.viali_presentation")}
//                   </div>
//                 </button>

//                 <button onClick={() => setSearchOpen(true)} className="p-2.5 rounded-lg bg-white border-2 border-[#F47920]/30 hover:border-[#F47920] transition-all group shadow-lg shadow-orange-400/20">
//                   <Search size={20} className="text-[#F47920] group-hover:scale-110 transition-transform" />
//                 </button>

//                 <div className="flex items-center space-x-1 bg-white border-2 border-[#F47920]/30 rounded-lg p-1 shadow-lg shadow-orange-400/20">
//                   <Globe size={16} className="text-[#F47920] ml-2" />
//                   {["fr", "en"].map((lang) => (
//                     <button key={lang} onClick={() => changeLanguage(lang)}
//                       className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
//                         language === lang ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/50"
//                         : "text-gray-700 hover:text-[#F47920] hover:bg-orange-50"}`}>
//                       {lang.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-lg bg-white border-2 border-[#F47920]/30 hover:border-[#F47920] transition-all shadow-lg shadow-orange-400/20">
//                 {mobileMenuOpen ? <X size={24} className="text-[#F47920]" /> : <Menu size={24} className="text-[#F47920]" />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* 🎨 Barre de navigation - FOND COULEUR VIALI */}
//         <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] border-b-2 border-white/20 hidden lg:block shadow-lg" ref={dropdownRef}>
//           <div className="w-full flex items-center justify-center">
//             <div className="w-[95%] lg:w-[90%] xl:w-[85%]">
//               <nav className="flex items-center justify-center space-x-1 py-3">
//                 {navItems.map((item, index) =>
//                   item.isDropdown ? (
//                     <div key={index} className="relative" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
//                       <button className="relative px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all group text-white hover:bg-white/20 rounded-lg flex items-center gap-1 backdrop-blur-sm">
//                         <span>{item.title}</span>
//                         <ChevronDown size={14} className={`transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} />
//                       </button>
//                       {activeDropdown === index && (
//                         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border-2 border-[#F47920]/30 rounded-xl shadow-2xl shadow-orange-400/50 min-w-[220px] z-50 backdrop-blur-md">
//                           {item.items.map((sub, i) => (
//                             <NavLink key={i} to={sub.path} onClick={() => setActiveDropdown(null)}
//                               className="block px-5 py-3 text-sm font-bold text-gray-700 hover:text-[#F47920] hover:bg-orange-50 transition-all border-b border-[#F47920]/10 last:border-b-0 first:rounded-t-xl last:rounded-b-xl">
//                               {sub.title}
//                             </NavLink>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <NavLink key={index} to={item.path}
//                       className={({ isActive }) =>
//                         `relative px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all group rounded-lg backdrop-blur-sm ${
//                           isActive ? "text-white bg-white/30 shadow-lg" : "text-white hover:bg-white/20"}`}>
//                       <span>{item.title}</span>
//                     </NavLink>
//                   )
//                 )}
//               </nav>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MENU MOBILE avec couleurs Viali */}
//       <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
//         <div className={`absolute inset-0 bg-gradient-to-br from-[#E84E1B]/80 via-[#F47920]/80 to-[#FDB71A]/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)}></div>

//         <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-br from-orange-50 via-yellow-50 to-white border-l-4 border-[#F47920] shadow-2xl transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
//           <div className="sticky top-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] border-b-2 border-white/20 p-4 flex items-center justify-between shadow-lg">
//             <h2 className="text-xl font-black text-white drop-shadow-lg">MENU</h2>
//             <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md">
//               <X size={24} className="text-white" />
//             </button>
//           </div>

//           <nav className="p-4 space-y-2">
//             {navItems.map((item, index) => {
//               const Icon = item.icon;
//               if (item.isDropdown) {
//                 return (
//                   <div key={index} className="space-y-1">
//                     <button
//                       onClick={() => toggleMobileDropdown(index)}
//                       className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/70 backdrop-blur-md hover:bg-white border-2 border-[#F47920]/30 hover:border-[#F47920] transition-all text-gray-700 hover:text-[#F47920] shadow-lg shadow-orange-400/20">
//                       <div className="flex items-center gap-3">
//                         <Icon size={20} className="text-[#F47920]" />
//                         <span className="font-bold text-sm">{item.title}</span>
//                       </div>
//                       <ChevronDown size={18} className={`text-[#F47920] transition-transform ${mobileActiveDropdown === index ? "rotate-180" : ""}`} />
//                     </button>
//                     <div className={`overflow-hidden transition-all duration-300 ${mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
//                       <div className="ml-4 space-y-1 mt-1">
//                         {item.items.map((sub, i) => (
//                           <button
//                             key={i}
//                             onClick={() => handleMobileNavClick(sub.path)}
//                             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-700 hover:text-[#F47920] hover:bg-orange-50 transition-all font-semibold border border-transparent hover:border-[#F47920]/30">
//                             <span className="text-sm">{sub.title}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               }
//               return (
//                 <button key={index} onClick={() => handleMobileNavClick(item.path)}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/70 backdrop-blur-md hover:bg-white border-2 border-[#F47920]/30 hover:border-[#F47920] transition-all text-gray-700 hover:text-[#F47920] shadow-lg shadow-orange-400/20">
//                   <Icon size={20} className="text-[#F47920]" />
//                   <span className="font-bold text-sm">{item.title}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navlinks;



import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown, Users, Image, Video, Handshake, Newspaper, Phone, Calendar, Info } from "lucide-react";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

const Navlinks = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "fr");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setMobileActiveDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, [searchOpen, mobileMenuOpen]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const allPages = [
    { title: t("nav.news"), path: "/actualites", keywords: ["news", "actualités"], icon: Newspaper },
    { title: t("nav.president_word"), path: "/motPresident", keywords: ["président"], icon: Users },
    { title: t("nav.missions"), path: "/nosMissions", keywords: ["missions"], icon: Info },
    { title: t("nav.team"), path: "/notreEquipe", keywords: ["équipe"], icon: Users },
    { title: t("nav.calendrier"), path: "/programs", keywords: ["calendrier"], icon: Calendar },
    { title: t("nav.photos"), path: "/phototheque", keywords: ["photos"], icon: Image },
    { title: t("nav.videos"), path: "/videotheque", keywords: ["vidéos"], icon: Video },
    { title: t("nav.partenaires"), path: "/partner", keywords: ["partenaires"], icon: Handshake },
    { title: t("nav.acceuil"), path: "/Acceuil", keywords: ["acceuil"], icon: Newspaper },
    { title: t("nav.contact"), path: "/contacter-tamkine", keywords: ["contact"], icon: Phone },
    { title: t("nav.community"), path: "/community", keywords: ["communauté"], icon: Users },
    { title: t("nav.homePost"), path: "/homePost", keywords: ["Home"], icon: Users },
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 1) {
      const results = allPages.filter(page =>
        page.title.toLowerCase().includes(value.toLowerCase()) ||
        page.keywords.some(keyword => keyword.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(results);
    } else setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const exactMatch = allPages.find(page =>
      page.title.toLowerCase() === searchTerm.toLowerCase() ||
      page.keywords.some(k => k.toLowerCase() === searchTerm.toLowerCase())
    );
    if (exactMatch) navigate(exactMatch.path);
    else navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setSearchOpen(false);
    setSearchResults([]);
    setMobileMenuOpen(false);
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm("");
    setSearchOpen(false);
    setSearchResults([]);
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(index);
  };
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
  };

  const toggleMobileDropdown = (index) => {
    setMobileActiveDropdown(mobileActiveDropdown === index ? null : index);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setMobileActiveDropdown(null);
  };

  const navItems = [
    { title: t("nav.home"), path: "/profesionnalarea", icon: Newspaper },
    {
      title: t("nav.Viali"),
      isDropdown: true,
      icon: Users,
      items: [
        { title: t("nav.missions"), path: "/nosMissions" },
        { title: t("nav.team"), path: "/notreEquipe" },
        { title: t("nav.partenaires"), path: "/partner", icon: Handshake },
      ]
    },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-dark-100/95 backdrop-blur-xl shadow-glow border-b border-brand-purple/30" 
          : "bg-dark-200/60 backdrop-blur-md"
      }`}>
        {/* 🎨 Barre du logo - FOND DARK avec gradient subtle */}
        <div className="border-b border-brand-purple/20">
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-between w-[95%] lg:w-[90%] xl:w-[85%] py-3">
              <NavLink to="/home" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary opacity-40 blur-lg rounded-full group-hover:opacity-60 transition-all"></div>
                  <img 
                    src={logo} 
                    alt="VIALI" 
                    className="relative h-14 w-14 rounded-full border-2 border-brand-purple shadow-glow object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                {/* <div className="hidden sm:block">
                  <h1 className="text-transparent bg-clip-text bg-gradient-primary font-black text-2xl tracking-tight">
                    VIALI
                  </h1>
                  <p className="text-gray-400 text-xs font-bold">{t("nav.slogan")}</p>
                </div> */}
              </NavLink>

              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/motPresident")} 
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-xl group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative px-6 py-2.5 bg-gradient-primary rounded-lg text-white text-sm font-bold tracking-wide transition-all flex items-center gap-2 shadow-glow hover:scale-105">
                    <Info size={16} />
                    {t("nav.viali_presentation")}
                  </div>
                </button>

                <button 
                  onClick={() => setSearchOpen(true)} 
                  className="p-2.5 rounded-lg bg-dark-100/60 border border-brand-purple/30 hover:border-brand-purple/60 transition-all group shadow-card"
                >
                  <Search size={20} className="text-brand-purple group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex items-center space-x-1 bg-dark-100/60 border border-brand-purple/30 rounded-lg p-1 shadow-card backdrop-blur-sm">
                  <Globe size={16} className="text-brand-purple ml-2" />
                  {["fr", "en"].map((lang) => (
                    <button 
                      key={lang} 
                      onClick={() => changeLanguage(lang)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
                        language === lang 
                          ? "bg-gradient-primary text-white shadow-glow"
                          : "text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden p-2.5 rounded-lg bg-dark-100/60 border border-brand-purple/30 hover:border-brand-purple/60 transition-all shadow-card"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-brand-purple" />
                ) : (
                  <Menu size={24} className="text-brand-purple" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 🎨 Barre de navigation - GRADIENT VIOLET */}
        <div className="bg-gradient-secondary border-b border-brand-purple/20 hidden lg:block shadow-lg" ref={dropdownRef}>
          <div className="w-full flex items-center justify-center">
            <div className="w-[95%] lg:w-[90%] xl:w-[85%]">
              <nav className="flex items-center justify-center space-x-1 py-3">
                {navItems.map((item, index) =>
                  item.isDropdown ? (
                    <div 
                      key={index} 
                      className="relative" 
                      onMouseEnter={() => handleMouseEnter(index)} 
                      onMouseLeave={handleMouseLeave}
                    >
                      <button className="relative px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all group text-white hover:bg-white/20 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <span>{item.title}</span>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} 
                        />
                      </button>
                      {activeDropdown === index && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-dark-100/95 backdrop-blur-xl border border-brand-purple/30 rounded-xl shadow-glow min-w-[220px] z-50">
                          {item.items.map((sub, i) => (
                            <NavLink 
                              key={i} 
                              to={sub.path} 
                              onClick={() => setActiveDropdown(null)}
                              className="block px-5 py-3 text-sm font-bold text-gray-300 hover:text-brand-purple hover:bg-brand-purple/10 transition-all border-b border-brand-purple/10 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                            >
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink 
                      key={index} 
                      to={item.path}
                      className={({ isActive }) =>
                        `relative px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all group rounded-lg backdrop-blur-sm ${
                          isActive 
                            ? "text-white bg-white/30 shadow-lg" 
                            : "text-white hover:bg-white/20"
                        }`
                      }
                    >
                      <span>{item.title}</span>
                    </NavLink>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* MENU MOBILE avec thème dark violet */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}>
        <div 
          className={`absolute inset-0 bg-dark-200/80 backdrop-blur-md transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setMobileMenuOpen(false)}
        />

        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-br from-dark-100 to-dark-200 border-l border-brand-purple/30 shadow-glow transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="sticky top-0 bg-gradient-secondary border-b border-brand-purple/20 p-4 flex items-center justify-between shadow-lg backdrop-blur-xl">
            <h2 className="text-xl font-black text-white drop-shadow-lg">MENU</h2>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown(index)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-dark-100/70 backdrop-blur-md hover:bg-dark-100 border border-brand-purple/30 hover:border-brand-purple/60 transition-all text-gray-300 hover:text-white shadow-card"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-brand-purple" />
                        <span className="font-bold text-sm">{item.title}</span>
                      </div>
                      <ChevronDown 
                        size={18} 
                        className={`text-brand-purple transition-transform ${
                          mobileActiveDropdown === index ? "rotate-180" : ""
                        }`} 
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="ml-4 space-y-1 mt-1">
                        {item.items.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => handleMobileNavClick(sub.path)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-300 hover:text-brand-purple hover:bg-brand-purple/10 transition-all font-semibold border border-transparent hover:border-brand-purple/30"
                          >
                            <span className="text-sm">{sub.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <button 
                  key={index} 
                  onClick={() => handleMobileNavClick(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-100/70 backdrop-blur-md hover:bg-dark-100 border border-brand-purple/30 hover:border-brand-purple/60 transition-all text-gray-300 hover:text-white shadow-card"
                >
                  <Icon size={20} className="text-brand-purple" />
                  <span className="font-bold text-sm">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div 
            className="absolute inset-0 bg-dark-200/80 backdrop-blur-md" 
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-dark-100/95 backdrop-blur-xl border border-brand-purple/30 rounded-2xl shadow-glow p-6">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple" size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-dark-200/60 border border-brand-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/60 transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-glow transition-all"
              >
                Rechercher
              </button>
            </form>
            
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result, i) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-200/60 hover:bg-brand-purple/10 border border-brand-purple/20 hover:border-brand-purple/40 transition-all text-left"
                    >
                      <Icon size={18} className="text-brand-purple" />
                      <span className="text-gray-300 font-medium">{result.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;