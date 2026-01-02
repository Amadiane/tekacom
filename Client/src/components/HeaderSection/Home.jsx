import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../config/config.js";
import { 
  AlertCircle, 
  Handshake, 
  Users, 
  Target, 
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  TrendingUp,
  Award,
  Rocket,
  Star,
  Heart,
  Shield,
  Layers
} from "lucide-react";

/**
 * 🎨 HOME PAGE V5 - ULTRA MODERNE
 * Design: Hero animé + Cards interactives + Navigation fluide
 * Charte: violet #a34ee5, or #fec603, noir #0a0a0a
 */

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  // Helper pour obtenir l'URL de l'image
  const getImageUrl = (obj, field) => {
    if (!obj) return null;
    if (obj[`${field}_url`]) return obj[`${field}_url`];
    const img = obj[field];
    if (!img) return null;
    if (typeof img === "object" && img.url) return img.url;
    if (typeof img === "string") return img;
    return null;
  };

  // Fetch home-full
  useEffect(() => {
    const fetchHomeFull = async () => {
      try {
        const res = await fetch(CONFIG.API_HOME_FULL);
        if (!res.ok) throw new Error("Erreur de chargement");
        const data = await res.json();
        setHomeData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeFull();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-[#a34ee5]/20 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#fec603]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-4 border-t-[#a34ee5] rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#41124f]/20 border border-red-500/30 rounded-3xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const {
    home = {},
    partners = [],
    latest_team_members: team = [],
    services = [],
    portfolios = [],
  } = homeData || {};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a34ee5]/10 rounded-full blur-[150px] animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#fec603]/10 rounded-full blur-[120px] animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7828a8]/10 rounded-full blur-[100px] animate-float" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ 
          backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)', 
          backgroundSize: '50px 50px' 
        }}></div>
      </div>

      {/* HERO SECTION */}
      {home && (
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16">
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-3 px-6 py-3 mb-8 bg-gradient-to-r from-[#41124f]/80 to-[#0a0a0a]/80 backdrop-blur-xl border border-[#a34ee5]/50 rounded-full shadow-2xl shadow-[#a34ee5]/20"
              style={{ animation: 'fadeInUp 0.8s ease-out' }}
            >
              <Sparkles className="w-5 h-5 text-[#fec603] animate-pulse" />
              <span className="text-sm font-bold text-[#a34ee5] uppercase tracking-wider">
                Bienvenue chez TEKACOM
              </span>
              <div className="w-2 h-2 bg-[#fec603] rounded-full animate-pulse"></div>
            </div>

            {/* Title */}
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-none"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              <span className="block text-white mb-4">
                {home.title_fr || "Votre Vision"}
              </span>
              <span className="block bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent animate-gradient-slow">
                NOTRE EXPERTISE
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-400 font-light max-w-4xl mx-auto leading-relaxed mb-12"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {home.description_fr || "Transformons vos idées en réalités visuelles exceptionnelles"}
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-wrap justify-center gap-4 mb-16"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <button
                onClick={() => navigate('/services')}
                className="group relative px-10 py-5 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-black text-lg rounded-2xl overflow-hidden shadow-2xl shadow-[#a34ee5]/50 hover:shadow-[#a34ee5]/80 transition-all duration-500 hover:scale-110"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  Découvrir nos services
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#fec603] to-[#a34ee5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>

              <button
                onClick={() => navigate('/portfolio')}
                className="px-10 py-5 bg-[#41124f]/60 border-2 border-[#a34ee5]/40 text-white font-bold text-lg rounded-2xl hover:border-[#a34ee5]/80 hover:bg-[#41124f]/80 transition-all duration-300 flex items-center gap-3"
              >
                <Eye className="w-6 h-6" />
                Voir nos réalisations
              </button>
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}
            >
              {[
                { icon: Users, value: team.length + '+', label: 'Experts' },
                { icon: Briefcase, value: portfolios.length + '+', label: 'Projets' },
                { icon: Handshake, value: partners.length + '+', label: 'Partenaires' },
                { icon: Award, value: '100%', label: 'Satisfaction' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="group relative bg-[#41124f]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#a34ee5]/20 hover:border-[#a34ee5]/60 transition-all hover:scale-105">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
                    <div className="relative">
                      <Icon className="w-8 h-8 text-[#fec603] mx-auto mb-3" />
                      <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES SECTION */}
      {services.length > 0 && (
        <section className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-[#a34ee5]/10 border border-[#a34ee5]/30 rounded-full">
                <Briefcase className="w-5 h-5 text-[#a34ee5]" />
                <span className="text-sm font-bold text-[#a34ee5] uppercase">Nos Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-white">Des Solutions </span>
                <span className="bg-gradient-to-r from-[#a34ee5] to-[#fec603] bg-clip-text text-transparent">
                  Sur-Mesure
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Expertise complète en design graphique, développement web et stratégie digitale
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.slice(0, 6).map((service, idx) => (
                <div
                  key={service.id}
                  className="group relative bg-[#41124f]/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#a34ee5]/20 hover:border-[#a34ee5]/60 transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/services')}
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500"></div>
                  
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {getImageUrl(service, "image") ? (
                      <img
                        src={getImageUrl(service, "image")}
                        alt={service.title_fr}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#a34ee5]/20 to-[#fec603]/20 flex items-center justify-center">
                        <Briefcase className="w-16 h-16 text-[#a34ee5]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#fec603]/90 backdrop-blur-sm text-[#0a0a0a] rounded-full text-xs font-bold">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#fec603] transition-colors">
                      {service.title_fr || service.title_en}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {service.description_fr || service.description_en}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[#a34ee5] font-bold group-hover:gap-4 transition-all">
                      <span>En savoir plus</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/services')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#a34ee5]/30"
              >
                <span>Voir tous nos services</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PORTFOLIO SECTION */}
      {portfolios.length > 0 && (
        <section className="relative py-16 px-6 bg-gradient-to-b from-transparent to-[#41124f]/10">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-[#fec603]/10 border border-[#fec603]/30 rounded-full">
                <Layers className="w-5 h-5 text-[#fec603]" />
                <span className="text-sm font-bold text-[#fec603] uppercase">Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-white">Nos Créations </span>
                <span className="bg-gradient-to-r from-[#fec603] to-[#a34ee5] bg-clip-text text-transparent">
                  Exceptionnelles
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Découvrez nos projets les plus remarquables et laissez-vous inspirer
              </p>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {portfolios.slice(0, 6).map((project, idx) => (
                <div
                  key={project.id}
                  className="group relative rounded-3xl overflow-hidden border-2 border-[#a34ee5]/20 hover:border-[#fec603]/60 transition-all duration-500 cursor-pointer"
                  onClick={() => navigate('/portfolio')}
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}
                >
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    {getImageUrl(project, "cover_photo") ? (
                      <img
                        src={getImageUrl(project, "cover_photo")}
                        alt={project.title_fr}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#fec603]/20 to-[#a34ee5]/20 flex items-center justify-center">
                        <Layers className="w-16 h-16 text-[#fec603]/40" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content on hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="text-2xl font-black text-white mb-2">
                        {project.title_fr || project.title_en}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {project.description_fr || project.description_en}
                      </p>
                      <div className="flex items-center gap-2 text-[#fec603] font-bold">
                        <span>Voir le projet</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/portfolio')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#fec603] to-[#a34ee5] text-[#0a0a0a] font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#fec603]/30"
              >
                <span>Voir tout le portfolio</span>
                <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TEAM SECTION */}
      {team.length > 0 && (
        <section className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-[#a34ee5]/10 border border-[#a34ee5]/30 rounded-full">
                <Users className="w-5 h-5 text-[#a34ee5]" />
                <span className="text-sm font-bold text-[#a34ee5] uppercase">Notre Équipe</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-white">Des Talents </span>
                <span className="bg-gradient-to-r from-[#a34ee5] to-[#fec603] bg-clip-text text-transparent">
                  D'Exception
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Rencontrez les experts passionnés qui donnent vie à vos projets
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {team.map((member, idx) => (
                <div
                  key={member.id}
                  className="group relative bg-[#41124f]/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#a34ee5]/20 hover:border-[#a34ee5]/60 transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/notreEquipe')}
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden">
                    {getImageUrl(member, "photo") ? (
                      <img
                        src={getImageUrl(member, "photo")}
                        alt={member.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#a34ee5]/20 to-[#fec603]/20 flex items-center justify-center">
                        <Users className="w-16 h-16 text-[#a34ee5]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-[#a34ee5]/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative p-4">
                    <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#a34ee5] transition-colors">
                      {member.full_name}
                    </h3>
                    <p className="text-sm text-[#fec603] font-medium">
                      {member.position_fr || member.position_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/notreEquipe')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#41124f]/60 border-2 border-[#a34ee5]/40 text-white font-bold text-lg rounded-2xl hover:border-[#a34ee5]/80 hover:bg-[#41124f]/80 transition-all"
              >
                <span>Rencontrer l'équipe</span>
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS SECTION */}
      {partners.length > 0 && (
        <section className="relative py-16 px-6 bg-gradient-to-b from-[#41124f]/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-[#fec603]/10 border border-[#fec603]/30 rounded-full">
                <Handshake className="w-5 h-5 text-[#fec603]" />
                <span className="text-sm font-bold text-[#fec603] uppercase">Partenaires</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-white">Ils Nous Font </span>
                <span className="bg-gradient-to-r from-[#fec603] to-[#a34ee5] bg-clip-text text-transparent">
                  Confiance
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Des partenariats solides avec les leaders de l'industrie
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
              {partners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#a34ee5]/10 hover:border-[#fec603]/40 transition-all duration-500 hover:scale-105 cursor-pointer flex items-center justify-center h-32"
                  onClick={() => navigate('/partner')}
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s both` }}
                >
                  {getImageUrl(partner, "cover_image") ? (
                    <img
                      src={getImageUrl(partner, "cover_image")}
                      alt={partner.name_fr}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span className="text-white font-bold text-center text-sm">
                      {partner.name_fr || partner.name_en}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button
                onClick={() => navigate('/partner')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#fec603] to-[#d4a000] text-[#0a0a0a] font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#fec603]/30"
              >
                <span>Découvrir tous nos partenaires</span>
                <Handshake className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL SECTION */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#a34ee5]/20 via-[#fec603]/20 to-[#a34ee5]/20 blur-3xl"></div>
          
          {/* Content */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-10 bg-gradient-to-br from-[#a34ee5] to-[#7828a8] rounded-3xl shadow-2xl shadow-[#a34ee5]/50 animate-bounce" style={{ animationDuration: '3s' }}>
              <Zap className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8">
              <span className="block text-white mb-4">Prêt à Créer</span>
              <span className="block bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent animate-gradient-slow">
                QUELQUE CHOSE D'INCROYABLE ?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 max-w-3xl mx-auto">
              Contactez-nous dès aujourd'hui et transformons votre vision en réalité
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/contacternous')}
                className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-black text-xl rounded-2xl shadow-2xl shadow-[#a34ee5]/50 hover:shadow-[#a34ee5]/80 transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#fec603] to-[#a34ee5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative">DÉMARRER UN PROJET</span>
                <Rocket className="relative w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-3 px-10 py-6 bg-[#41124f]/60 border-2 border-[#a34ee5]/40 text-white font-bold text-xl rounded-2xl hover:border-[#a34ee5]/80 hover:bg-[#41124f]/80 transition-all"
              >
                <Briefcase className="w-6 h-6" />
                <span>Nos Services</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 5s ease infinite;
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;