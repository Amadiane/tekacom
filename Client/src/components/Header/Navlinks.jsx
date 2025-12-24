import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Menu, X, Users, Award, FileText, Calendar, Palette } from "lucide-react";
import logo from "../../assets/logo.png";

/**
 * 🎨 NAVLINKS SIMPLIFIÉ - TEKACOM
 * Basé sur la structure qui fonctionne, sans conflits z-index
 */

const Navlinks = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { title: "Accueil", path: "/", icon: Award },
    { 
      title: "À propos", 
      path: "/about", 
      icon: Users,
      subItems: [
        { title: "Qui sommes-nous", path: "/about" },
        { title: "Notre équipe", path: "/notreEquipe" },
        { title: "Notre mission", path: "/nosMissions" },
      ]
    },
    { title: "Services", path: "/services", icon: Palette },
    { title: "Portfolio", path: "/portfolio", icon: FileText },
    { title: "Partenaires", path: "/partner", icon: FileText },
    { title: "Contact", path: "/contacternous", icon: Calendar },
  ];

  return (
    <>
      {/* HEADER PRINCIPAL - Structure simple qui fonctionne */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3 group relative">
            <img 
              src={logo} 
              alt="Tekacom" 
              className="h-16 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "text-white bg-gradient-to-r from-[#a34ee5] to-[#7828a8]" 
                      : "text-gray-300 hover:text-[#a34ee5] hover:bg-[#a34ee5]/5"
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSearchOpen(true)} 
              className="p-2.5 rounded-lg bg-dark-200/50 hover:bg-[#a34ee5]/20 transition-all group hidden lg:block"
              title="Rechercher"
            >
              <Search size={18} className="text-[#a34ee5] group-hover:text-[#fec603] transition-all" />
            </button>

            {/* MENU MOBILE BURGER */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2.5 rounded-lg bg-dark-200/50 hover:bg-[#a34ee5]/20 transition-all"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-[#a34ee5]" />
              ) : (
                <Menu size={24} className="text-[#a34ee5]" />
              )}
            </button>
          </div>
        </div>

        {/* MENU MOBILE DRAWER - Comme dans l'exemple qui fonctionne */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 space-y-2 bg-dark-100/95 backdrop-blur-xl rounded-2xl mt-2 px-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#a34ee5]/20 transition-all"
                  >
                    <Icon size={18} className="text-[#a34ee5]" />
                    <span className="font-semibold">{item.title}</span>
                  </NavLink>
                  
                  {/* Sous-items si présents */}
                  {item.subItems && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((sub, i) => (
                        <NavLink
                          key={i}
                          to={sub.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-[#a34ee5] transition-all"
                        >
                          {sub.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEARCH MODAL - Simple overlay */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-dark-100/98 backdrop-blur-xl rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Search size={16} className="text-[#a34ee5]" />
                Rechercher
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Rechercher sur le site..."
              autoFocus
              className="w-full px-4 py-3 bg-dark-200/60 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a34ee5]/60 transition-all"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;