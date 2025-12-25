import React, { useEffect, useState } from "react";
import { 
  Target, 
  AlertCircle, 
  Award, 
  Compass, 
  Sparkles,
  ArrowRight,
  Zap,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Heart,
  Users,
  TrendingUp
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PAGE NOS MISSIONS ULTRA MODERNE - TEKACOM
 * Harmonisé avec Header/Footer + CTAs stratégiques
 */

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-[#a34ee5]/20 rounded-full"></div>
      <div className="absolute inset-2 border-4 border-[#fec603]/30 rounded-full animate-spin"></div>
      <div className="absolute inset-4 border-4 border-t-[#a34ee5] rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
      <div className="absolute inset-8 bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-full blur-md opacity-60"></div>
    </div>
    <span className="text-gray-300 text-lg mt-8 font-bold animate-pulse">Chargement...</span>
  </div>
);

const NosMissions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_VALEUR_MISSION_LIST);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const itemsData = Array.isArray(data) ? data : data.results || [];

        const activeItems = itemsData.filter((item) => item.is_active === true);
        setItems(activeItems);
      } catch (err) {
        console.error("Erreur API Valeurs & Missions:", err);
        setError(err.message || "Une erreur est survenue lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7828a8]/10 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #a34ee5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 lg:px-12 border-b border-[#a34ee5]/20">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#a34ee5]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-[#fec603]/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>

        <div className="relative max-w-[1400px] mx-auto">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-gradient-to-r from-[#41124f]/60 to-[#0a0a0a]/60 backdrop-blur-xl border border-[#a34ee5]/40 rounded-full shadow-lg shadow-[#a34ee5]/20">
            <Sparkles className="w-4 h-4 text-[#fec603] animate-pulse" />
            <span className="text-sm font-bold text-[#a34ee5] uppercase tracking-wider">
              Notre ADN
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none">
            <span className="block text-white mb-2">Nos Valeurs</span>
            <span className="block bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent animate-gradient">
              & MISSIONS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 font-light max-w-3xl leading-relaxed mb-8">
            <span className="text-[#fec603] font-bold">Inspirer</span>
            {" • "}
            <span className="text-[#a34ee5] font-bold">Créer</span>
            {" • "}
            <span className="text-[#7828a8] font-bold">Impacter</span>
          </p>

          {/* Quick CTA */}
          <a
            href="/contacternous"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-bold text-lg rounded-xl shadow-2xl shadow-[#a34ee5]/50 hover:shadow-[#a34ee5]/80 transition-all duration-500 hover:scale-105 group"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Travaillons ensemble</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">

          {/* Loading */}
          {loading && <LoadingSpinner />}

          {/* Error */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-[#41124f]/20 backdrop-blur-xl rounded-3xl p-12 border border-red-500/30">
                <div className="absolute -inset-1 bg-red-500/20 blur-xl"></div>
                <div className="relative text-center">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Erreur de chargement</h3>
                  <p className="text-gray-400 mb-8">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && items.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-[#41124f]/20 backdrop-blur-xl rounded-3xl p-12 border border-[#a34ee5]/30">
                <div className="absolute -inset-1 bg-[#a34ee5]/10 blur-xl"></div>
                <div className="relative text-center">
                  <Compass className="w-16 h-16 text-[#a34ee5] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Aucune mission trouvée</h3>
                  <p className="text-gray-400">Nos valeurs et missions arrivent bientôt !</p>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          {!loading && !error && items.length > 0 && (
            <>
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  <span className="bg-gradient-to-r from-[#a34ee5] to-[#fec603] bg-clip-text text-transparent">
                    {items.length}
                  </span>{" "}
                  {items.length > 1 ? 'Piliers' : 'Pilier'} de notre excellence
                </h2>
                <p className="text-gray-400 text-lg">Les valeurs qui nous guident au quotidien</p>
              </div>

              {/* Items Grid */}
              <div className="space-y-12 md:space-y-16">
                {items.map((item, index) => (
                  <MissionCard 
                    key={item.id} 
                    item={item} 
                    index={index}
                  />
                ))}
              </div>

              {/* CTA Intermédiaire */}
              <div className="mt-20 relative">
                <div className="relative bg-gradient-to-r from-[#41124f]/40 via-[#a34ee5]/20 to-[#41124f]/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-[#a34ee5]/30 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#fec603]/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative text-center max-w-3xl mx-auto">
                    <Heart className="w-12 h-12 text-[#fec603] mx-auto mb-6" />
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                      Partagez-vous nos valeurs ?
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">
                      Rejoignez-nous dans cette aventure créative et donnons vie à vos projets
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a
                        href="/contacternous"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#a34ee5]/50"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Contactez-nous</span>
                      </a>
                      <a
                        href="tel:+224626741478"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#41124f]/60 border-2 border-[#a34ee5]/40 text-white font-bold rounded-xl hover:border-[#a34ee5]/80 transition-all"
                      >
                        <Phone className="w-5 h-5" />
                        <span>+224 626 74 14 78</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Final */}
      {!loading && !error && items.length > 0 && (
        <section className="relative py-20 md:py-28 px-6 lg:px-12 border-t border-[#a34ee5]/20">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#a34ee5]/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '6s' }}></div>
          
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-br from-[#a34ee5] to-[#7828a8] rounded-3xl shadow-2xl shadow-[#a34ee5]/50 animate-bounce" style={{ animationDuration: '3s' }}>
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="block text-white mb-2">Prêt à</span>
              <span className="block bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] bg-clip-text text-transparent">
                COLLABORER ?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-light mb-12 max-w-3xl mx-auto">
              Transformons ensemble vos{" "}
              <span className="text-[#fec603] font-bold">idées créatives</span>{" "}
              en{" "}
              <span className="text-[#a34ee5] font-bold">réalité visuelle</span>
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contacternous"
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-black text-lg rounded-2xl shadow-2xl shadow-[#a34ee5]/50 hover:shadow-[#a34ee5]/80 transition-all duration-500 hover:scale-110 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#fec603] to-[#a34ee5] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative">DÉMARRER UN PROJET</span>
                <ArrowRight className="relative w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>

              <a
                href="mailto:contact@tekacom.gn"
                className="inline-flex items-center gap-3 px-8 py-5 bg-[#41124f]/60 border-2 border-[#a34ee5]/40 text-white font-bold text-lg rounded-2xl hover:border-[#a34ee5]/80 hover:bg-[#41124f]/80 transition-all duration-300"
              >
                <Mail className="w-6 h-6" />
                <span>contact@tekacom.gn</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, text: "Équipe passionnée", color: "from-[#a34ee5] to-[#7828a8]" },
                { icon: TrendingUp, text: "+200 Projets", color: "from-[#fec603] to-[#a34ee5]" },
                { icon: CheckCircle, text: "Satisfaction garantie", color: "from-[#7828a8] to-[#a34ee5]" },
                { icon: Zap, text: "Réponse 24h", color: "from-[#a34ee5] to-[#fec603]" },
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 p-4 bg-[#41124f]/20 rounded-xl border border-[#a34ee5]/20 hover:border-[#a34ee5]/50 transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-gray-300 font-semibold text-center">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
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
      `}</style>
    </div>
  );
};

// Mission Card Component
const MissionCard = ({ item, index }) => {
  return (
    <article
      className="group relative"
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
    >
      <div className="relative bg-[#41124f]/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#a34ee5]/20 hover:border-[#a34ee5]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#a34ee5]/20">
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
        
        {/* Header avec titre */}
        <div className="relative p-8 md:p-10 border-b border-[#a34ee5]/20 bg-gradient-to-r from-[#41124f]/40 to-[#0a0a0a]/40">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#a34ee5] to-[#7828a8] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs text-[#fec603] font-bold uppercase tracking-wider">
                  Pilier #{String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#a34ee5] group-hover:to-[#fec603] group-hover:bg-clip-text transition-all mt-1">
                  {item.titre}
                </h2>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-gray-400 text-base md:text-lg leading-relaxed italic">
              "{item.description}"
            </p>
          )}
        </div>

        {/* Photo si disponible */}
        {item.photo && (
          <div className="relative p-8 md:p-10 bg-[#0a0a0a]/40">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#a34ee5]/20 bg-[#0a0a0a]" style={{ height: '400px' }}>
              <img
                src={item.photo}
                alt={item.titre}
                className="max-w-full max-h-full object-contain mx-auto p-4"
                onError={(e) => {
                  console.error("❌ Erreur chargement photo:", item.photo);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Grid Valeur + Mission */}
        <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Valeur */}
          <div className="relative bg-gradient-to-br from-[#a34ee5]/10 to-[#fec603]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#a34ee5]/30 hover:border-[#a34ee5]/60 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#a34ee5] to-[#fec603] rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#fec603]">
                Notre Valeur
              </h3>
            </div>
            
            <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {item.valeur}
            </p>
          </div>

          {/* Mission */}
          <div className="relative bg-gradient-to-br from-[#7828a8]/10 to-[#a34ee5]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#7828a8]/30 hover:border-[#7828a8]/60 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7828a8] to-[#a34ee5] rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#a34ee5]">
                Notre Mission
              </h3>
            </div>
            
            {/* Si la mission contient des lignes, afficher avec puces */}
            {item.mission.includes('\n') ? (
              <div className="space-y-3">
                {item.mission
                  .split('\n')
                  .filter(line => line.trim().length > 0)
                  .map((line, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-2 h-2 rounded-full bg-[#a34ee5]"></div>
                      </div>
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed flex-1">
                        {line.trim()}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {item.mission}
              </p>
            )}
          </div>
        </div>

        {/* CTA Box dans chaque card */}
        <div className="p-8 md:p-10 pt-0">
          <div className="bg-gradient-to-r from-[#a34ee5]/10 to-[#fec603]/10 rounded-2xl p-6 border border-[#a34ee5]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-[#fec603] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Intéressé par cette approche ?</h4>
                  <p className="text-gray-400 text-sm">Contactez-nous pour en discuter</p>
                </div>
              </div>
              <a
                href="/contacternous"
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nous contacter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a34ee5] via-[#fec603] to-[#7828a8] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </article>
  );
};

export default NosMissions;