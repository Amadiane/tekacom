// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
// import NavAdmin from "./components/Header/NavAdmin";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";
// import React from "react";
// import { trackAction } from "./utils/tracker";

// const App = () => {
//   const location = useLocation();
//   const token = localStorage.getItem("access");

//   // 🔹 Tracker automatique des visites
//   React.useEffect(() => {
//     trackAction({
//       action_type: "visit",
//       page: location.pathname,
//     });
//   }, [location.pathname]);

//   // 🔹 Tracker global des clics
//   React.useEffect(() => {
//     const handleClick = (e) => {
//       const target = e.target;
//       const label = target.id || target.innerText || target.alt || "unknown";

//       trackAction({
//         action_type: "click",
//         page: location.pathname,
//         label,
//         tag: target.tagName,
//       });
//     };

//     document.addEventListener("click", handleClick);
//     return () => document.removeEventListener("click", handleClick);
//   }, [location.pathname]);

//   // 🔹 Tracker global des formulaires pour contact / mail
//   React.useEffect(() => {
//     const handleSubmit = (e) => {
//       const form = e.target;
//       if (!(form instanceof HTMLFormElement)) return;

//       // Détecter le type de formulaire via data-action ou id
//       const actionType = form.dataset.action || form.id;
//       if (actionType === "contactForm") {
//         trackAction({
//           action_type: "contact_submit",
//           page: location.pathname,
//           label: "Contact Form",
//         });
//       } else if (actionType === "mailForm") {
//         trackAction({
//           action_type: "mail_sent",
//           page: location.pathname,
//           label: "Mail Form",
//         });
//       }
//     };

//     document.addEventListener("submit", handleSubmit);
//     return () => document.removeEventListener("submit", handleSubmit);
//   }, [location.pathname]);

//   // ✅ Pages réservées à l'admin
//   const adminPaths = [
//     "/newsPost", "/listeContacts", "/listeRejoindre", "/listePostulantsCommunity",
//     "/listPartners", "/listeAbonnement", "/platformPost", "/valeurPost",
//     "/fondationPost", "/motPresidentPost", "/videoPost", "/photoPost",
//     "/documentPost", "/mediaPartenairePost", "/programPost",
//     "/dashboardAdmin", "/teamMessage", "/missionPost", "/activitiesPost",
//     "/homePost",
//     "/partnerPost", "/professionalAreaPost", "/thonRecipesPost", "/sardineRecipesPost",
//     "/sardineProductPost", "/thonProductPost",
//   ];

//   const isAdminPage = adminPaths.includes(location.pathname);
//   const isLoginPage = location.pathname === "/login";

//   if (isAdminPage && !token) return <Navigate to="/login" replace />;

//   return (
//     <I18nextProvider i18n={i18n}>
//       {isAdminPage ? (
//         <div className="flex h-screen w-screen overflow-hidden bg-white relative">
//           <NavAdmin />
//           {/* <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300"> */}
//           {/* cette ligne permet decaler la page en bas vers la droite ET ml-64,ml-72, ml-80,ml-96, */}
//           <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 bg-white ml-80">
//             <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       ) : (
//         <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
//           {!isLoginPage && <Header logoColor="#000" />}
//           <main className="flex-1 w-full px-4 md:px-6">
//             <Outlet />
//           </main>
//           {!isLoginPage && <Footer />}
//         </div>
//       )}
//     </I18nextProvider>
//   );
// };

// export default App;


import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { trackAction } from "./utils/tracker";

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

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

  // 🔹 Tracker global des formulaires pour contact / mail
  React.useEffect(() => {
    const handleSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      // Détecter le type de formulaire via data-action ou id
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
    "/homePost",
    "/partnerPost", "/professionalAreaPost", "/thonRecipesPost", "/portfolioPost",
    "/servicePost", "/thonProductPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  return (
    <I18nextProvider i18n={i18n}>
      {isAdminPage ? (
        // 🎨 ADMIN LAYOUT - Clean white background for admin dashboard
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 relative">
          <NavAdmin />
          <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 bg-white ml-80">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // 🎨 PUBLIC LAYOUT - Dark theme with brand colors
        <div className="flex flex-col min-h-screen w-full bg-[#0a0a0a] text-gray-100 overflow-x-hidden relative">
          {/* Gradient background effect */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#a34ee5]/20 via-[#7828a8]/10 to-transparent rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#41124f]/30 via-[#7828a8]/10 to-transparent rounded-full blur-3xl opacity-40"></div>
          </div>

          {/* Noise texture overlay for depth */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
               }}
          ></div>

          {/* Header - Fixed at top */}
          {!isLoginPage && (
            <div className="relative z-50">
              <Header logoColor="#a34ee5" />
            </div>
          )}

          {/* Main content with glassmorphism container */}
          {/* pt-20 ensures content scrolls below the fixed header (header height = 80px = h-20) */}
          <main className="flex-1 w-full relative z-10 pt-20">
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

          {/* Accent line at bottom */}
          <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a34ee5] to-transparent opacity-50 pointer-events-none"></div>
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;