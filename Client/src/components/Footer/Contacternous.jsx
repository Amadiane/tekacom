import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Mail, 
  User, 
  MessageSquare, 
  Tag, 
  Sparkles,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import CONFIG from "../../config/config.js";
import { trackAction } from "../../utils/tracker";

/**
 * 🎨 PAGE CONTACT ULTRA MODERNE - TEKACOM
 * Design moderne + Catégories API originales
 */

const Contacternous = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "question",
    message: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subject: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(CONFIG.API_CONTACT_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du message");

      setSuccessMessage("🎉 Message envoyé avec succès ! Nous vous répondrons sous 24h.");

      trackAction({
        action_type: "contact_submit",
        page: "/contact",
        label: formData.subject || "Contact Form",
      });

      trackAction({
        action_type: "mail_sent",
        page: "/contact",
        label: formData.email,
        meta: { subject: formData.subject },
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "question",
        message: "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error(err);
      setError("⚠️ Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ CATÉGORIES ORIGINALES DE L'API (4 catégories exactes)
  const categories = [
    { value: "question", label: "Questions générales", icon: "💬" },
    { value: "support", label: "Support technique", icon: "🔧" },
    { value: "partenariat", label: "Partenariat", icon: "🤝" },
    { value: "commentaire", label: "Commentaires et suggestions", icon: "💡" },
  ];

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Téléphone", 
      value: "+224 626 74 14 78",
      link: "tel:+224626741478",
      color: "from-[#a34ee5] to-[#7828a8]"
    },
    { 
      icon: Mail, 
      label: "Email", 
      value: "contact@tekacom.gn",
      link: "mailto:contact@tekacom.gn",
      color: "from-[#fec603] to-[#a34ee5]"
    },
    { 
      icon: MapPin, 
      label: "Adresse", 
      value: "Conakry, Guinée",
      link: "https://maps.app.goo.gl/2gya1yBW9QCu4Lt36",
      color: "from-[#7828a8] to-[#a34ee5]"
    },
    { 
      icon: Clock, 
      label: "Horaires", 
      value: "Lun - Ven : 8h - 18h",
      color: "from-[#a34ee5] to-[#fec603]"
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7828a8]/10 rounded-full blur-3xl"></div>
        
        <div className="hidden md:block absolute inset-0 opacity-[0.015]" 
             style={{
               backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-gradient-to-r from-[#41124f]/60 to-[#0a0a0a]/60 backdrop-blur-xl border border-[#a34ee5]/40 rounded-full shadow-lg shadow-[#a34ee5]/20">
            <Sparkles className="w-4 h-4 text-[#fec603] animate-pulse" />
            <span className="text-sm font-bold text-[#a34ee5] uppercase tracking-wider">
              Parlons de votre projet
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none">
            <span className="block text-white mb-2">Contactez</span>
            <span className="block bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent animate-gradient">
              TEKACOM
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 font-light max-w-3xl leading-relaxed">
            Transformons ensemble vos{" "}
            <span className="text-[#fec603] font-bold">idées créatives</span>{" "}
            en{" "}
            <span className="text-[#a34ee5] font-bold">réalité visuelle</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative px-6 lg:px-12 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Toast Messages */}
          {error && (
            <div className="fixed top-24 right-6 z-[9999] animate-in slide-in-from-right duration-500 max-w-md">
              <div className="relative bg-gradient-to-r from-red-500/90 to-rose-600/90 backdrop-blur-xl rounded-2xl p-5 border border-red-400/50 shadow-2xl">
                <div className="absolute -inset-1 bg-red-400/30 rounded-2xl blur-xl -z-10"></div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-white flex-shrink-0" />
                  <p className="text-white font-semibold text-sm">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="fixed top-24 right-6 z-[9999] animate-in slide-in-from-right duration-500 max-w-md">
              <div className="relative bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl p-5 border border-green-400/50 shadow-2xl">
                <div className="absolute -inset-1 bg-green-400/30 rounded-2xl blur-xl -z-10"></div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                  <p className="text-white font-semibold text-sm">{successMessage}</p>
                  <button 
                    onClick={() => setSuccessMessage(null)}
                    className="ml-auto text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Info Cards */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white mb-6">
                  Nos{" "}
                  <span className="bg-gradient-to-r from-[#a34ee5] to-[#fec603] bg-clip-text text-transparent">
                    Coordonnées
                  </span>
                </h2>

                {contactInfo.map((item, idx) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="group relative bg-[#41124f]/20 backdrop-blur-sm border border-[#a34ee5]/20 hover:border-[#a34ee5]/50 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#a34ee5]/20">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}></div>
                      
                      <div className="relative flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                            {item.label}
                          </p>
                          <p className="text-white font-bold group-hover:text-[#fec603] transition-colors">
                            {item.value}
                          </p>
                        </div>
                        {item.link && (
                          <ArrowRight className="w-5 h-5 text-[#a34ee5] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </div>
                  );

                  return item.link ? (
                    <a 
                      key={idx} 
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={idx}>{content}</div>
                  );
                })}
              </div>

              {/* CTA Box */}
              <div className="relative bg-gradient-to-br from-[#41124f]/40 to-[#0a0a0a]/40 backdrop-blur-sm rounded-2xl p-8 border border-[#a34ee5]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fec603]/20 rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <Zap className="w-10 h-10 text-[#fec603] mb-4" />
                  <h3 className="text-xl font-black text-white mb-2">
                    Besoin d'un devis rapide ?
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Décrivez votre projet et recevez une estimation sous 24h
                  </p>
                  <div className="inline-flex items-center gap-2 text-[#fec603] font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Réponse garantie</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <div className="relative bg-[#41124f]/20 backdrop-blur-sm border border-[#a34ee5]/30 rounded-3xl p-8 md:p-10 overflow-hidden">
                
                {/* Glow effect */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#a34ee5]/20 rounded-full blur-3xl"></div>
                
                <form onSubmit={handleSubmit} className="relative space-y-6">
                  
                  {/* Form Title */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">
                      Envoyez-nous un{" "}
                      <span className="bg-gradient-to-r from-[#a34ee5] to-[#fec603] bg-clip-text text-transparent">
                        message
                      </span>
                    </h2>
                    <p className="text-gray-400">Tous les champs sont requis</p>
                  </div>

                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#a34ee5]" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-[#0a0a0a]/60 border-2 border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5] focus:shadow-[0_0_20px_rgba(163,78,229,0.3)] transition-all duration-300"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#a34ee5]" />
                        Adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-[#0a0a0a]/60 border-2 border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5] focus:shadow-[0_0_20px_rgba(163,78,229,0.3)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Category - 4 catégories en grid 2x2 */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#a34ee5]" />
                      Catégorie
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.category === cat.value
                              ? 'bg-gradient-to-br from-[#a34ee5] to-[#7828a8] border-[#fec603] shadow-lg shadow-[#a34ee5]/50'
                              : 'bg-[#0a0a0a]/40 border-[#a34ee5]/30 hover:border-[#a34ee5]/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{cat.icon}</div>
                          <div className={`text-xs font-bold ${
                            formData.category === cat.value ? 'text-white' : 'text-gray-400'
                          }`}>
                            {cat.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#a34ee5]" />
                      Sujet
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="De quoi souhaitez-vous parler ?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#0a0a0a]/60 border-2 border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5] focus:shadow-[0_0_20px_rgba(163,78,229,0.3)] transition-all duration-300"
                    />
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#a34ee5]" />
                      Votre message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Décrivez votre projet en détail..."
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="w-full px-5 py-4 bg-[#0a0a0a]/60 border-2 border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5] focus:shadow-[0_0_20px_rgba(163,78,229,0.3)] transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-black text-lg rounded-xl shadow-2xl shadow-[#a34ee5]/50 hover:shadow-[#a34ee5]/80 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fec603] to-[#a34ee5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          <span>ENVOYER LE MESSAGE</span>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500 text-center">
                    En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
                    Vos données sont sécurisées et ne seront jamais partagées.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations CSS */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Contacternous;