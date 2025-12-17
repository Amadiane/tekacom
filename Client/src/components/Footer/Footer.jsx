// import React, { useState } from "react";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Send,
//   Facebook,
//   Instagram,
//   Youtube,
//   Award,
//   Package,
// } from "lucide-react";
// import Logo from "../../assets/logo.png";

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubscribe = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     setIsSubmitting(true);

//     try {
//       const response = await fetch(
//         "https://viali-api.onrender.com/api/newsletter/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setMessage("✓ Merci pour votre inscription !");
//         setEmail("");
//       } else {
//         setMessage(
//           data.error || data.message || "⚠ Une erreur est survenue. Réessayez."
//         );
//       }
//     } catch (err) {
//       console.error("Erreur d'inscription :", err);
//       setMessage("⚠ Erreur de connexion. Réessayez.");
//     } finally {
//       setIsSubmitting(false);
//       setTimeout(() => setMessage(""), 5000);
//     }
//   };

//   const partners = [
//     { name: "Fournisseur A", icon: "💼", url: "#" },
//     { name: "Distributeur B", icon: "🚚", url: "#" },
//   ];

//   const quickLinks = [
//     { label: "Accueil", href: "/profesionnalarea" },
//     { label: "Nos Produits", href: "/profesionnalarea" },
//     { label: "À propos", href: "/profesionnalarea" },
//     { label: "Actualités", href: "/profesionnalarea" },
//     { label: "Contact", href: "/profesionnalarea" },
//   ];

//   const socialLinks = [
//     { name: "Facebook", icon: Facebook, url: "", color: "hover:text-blue-400" },
//     { name: "Instagram", icon: Instagram, url: "", color: "hover:text-pink-400" },
//     { name: "YouTube", icon: Youtube, url: "", color: "hover:text-red-400" },
//   ];

//   return (
//     <footer className="relative bg-[#11153f] overflow-hidden">
//       {/* Effets lumineux */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -top-20 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Section principale */}
//       <div className="relative container mx-auto px-6 lg:px-20 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
//           {/* À propos VIALI */}
//           <div className="space-y-5">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"></div>
//                 <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 overflow-hidden">
//                 <img src={Logo} alt="VIALI Logo" className="w-full h-full object-contain" />
//               </div>

//               </div>
//               <div>
//                 <h3 className="text-xl font-black text-white tracking-tight">VIALI</h3>
//                 <p className="text-xs text-orange-400 font-semibold">Produits de la mer</p>
//               </div>
//             </div>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               VIALI fabrique et distribue des sardines, du thon et autres conserves de qualité supérieure. Nos produits sont frais, sains et savoureux, destinés à satisfaire nos clients à travers la Guinée et au-delà.
//             </p>
            
//             {/* Contact */}
//             <div className="space-y-3 pt-4">
//               <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-orange-500/20 hover:border-orange-500/40 transition-colors group">
//                 <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                   <MapPin className="w-4 h-4 text-white" />
//                 </div>
//                 <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Conakry, Guinée</span>
//               </div>
//               <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                   <Phone className="w-4 h-4 text-white" />
//                 </div>
//                 <span className="text-gray-300 text-sm group-hover:text-white transition-colors">+224 620000000</span>
//               </div>
//               <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
//                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//                   <Mail className="w-4 h-4 text-white" />
//                 </div>
//                 <span className="text-gray-300 text-sm group-hover:text-white transition-colors">contact@viali-gn.com</span>
//               </div>
//             </div>
//           </div>

//           {/* Liens rapides */}
//           <div>
//             <div className="relative inline-block mb-6">
//               <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-lg"></div>
//               <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-orange-500">
//                 Liens Rapides
//               </h4>
//             </div>
//             <ul className="space-y-3">
//               {quickLinks.map((link, idx) => (
//                 <li key={idx}>
//                   <a 
//                     href={link.href}
//                     className="group flex items-center text-gray-400 hover:text-orange-400 transition-all duration-300 text-sm"
//                   >
//                     <span className="w-0 group-hover:w-3 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
//                     <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Partenaires */}
//           <div>
//             <div className="relative inline-block mb-6">
//               <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-lg"></div>
//               <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-orange-500">
//                 Nos Partenaires
//               </h4>
//             </div>
//             <ul className="space-y-3">
//               {partners.map((partner, idx) => (
//                 <li key={idx}>
//                   <a
//                     href={partner.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-start space-x-3 text-sm group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 hover:border-blue-500/40 transition-all"
//                   >
//                     <span className="text-xl group-hover:scale-125 transition-transform duration-300">{partner.icon}</span>
//                     <span className="text-gray-400 group-hover:text-white transition-colors duration-300 leading-tight text-xs">
//                       {partner.name}
//                     </span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <div className="relative inline-block mb-6">
//               <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-lg"></div>
//               <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-orange-500">
//                 Newsletter
//               </h4>
//             </div>
//             <p className="text-gray-400 text-sm mb-5 leading-relaxed">
//               Recevez nos nouveautés produits et promotions directement dans votre boîte mail.
//             </p>
            
//             <div className="space-y-3">
//               <div className="relative group/input">
//                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-lg opacity-0 group-hover/input:opacity-100 transition-opacity rounded-lg"></div>
//                 <div className="relative flex">
//                   <input
//                     type="email"
//                     placeholder="Votre adresse email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
//                     className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border-2 border-orange-500/30 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all duration-300 text-sm"
//                     required
//                   />
//                   <button
//                     onClick={handleSubscribe}
//                     disabled={isSubmitting}
//                     className="px-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-r-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-2 border-orange-500 border-l-0"
//                   >
//                     {isSubmitting ? (
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     ) : (
//                       <Send className="w-4 h-4 text-white" />
//                     )}
//                   </button>
//                 </div>
//               </div>
              
//               {message && (
//                 <div className={`text-xs font-semibold ${message.includes('✓') ? 'text-green-400' : 'text-red-400'} animate-pulse bg-white/5 rounded-lg p-2 border ${message.includes('✓') ? 'border-green-500/30' : 'border-red-500/30'}`}>
//                   {message}
//                 </div>
//               )}
//             </div>

//             {/* Stats produits */}
//             <div className="grid grid-cols-2 gap-3 mt-6">
//               <div className="relative group/stat">
//                 <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
//                 <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-orange-500/30 group-hover/stat:border-orange-500/60 transition-all">
//                   <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                   <p className="text-2xl font-black text-orange-400">10+</p>
//                   <p className="text-xs text-gray-400 mt-1 font-semibold">Années</p>
//                 </div>
//               </div>
//               <div className="relative group/stat">
//                 <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
//                 <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-blue-500/30 group-hover/stat:border-blue-500/60 transition-all">
//                   <Package className="w-6 h-6 text-blue-400 mx-auto mb-2" />
//                   <p className="text-2xl font-black text-blue-400">500+</p>
//                   <p className="text-xs text-gray-400 mt-1 font-semibold">Produits vendus</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Réseaux sociaux */}
//       <div className="relative border-t-2 border-orange-500/20">
//         <div className="container mx-auto px-6 lg:px-20 py-8">
//           <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
//             <p className="text-sm text-gray-400 font-semibold">
//               Suivez-nous sur les réseaux sociaux
//             </p>
//             <div className="flex space-x-4">
//               {socialLinks.map((social, idx) => {
//                 const Icon = social.icon;
//                 return (
//                   <a
//                     key={idx}
//                     href={social.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="relative group/social"
//                   >
//                     <div className={`absolute inset-0 bg-orange-500/30 blur-lg opacity-0 group-hover/social:opacity-100 transition-opacity rounded-full`}></div>
//                     <div className={`relative w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/10 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:shadow-lg hover:border-orange-500/50`}>
//                       <Icon className="w-5 h-5" />
//                     </div>
//                   </a>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="relative bg-black/40 backdrop-blur-sm border-t border-white/10">
//         <div className="container mx-auto px-6 lg:px-20 py-6">
//           <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 text-sm text-gray-400">
//             <p>
//               © {new Date().getFullYear()} <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">VIALI</span>. Tous droits réservés.
//             </p>
//             <div className="flex space-x-6">
//               <a href="/mentions-legales" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
//                 Mentions légales
//               </a>
//               <a href="/politique-confidentialite" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
//                 Confidentialité
//               </a>
//               <a href="/cgv" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
//                 CGV
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Award,
  Package,
} from "lucide-react";
import CONFIG from "../../config/config.js";
import Logo from "../../assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(CONFIG.API_NEWSLETTER_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Merci pour votre inscription !");
        setEmail("");
      } else {
        setMessage(
          data.error || data.message || "⚠ Une erreur est survenue. Réessayez."
        );
      }
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setMessage("⚠ Erreur de connexion. Réessayez.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const partners = [
    { name: "Fournisseur A", icon: "💼", url: "#" },
    { name: "Distributeur B", icon: "🚚", url: "#" },
  ];

  const quickLinks = [
    { label: "Accueil", href: "/" },
    { label: "Nos Produits", href: "/products" },
    { label: "À propos", href: "/about" },
    { label: "Actualités", href: "/actualites" },
    { label: "Contact", href: "/contacternous" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, url: "#", color: "hover:text-pink-400" },
    { name: "YouTube", icon: Youtube, url: "#", color: "hover:text-red-400" },
  ];

  return (
    <footer className="relative bg-[#11153f] overflow-hidden">
      {/* Effets lumineux */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Section principale */}
      <div className="relative container mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* À propos */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"></div>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 overflow-hidden">
                  <img src={Logo} alt="VIALI Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">VIALI</h3>
                <p className="text-xs text-orange-400 font-semibold">Produits de la mer</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              VIALI fabrique et distribue des sardines, du thon et des conserves de qualité supérieure.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg">
                <MapPin className="text-orange-400" />
                <span className="text-gray-300 text-sm">Conakry, Guinée</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg">
                <Phone className="text-blue-400" />
                <span className="text-gray-300 text-sm">+224 610 20 74 07</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg">
                <Mail className="text-purple-400" />
                <span className="text-gray-300 text-sm">contact@viali-gn.com</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-black text-white pb-2 border-b-2 border-orange-500 mb-4">
              Liens Rapides
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h4 className="text-lg font-black text-white pb-2 border-b-2 border-orange-500 mb-4">
              Nos Partenaires
            </h4>
            <ul className="space-y-3">
              {partners.map((p, idx) => (
                <li key={idx}>
                  <div className="text-gray-400 text-sm">{p.icon} {p.name}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black text-white pb-2 border-b-2 border-orange-500 mb-4">
              Newsletter
            </h4>

            <p className="text-gray-400 text-sm mb-4">
              Recevez nos nouveautés et promotions dans votre boîte mail.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex">
                <input
                  type="email"
                  value={email}
                  placeholder="Votre adresse email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 text-white border border-orange-500/30 rounded-l-lg focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 bg-orange-600 rounded-r-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>

            {message && (
              <div className={`text-xs mt-2 font-semibold ${
                message.includes("✓") ? "text-green-400" : "text-red-400"
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="border-t border-orange-500/20 py-6">
        <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center">
          <p className="text-gray-400 text-sm">Suivez-nous</p>

          <div className="flex space-x-4">
            {socialLinks.map((s, idx) => {
              const Icon = s.icon;
              return (
                <a key={idx} href={s.url} className="text-white hover:scale-110 transition-all">
                  <Icon className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black/40 py-5 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-20 text-gray-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-orange-400 font-bold">VIALI</span>. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

