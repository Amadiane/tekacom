import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { trackAction } from "./utils/tracker";

/**
 * 🎨 APP - TEKACOM FIXED SCROLL
 * ✅ Scroll naturel sur body (pas overflow-hidden)
 * ✅ Backgrounds en absolute (pas fixed pour mobile)
 * ✅ Mobile-friendly avec -webkit-overflow-scrolling
 * Harmonisé avec charte: violet #a34ee5, or #fec603, violet foncé #7828a8, noir #0a0a0a
 */

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  // 🎨 Custom Scrollbar Styles - TEKACOM Brand
  const scrollbarStyles = `
    /* ===== Mobile Scroll Fix ===== */
    html, body {
      height: auto;
      overflow-x: hidden;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* ===== Scrollbar Firefox ===== */
    * {
      scrollbar-width: thin;
      scrollbar-color: #a34ee5 #0a0a0a;
    }

    /* ===== Scrollbar Chrome, Edge, Safari ===== */
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background: #0a0a0a;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #a34ee5 0%, #7828a8 100%);
      border-radius: 10px;
      border: 2px solid #0a0a0a;
      transition: all 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #fec603 0%, #a34ee5 100%);
      border-color: #41124f;
      box-shadow: 0 0 10px rgba(163, 78, 229, 0.5);
    }

    ::-webkit-scrollbar-thumb:active {
      background: linear-gradient(180deg, #a34ee5 0%, #fec603 100%);
    }

    /* Scrollbar horizontal */
    ::-webkit-scrollbar-corner {
      background: #0a0a0a;
    }

    /* ===== Scrollbar Admin Dashboard ===== */
    .admin-layout ::-webkit-scrollbar-track {
      background: #41124f20;
      border-radius: 10px;
    }

    .admin-layout ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #a34ee5 0%, #fec603 50%, #7828a8 100%);
      border: 2px solid #0a0a0a;
      border-radius: 10px;
    }

    .admin-layout ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #fec603 0%, #a34ee5 100%);
      box-shadow: 0 0 10px rgba(163, 78, 229, 0.5);
    }
  `;

  // 🔹 Tracker automatique des visites
  React.useEffect(() => {
    trackAction({
      action_type: "visit",
      page: location.pathname,
    });
  }, [location.pathname]);

  // 🔹 Tracker global des clics
  React.useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const label = target.id || target.innerText || target.alt || "unknown";

      trackAction({
        action_type: "click",
        page: location.pathname,
        label,
        tag: target.tagName,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  // 🔹 Tracker global des formulaires
  React.useEffect(() => {
    const handleSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      const actionType = form.dataset.action || form.id;
      if (actionType === "contactForm") {
        trackAction({
          action_type: "contact_submit",
          page: location.pathname,
          label: "Contact Form",
        });
      } else if (actionType === "mailForm") {
        trackAction({
          action_type: "mail_sent",
          page: location.pathname,
          label: "Mail Form",
        });
      }
    };

    document.addEventListener("submit", handleSubmit);
    return () => document.removeEventListener("submit", handleSubmit);
  }, [location.pathname]);

  // ✅ Pages réservées à l'admin
  const adminPaths = [
    "/newsPost", "/listeContacts", "/listeRejoindre", "/listePostulantsCommunity",
    "/listPartners", "/listeAbonnement", "/platformPost", "/valeurPost",
    "/fondationPost", "/motPresidentPost", "/videoPost", "/photoPost",
    "/documentPost", "/mediaPartenairePost", "/programPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost", "/activitiesPost",
    "/homePost", "/partnerPost", "/professionalAreaPost", 
    "/thonRecipesPost", "/sardineRecipesPost",
    "/sardineProductPost", "/thonProductPost", 
    "/servicePost", "/portfolioPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  return (
    <I18nextProvider i18n={i18n}>
      {/* Custom Scrollbar Styles */}
      <style>{scrollbarStyles}</style>
      
      {isAdminPage ? (
        // 🎨 ADMIN LAYOUT - Dark theme harmonized with TEKACOM
        // ✅ FIXED: Scroll naturel + min-h-screen (pas h-screen) + absolute backgrounds
        <div className="admin-layout flex min-h-screen w-full bg-[#0a0a0a] relative">
          {/* Admin background effects - ABSOLUTE (pas fixed) pour mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7828a8]/5 rounded-full blur-3xl"></div>
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.015]" 
                 style={{
                   backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)',
                   backgroundSize: '40px 40px'
                 }}
            ></div>
          </div>
          
          <NavAdmin />
          
          {/* MAIN CONTENT - Scroll naturel avec overflow-y-auto */}
          <main className="flex-1 overflow-y-auto transition-all duration-500 ease-out bg-transparent relative">
            {/* Container centré avec padding-top pour éviter le masquage par NavAdmin */}
            <div className="min-h-screen w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 py-6 mt-20">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // 🎨 PUBLIC LAYOUT - Dark theme with TEKACOM brand colors
        // ✅ FIXED: PAS de overflow-hidden, backgrounds en absolute
        <div className="flex flex-col min-h-screen w-full bg-[#0a0a0a] text-gray-100 relative">
          {/* Gradient background effect - ABSOLUTE pour mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#a34ee5]/20 via-[#7828a8]/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#41124f]/30 via-[#7828a8]/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#fec603]/5 rounded-full blur-3xl opacity-20"></div>
          </div>

          {/* Dot grid texture overlay for depth - ABSOLUTE */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" 
               style={{
                 backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}
          ></div>

          {/* Header - FIXED (OK car nécessaire) */}
          {!isLoginPage && (
            <div className="fixed top-0 left-0 right-0 z-[100]">
              <Header logoColor="#a34ee5" />
            </div>
          )}

          {/* Main content - Scroll naturel sur body */}
          <main className="flex-1 w-full relative pt-32" style={{ zIndex: 1 }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          {!isLoginPage && (
            <div className="relative z-10 mt-auto">
              <Footer />
            </div>
          )}

          {/* Accent line at bottom - TEKACOM gradient - FIXED (decoratif) */}
          <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a34ee5] to-transparent opacity-50 pointer-events-none"></div>
          <div className="fixed bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#fec603] to-transparent opacity-30 pointer-events-none"></div>
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;