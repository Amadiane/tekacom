

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

