import { NavLink, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import Loginbtn from "./Loginbtn";
import { useState, useEffect } from "react";
import { 
  Home, FileText, Calendar, Video, Image, Users, 
  Newspaper, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Shield, Zap, TrendingUp, Sparkles, LayoutDashboard,
  Building2, UsersRound, Target, Hash, UtensilsCrossed,
  Fish, Mail, UserPlus
} from "lucide-react";

const NavAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getIcon = (path) => {
    const icons = {
      "/dashboardAdmin": <LayoutDashboard className="w-5 h-5" />,
      "/homePost": <Home className="w-5 h-5" />,
      "/newsPost": <Newspaper className="w-5 h-5" />,
      "/partnerPost": <Building2 className="w-5 h-5" />,
      "/teamMessage": <UsersRound className="w-5 h-5" />,
      "/missionPost": <Target className="w-5 h-5" />,
      "/valeurPost": <Sparkles className="w-5 h-5" />,
      "/professionalAreaPost": <Shield className="w-5 h-5" />,
      "/thonRecipesPost": <UtensilsCrossed className="w-5 h-5" />,
      "/sardineRecipesPost": <UtensilsCrossed className="w-5 h-5" />,
      "/sardineProductPost": <Fish className="w-5 h-5" />,
      "/thonProductPost": <Fish className="w-5 h-5" />,
      "/listeContacts": <Mail className="w-5 h-5" />,
      "/listePostulantsCommunity": <UserPlus className="w-5 h-5" />,
      "/listeAbonnement": <Users className="w-5 h-5" />,
      "/servicePost": <Users className="w-5 h-5" />,
      "default": <FileText className="w-5 h-5" />
    };
    return icons[path] || icons["default"];
  };

  const navCategories = [
    {
      title: "Principal",
      icon: <Hash className="w-4 h-4" />,
      color: "from-blue-500 to-blue-600",
      items: [
        { path: "/dashboardAdmin", label: "Tableau de bord" },
      ]
    },
    {
      title: "Contenu",
      icon: <FileText className="w-4 h-4" />,
      color: "from-purple-500 to-purple-600",
      items: [
        { path: "/homePost", label: "Page d'accueil" },
        { path: "/newsPost", label: "Actualités" },
      ]
    },
    {
      title: "Organisation",
      icon: <Building2 className="w-4 h-4" />,
      color: "from-green-500 to-green-600",
      items: [
        { path: "/partnerPost", label: "Partenaires" },
        { path: "/teamMessage", label: "Équipe" },
        { path: "/missionPost", label: "Missions" },
        // { path: "/valeurPost", label: "Valeurs" },
      ]
    },
    {
      title: "Produits",
      icon: <Fish className="w-4 h-4" />,
      color: "from-orange-500 to-orange-600",
      items: [
        { path: "/professionalAreaPost", label: "Espace Pro" },
        { path: "/thonRecipesPost", label: "Recettes Thon" },
        { path: "/sardineRecipesPost", label: "Recettes Sardine" },
        { path: "/servicePost", label: "Services" },
        { path: "/thonProductPost", label: "Produits Thon" },
       
      ]
    },
    {
      title: "Contacts",
      icon: <Users className="w-4 h-4" />,
      color: "from-pink-500 to-pink-600",
      items: [
        { path: "/listeContacts", label: "Contacts" },
        { path: "/listePostulantsCommunity", label: "Communauté" },
        { path: "/listeAbonnement", label: "Abonnements" },
      ]
    },
  ];

  const handleMobileMenuClose = () => {
    if (windowWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <>
      <aside 
        className={`${
          isSidebarCollapsed ? 'w-16 md:w-20' : 'w-64 md:w-80'
        } transition-all duration-300 ease-in-out h-screen bg-white fixed left-0 top-0 z-50 flex flex-col border-r border-gray-200 shadow-xl`}
      >
        {/* En-tête moderne */}
        <div className={`py-6 px-4 border-b border-gray-100 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
          
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <span className="font-black text-white text-2xl">V</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">VIALI ADMIN</h3>
                <p className="text-xs text-gray-500 font-semibold">Dashboard</p>
              </div>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="font-black text-white text-2xl">V</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200"
            aria-label={isSidebarCollapsed ? "Étendre le menu" : "Réduire le menu"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Navigation moderne avec catégories colorées */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {navCategories.map((category, index) => (
            <div key={index} className={`mb-6 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              {!isSidebarCollapsed && (
                <div className="mb-3 flex items-center gap-2 px-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex-1">
                    {t(category.title)}
                  </h3>
                </div>
              )}

              {isSidebarCollapsed && (
                <div className="mb-3 flex justify-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {category.items.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={handleMobileMenuClose}
                    className="block group/link transition-all duration-200"
                  >
                    {({ isActive }) => (
                      <div className={`
                        relative overflow-hidden
                        ${isSidebarCollapsed ? 'px-0 mx-auto w-12' : 'px-3'} 
                        py-3 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] shadow-lg shadow-orange-500/30' 
                          : 'bg-white hover:bg-gray-50'
                        }
                      `}>
                        {/* Effet glow pour actif */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-50 blur-xl"></div>
                        )}

                        {/* Border dégradé au hover */}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 p-[2px]">
                            <div className="h-full w-full bg-white rounded-xl"></div>
                          </div>
                        )}

                        <div className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} gap-3 z-10`}>
                          <div className={`flex-shrink-0 transition-all duration-300 ${
                            isActive 
                              ? 'text-white scale-110' 
                              : 'text-gray-600 group-hover/link:text-[#F47920] group-hover/link:scale-110'
                          }`}>
                            {getIcon(path)}
                          </div>
                          
                          {!isSidebarCollapsed && (
                            <span className={`font-semibold text-sm transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-gray-700 group-hover/link:text-gray-900'
                            }`}>
                              {t(label)}
                            </span>
                          )}
                          
                          {isActive && !isSidebarCollapsed && (
                            <div className="ml-auto flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Section admin moderne */}
        <div className={`mt-auto p-4 border-t border-gray-100 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-md rounded-full"></div>
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] flex items-center justify-center shadow-md">
                    <span className="font-black text-white text-lg">A</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">admin@viali.com</p>
                </div>
              </div>
              <button className="relative group p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all">
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 blur-md rounded-xl transition-opacity"></div>
                <LogOut className="w-5 h-5 text-red-500 relative" />
              </button>
            </div>
          ) : (
            <button className="relative group p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all">
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 blur-md rounded-xl transition-opacity"></div>
              <LogOut className="w-6 h-6 text-red-500 relative" />
            </button>
          )}
        </div>
      </aside>

      {/* Bouton mobile moderne */}
      <button
        className={`fixed bottom-6 right-6 z-50 ${
          isSidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300 lg:hidden`}
        onClick={() => setSidebarCollapsed(false)}
        aria-label="Ouvrir le menu"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] blur-xl opacity-60 animate-pulse rounded-full"></div>
          <div className="relative bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </button>

      {/* Overlay mobile */}
      {!isSidebarCollapsed && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FDB71A 0%, #F47920 50%, #E84E1B 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #F47920 0%, #E84E1B 100%);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F47920 #f9fafb;
        }
      `}</style>
    </>
  );
};

// Composant pour le layout principal de l'admin
const AdminLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex bg-white min-h-screen">
      <NavAdmin />
      <main className="ml-16 md:ml-20 lg:ml-80 flex-1 transition-all duration-300 ease-in-out w-full">
        <Routes>
          <Route path="/home" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4 text-gray-900">Tableau de bord</h1></div>} />
          <Route path="/platformPost" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4 text-gray-900">Gestion des plateformes</h1></div>} />
          <Route path="*" element={<div className="p-6"><h1 className="text-2xl font-bold mb-4 text-gray-900">Page non trouvée</h1></div>} />
        </Routes>
      </main>
    </div>
  );
};

export { AdminLayout };
export default NavAdmin;