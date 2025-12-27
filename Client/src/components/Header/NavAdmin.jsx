import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Home, Building2, UsersRound, Target, Mail,
  UserPlus, Users, Package, Briefcase, LogOut, Menu, X,
  ChevronDown, Sparkles, Zap, Grid3x3, FileText, Search,
  Bell, Settings, User
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 NAVADMIN V2 - TOP BAR ULTRA MODERNE
 * Layout: Horizontal top bar + Floating quick menu
 * Charte: violet #a34ee5, or #fec603, violet foncé #7828a8, noir #0a0a0a
 */

const NavAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    contacts: 0,
    community: 0,
    newsletter: 0
  });
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const contactsRes = await fetch(CONFIG.API_CONTACT_LIST);
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          const contactsList = Array.isArray(contactsData) 
            ? contactsData 
            : contactsData.results || [];
          setCounts(prev => ({ ...prev, contacts: contactsList.length }));
        }

        const communityRes = await fetch(CONFIG.API_POSTULANT_LIST);
        if (communityRes.ok) {
          const communityData = await communityRes.json();
          const communityList = Array.isArray(communityData)
            ? communityData
            : communityData.results || [];
          setCounts(prev => ({ ...prev, community: communityList.length }));
        }

        const newsletterRes = await fetch(CONFIG.API_ABONNEMENT_LIST);
        if (newsletterRes.ok) {
          const newsletterData = await newsletterRes.json();
          const newsletterList = Array.isArray(newsletterData)
            ? newsletterData
            : newsletterData.results || [];
          setCounts(prev => ({ ...prev, newsletter: newsletterList.length }));
        }
      } catch (err) {
        console.error("Erreur fetch counts:", err);
      }
    };
    
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const getIcon = (path) => {
    const icons = {
      "/dashboardAdmin": <LayoutDashboard className="w-5 h-5" />,
      "/homePost": <Home className="w-5 h-5" />,
      "/partnerPost": <Building2 className="w-5 h-5" />,
      "/teamMessage": <UsersRound className="w-5 h-5" />,
      "/missionPost": <Target className="w-5 h-5" />,
      "/listeContacts": <Mail className="w-5 h-5" />,
      "/listePostulantsCommunity": <UserPlus className="w-5 h-5" />,
      "/listeAbonnement": <Users className="w-5 h-5" />,
      "/servicePost": <Package className="w-5 h-5" />,
      "/portfolioPost": <Briefcase className="w-5 h-5" />,
    };
    return icons[path] || <FileText className="w-5 h-5" />;
  };

  const navCategories = [
    {
      title: "Dashboard",
      color: "#a34ee5",
      items: [
        { path: "/dashboardAdmin", label: "Tableau de bord" }
      ]
    },
    {
      title: "Contenu Site",
      color: "#fec603",
      items: [
        { path: "/homePost", label: "Page d'accueil" }
      ]
    },
    {
      title: "Agence",
      color: "#7828a8",
      items: [
        { path: "/partnerPost", label: "Partenaires" },
        { path: "/teamMessage", label: "Notre Équipe" },
        { path: "/missionPost", label: "Valeurs & Missions" }
      ]
    },
    {
      title: "Créations",
      color: "#a34ee5",
      items: [
        { path: "/portfolioPost", label: "Portfolio" },
        { path: "/servicePost", label: "Services" }
      ]
    },
    {
      title: "Clients",
      color: "#fec603",
      items: [
        { path: "/listeContacts", label: "Messages", count: counts.contacts },
        // { path: "/listePostulantsCommunity", label: "Communauté", count: counts.community },
        { path: "/listeAbonnement", label: "Abonnements", count: counts.newsletter }
      ]
    }
  ];

  // Quick access items
  const quickAccess = [
    { path: "/dashboardAdmin", label: "Dashboard", icon: <LayoutDashboard /> },
    { path: "/portfolioPost", label: "Portfolio", icon: <Briefcase /> },
    { path: "/listeContacts", label: "Messages", icon: <Mail />, badge: counts.contacts },
    { path: "/servicePost", label: "Services", icon: <Package /> },
  ];

  return (
    <>
      {/* TOP BAR */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#a34ee5]/20 z-[200]">
        <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between gap-6">
          
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/dashboardAdmin" className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] to-[#fec603] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-xl"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-[#a34ee5] via-[#fec603] to-[#7828a8] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-black">T</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navCategories.map((category, idx) => (
                <div key={idx} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#41124f]/40 transition-all font-semibold text-sm"
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {activeDropdown === idx && (
                    <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#a34ee5]/30 rounded-2xl shadow-2xl overflow-hidden">
                      {category.items.map((item, itemIdx) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center justify-between px-4 py-3 transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white'
                                : 'text-gray-300 hover:bg-[#41124f]/40 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div style={{ color: isActive ? '#fff' : category.color }}>
                                {getIcon(item.path)}
                              </div>
                              <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {item.count > 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#fec603]/20 text-[#fec603]'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-xl">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-40 lg:w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-3 bg-[#41124f]/30 hover:bg-[#41124f]/50 border border-[#a34ee5]/20 hover:border-[#a34ee5]/40 rounded-xl transition-all">
              <Bell className="w-5 h-5 text-gray-300" />
              {(counts.contacts + counts.community + counts.newsletter) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fec603] rounded-full text-[#0a0a0a] text-xs font-bold flex items-center justify-center">
                  {counts.contacts + counts.community + counts.newsletter}
                </span>
              )}
            </button>

            {/* Quick Menu Button */}
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="p-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] hover:from-[#7828a8] hover:to-[#a34ee5] rounded-xl transition-all shadow-lg"
            >
              <Grid3x3 className="w-5 h-5 text-white" />
            </button>

            {/* Admin Profile */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-[#a34ee5] to-[#fec603] rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:block">
                <div className="text-white text-sm font-bold">Admin</div>
                <div className="text-gray-500 text-xs">admin@tekacom.gn</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 rounded-xl transition-all"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-3 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-xl"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* FLOATING QUICK MENU */}
      {showQuickMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250]"
            onClick={() => setShowQuickMenu(false)}
          ></div>
          
          <div className="fixed top-24 right-6 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#a34ee5]/30 rounded-3xl shadow-2xl z-[300] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#a34ee5]/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#fec603]" />
                  Accès Rapide
                </h3>
                <button
                  onClick={() => setShowQuickMenu(false)}
                  className="p-2 hover:bg-[#41124f]/40 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-500 text-xs">Vos pages les plus utilisées</p>
            </div>

            {/* Quick Links Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickAccess.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setShowQuickMenu(false)}
                    className={`relative p-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-[#a34ee5] to-[#7828a8] text-white'
                        : 'bg-[#41124f]/30 hover:bg-[#41124f]/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-[#a34ee5]/20'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#fec603] text-[#0a0a0a] rounded-full text-xs font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* All Categories */}
            <div className="p-4 border-t border-[#a34ee5]/20">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Toutes les catégories
              </div>
              <div className="space-y-1">
                {navCategories.map((category, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">
                      {category.title}
                    </div>
                    {category.items.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setShowQuickMenu(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white'
                              : 'text-gray-400 hover:bg-[#41124f]/30 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getIcon(item.path)}
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#fec603]/20 text-[#fec603]'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          
          <div className="fixed top-20 left-0 right-0 bottom-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#a34ee5]/20 z-[300] overflow-y-auto lg:hidden">
            <div className="p-6 space-y-6">
              {navCategories.map((category, idx) => (
                <div key={idx}>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    {category.title}
                  </div>
                  <div className="space-y-1">
                    {category.items.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white'
                              : 'text-gray-300 hover:bg-[#41124f]/40 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getIcon(item.path)}
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#fec603]/20 text-[#fec603]'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Click outside to close dropdowns */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-[150]"
          onClick={() => setActiveDropdown(null)}
        ></div>
      )}
    </>
  );
};

export default NavAdmin;