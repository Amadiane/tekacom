import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Users, Palette, Video, Printer, Globe, GraduationCap, Lightbulb, Calendar, Award, FileText, Sparkles, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";

/**
 * 🎨 HEADER ULTRA MODERNE - TEKACOM FINAL
 * 
 * Corrections finales:
 * - Espacement compact entre services (gap-1 au lieu de gap-2)
 * - Bordure alignée parfaitement (mt-2 au lieu de mt-3)
 * - Mega menu plus petit (580px au lieu de 680px)
 */

const Navlinks = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setActiveDropdown(null);
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
  }, [mobileMenuOpen]);

  const allPages = [
    { title: "Accueil", path: "/", keywords: ["home", "accueil", "tekacom"], icon: Award, description: "Page d'accueil" },
    { title: "Qui sommes-nous", path: "/about", keywords: ["à propos", "équipe"], icon: Users, description: "Découvrez Tekacom" },
    { title: "Notre équipe", path: "/team", keywords: ["équipe", "team"], icon: Users, description: "Notre équipe" },
    { title: "Notre mission", path: "/mission", keywords: ["mission", "vision"], icon: Award, description: "Inspirer, Créer, Impacter" },
    { title: "Communication visuelle", path: "/services/communication-visuelle", keywords: ["design", "graphisme", "logo"], icon: Palette, description: "Design graphique" },
    { title: "Production audiovisuelle", path: "/services/production-audiovisuelle", keywords: ["vidéo", "film"], icon: Video, description: "Production vidéo" },
    { title: "Impression numérique", path: "/services/impression-numerique", keywords: ["impression", "print"], icon: Printer, description: "Impression grand format" },
    { title: "Conception de sites web", path: "/services/conception-sites-web", keywords: ["site web", "développement"], icon: Globe, description: "Sites web" },
    { title: "Community management", path: "/services/community-management", keywords: ["réseaux sociaux"], icon: Users, description: "Réseaux sociaux" },
    { title: "Formation", path: "/services/formation", keywords: ["formation", "cours"], icon: GraduationCap, description: "Formations" },
    { title: "Consulting", path: "/services/consulting", keywords: ["conseil", "stratégie"], icon: Lightbulb, description: "Conseil" },
    { title: "Organisation d'événements", path: "/services/organisation-evenements", keywords: ["événement"], icon: Calendar, description: "Événementiel" },
    { title: "Portfolio", path: "/portfolio", keywords: ["portfolio", "projets", "réalisations", "travaux"], icon: FileText, description: "Nos projets" },
    { title: "Contact", path: "/contact", keywords: ["contact", "devis"], icon: Calendar, description: "Contactez-nous" },
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 2) {
      const searchLower = value.toLowerCase();
      const results = allPages.filter(page => {
        const titleMatch = page.title.toLowerCase().includes(searchLower);
        const keywordMatch = page.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
        const descriptionMatch = page.description?.toLowerCase().includes(searchLower);
        return titleMatch || keywordMatch || descriptionMatch;
      }).slice(0, 8);
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
    else if (searchResults.length > 0) navigate(searchResults[0].path);
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
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 400);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { title: "Accueil", path: "/", icon: Award },
    {
      title: "À propos",
      isDropdown: true,
      icon: Users,
      items: [
        { title: "Qui sommes-nous", path: "/about", icon: Users },
        { title: "Notre équipe", path: "/notreEquipe", icon: Users },
        { title: "Notre mission", path: "/nosMissions", icon: Award },
      ]
    },
    { title: "Services", path: "/services", icon: Palette }, // ✅ Plus de dropdown, juste un lien direct
    { title: "Portfolio", path: "/portfolio", icon: FileText },
    { title: "Partenaires", path: "/partner", icon: FileText },
    { title: "Contact", path: "/contacternous", icon: Calendar },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className={`
            relative transition-all duration-500
            ${scrolled 
              ? 'bg-dark-100/99 backdrop-blur-3xl shadow-[0_0_120px_rgba(163,78,229,0.3)] py-3' 
              : 'bg-dark-100/98 backdrop-blur-3xl shadow-[0_0_80px_rgba(163,78,229,0.2)] py-4'
            }
          `}>
            <div className="flex items-center justify-between px-6">
              
              <NavLink to="/" className="flex items-center gap-3 group relative z-10">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Tekacom" 
                    className={`relative object-contain transition-all duration-500 group-hover:scale-105 ${scrolled ? 'h-16' : 'h-20'}`}
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] to-[#fec603] opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                </div>
              </NavLink>

              <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
                {navItems.map((item, index) =>
                  item.isDropdown ? (
                    <div 
                      key={index} 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(index)} 
                      onMouseLeave={handleMouseLeave}
                    >
                      <button className={`
                        group px-4 py-2 text-sm font-semibold uppercase tracking-wide 
                        transition-all duration-300 flex items-center gap-1 rounded-lg
                        ${activeDropdown === index 
                          ? 'text-[#a34ee5] bg-[#a34ee5]/10' 
                          : 'text-gray-300 hover:text-[#a34ee5] hover:bg-[#a34ee5]/5'}
                      `}>
                        <span>{item.title}</span>
                        <ChevronDown 
                          size={14} 
                          className={`transition-all duration-300 ${activeDropdown === index ? "rotate-180 text-[#fec603]" : ""}`} 
                        />
                      </button>
                      
                      {/* ✨ MEGA MENU COMPACT avec bordure alignée */}
                      {activeDropdown === index && (
                        <div className={`
                          absolute top-full left-1/2 -translate-x-1/2 mt-1.5
                          bg-dark-100/100 backdrop-blur-3xl 
                          rounded-xl overflow-hidden
                          shadow-[0_0_100px_rgba(163,78,229,0.4)]
                          ${item.isMegaMenu ? 'w-[560px]' : 'min-w-[280px]'}
                        `}>
                          {item.isMegaMenu ? (
                            // 🎨 MEGA MENU - Ultra compact
                            <div className="p-1.5">
                              <div className="grid grid-cols-2 gap-0.5">
                                {item.items.map((sub, i) => {
                                  const SubIcon = sub.icon;
                                  return (
                                    <NavLink 
                                      key={i} 
                                      to={sub.path} 
                                      onClick={() => setActiveDropdown(null)}
                                      className="group/item flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#a34ee5]/10 hover:to-[#fec603]/5"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-[#a34ee5]/10 group-hover/item:bg-[#a34ee5]/20 flex items-center justify-center flex-shrink-0 transition-all">
                                        <SubIcon size={14} className="text-[#a34ee5] group-hover/item:text-[#fec603] transition-colors" />
                                      </div>
                                      <span className="text-sm font-medium text-white group-hover/item:text-[#a34ee5] transition-colors flex-1">
                                        {sub.title}
                                      </span>
                                      <ArrowRight size={12} className="text-[#a34ee5] opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all flex-shrink-0" />
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // Dropdown À propos - IDENTIQUE AUX SERVICES
                            <div className="p-1.5">
                              {item.items.map((sub, i) => {
                                const SubIcon = sub.icon;
                                return (
                                  <NavLink 
                                    key={i} 
                                    to={sub.path} 
                                    onClick={() => setActiveDropdown(null)}
                                    className="group/item flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#a34ee5]/10 hover:to-[#fec603]/5"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-[#a34ee5]/10 group-hover/item:bg-[#a34ee5]/20 flex items-center justify-center transition-all">
                                      <SubIcon size={14} className="text-[#a34ee5] group-hover/item:text-[#fec603] transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-white group-hover/item:text-[#a34ee5] transition-colors flex-1">
                                      {sub.title}
                                    </span>
                                    <ArrowRight size={12} className="text-[#a34ee5] opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all flex-shrink-0" />
                                  </NavLink>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink 
                      key={index} 
                      to={item.path}
                      className={({ isActive }) =>
                        `px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-300 ${
                          isActive 
                            ? "text-white bg-gradient-to-r from-[#a34ee5] to-[#7828a8] shadow-[0_0_20px_rgba(163,78,229,0.4)]" 
                            : "text-gray-300 hover:text-[#a34ee5] hover:bg-[#a34ee5]/5"
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  )
                )}
              </nav>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSearchOpen(true)} 
                  className="p-2.5 rounded-lg bg-dark-200/50 hover:bg-[#a34ee5]/20 transition-all group"
                  title="Rechercher"
                >
                  <Search size={18} className="text-[#a34ee5] group-hover:text-[#fec603] group-hover:scale-110 transition-all" />
                </button>

                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="lg:hidden p-2.5 rounded-lg bg-dark-200/50 hover:bg-[#a34ee5]/20 transition-all"
                >
                  {mobileMenuOpen ? <X size={20} className="text-[#a34ee5]" /> : <Menu size={20} className="text-[#a34ee5]" />}
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-dark-200/90 backdrop-blur-md transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-br from-dark-100 to-dark-200 shadow-[0_0_100px_rgba(163,78,229,0.4)] transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="sticky top-0 bg-gradient-to-r from-[#7828a8] to-[#a34ee5] p-4 flex items-center justify-between backdrop-blur-xl z-10">
            <h2 className="text-lg font-black text-white">MENU</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all">
              <X size={20} className="text-white" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-1">
                    <div className="px-4 py-3 rounded-lg bg-dark-100/70 text-gray-300 font-bold text-sm flex items-center gap-3">
                      <Icon size={18} className="text-[#a34ee5]" />
                      <span>{item.title}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.items.map((sub, i) => {
                        const SubIcon = sub.icon;
                        return (
                          <button key={i} onClick={() => handleMobileNavClick(sub.path)} className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:text-[#a34ee5] hover:bg-[#a34ee5]/10 transition-all font-medium text-sm">
                            {SubIcon && <SubIcon size={14} className="text-[#a34ee5]/60" />}
                            <span>{sub.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <button key={index} onClick={() => handleMobileNavClick(item.path)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-100/70 hover:bg-[#a34ee5]/20 transition-all text-gray-300 hover:text-white">
                  <Icon size={18} className="text-[#a34ee5]" />
                  <span className="font-bold text-sm">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
          <div className="absolute inset-0 bg-dark-200/80 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl bg-dark-100/98 backdrop-blur-3xl rounded-2xl shadow-[0_0_120px_rgba(163,78,229,0.5)] p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search size={16} className="text-[#a34ee5]" />
              Rechercher sur le site
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a34ee5]" size={20} />
                <input ref={searchRef} type="text" value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Ex: site web, vidéo..." autoFocus className="w-full pl-12 pr-4 py-3 bg-dark-200/60 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a34ee5]/60 focus:ring-2 focus:ring-[#a34ee5]/20 transition-all" />
              </div>
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(163,78,229,0.5)] transition-all disabled:opacity-50" disabled={!searchTerm.trim()}>
                Rechercher
              </button>
            </form>
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}</p>
                {searchResults.map((result, i) => {
                  const Icon = result.icon;
                  return (
                    <button key={i} onClick={() => handleResultClick(result.path)} className="w-full flex items-start gap-3 px-4 py-3 rounded-lg bg-dark-200/60 hover:bg-gradient-to-r hover:from-[#a34ee5]/10 hover:to-[#fec603]/5 transition-all text-left group">
                      <Icon size={18} className="text-[#a34ee5] group-hover:text-[#fec603] mt-0.5 flex-shrink-0 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-[#a34ee5] transition-colors">{result.title}</p>
                        {result.description && <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {searchTerm.length > 2 && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun résultat pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;