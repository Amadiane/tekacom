import React, { useEffect, useState } from "react";
import { Handshake, ExternalLink, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-brand-purple/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-brand-purple rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-400 text-lg mt-6 font-medium">Chargement...</span>
  </div>
);

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setError(null);
        const response = await fetch(`${CONFIG.BASE_URL}/api/partners/`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const partnerData = Array.isArray(data) ? data : data.results || [];
        
        const activePartners = partnerData.filter(
          partner => partner.is_active === true || partner.isActive === true
        );
        
        setPartners(activePartners);
      } catch (error) {
        console.error("Erreur API partenaires:", error);
        setError(error.message || "Une erreur est survenue lors du chargement des partenaires");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handlePartnerClick = (websiteUrl) => {
    if (websiteUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-dark-200">
      {/* Hero Section - Dark Theme */}
      <section className="relative border-b border-brand-purple/20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple-dark/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-brand-purple/10 backdrop-blur-sm border border-brand-purple/30 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-brand-purple">
              Collaboration & Expertise
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
            <span className="text-gradient">
              {t("partner.title")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl">
            {t("partner.subtitle.part1")}{" "}
            <span className="text-brand-gold font-semibold">{t("partner.subtitle.club")}</span>{" "}
            {t("partner.subtitle.part2")}
          </p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-dark-100/60 backdrop-blur-xl rounded-2xl p-12 border border-red-500/30">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Erreur de chargement
                </h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && partners.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-dark-100/60 backdrop-blur-xl rounded-2xl p-12 border border-brand-purple/20">
                <Handshake className="w-16 h-16 text-brand-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t("partner.no_partners_title")}
                </h3>
                <p className="text-gray-400">
                  {t("partner.no_partners_text")}
                </p>
              </div>
            </div>
          )}

          {/* Partners Grid - Dark Theme */}
          {!loading && !error && partners.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {partners.map((partner) => {
                const partnerName = partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
                const partnerImage = partner.cover_image_url || partner.cover_image;
                
                return (
                  <div
                    key={partner.id}
                    onClick={() => handlePartnerClick(partner.website_url)}
                    className={`group ${partner.website_url ? 'cursor-pointer' : ''}`}
                    role={partner.website_url ? "button" : "article"}
                    tabIndex={partner.website_url ? 0 : undefined}
                    aria-label={partner.website_url ? `Visiter le site de ${partnerName}` : partnerName}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && partner.website_url) {
                        handlePartnerClick(partner.website_url);
                      }
                    }}
                  >
                    {/* Card Container - Dark Glassmorphism */}
                    <div className="relative bg-dark-100/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-brand-purple/20 hover:border-brand-purple/50 transition-all duration-300 hover:shadow-glow">
                      {/* Image Container */}
                      <div className="relative aspect-square p-6 bg-gradient-to-br from-dark-100/40 to-dark-200/40">
                        {partnerImage ? (
                          <img
                            src={partnerImage}
                            alt={`Logo ${partnerName}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              console.error("❌ Erreur chargement image:", partnerImage);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Handshake className={`w-20 h-20 text-brand-purple/40 mx-auto ${partnerImage ? 'hidden' : ''}`} />
                        
                        {/* Hover Overlay */}
                        {partner.website_url && (
                          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-100 border border-brand-purple/50 rounded-full p-2 shadow-glow">
                              <ExternalLink className="w-5 h-5 text-brand-purple" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Partner Name */}
                      <div className="px-4 py-3 bg-dark-100/40 border-t border-brand-purple/20 group-hover:bg-brand-purple/10 transition-colors duration-300">
                        <h3 className="text-center text-sm font-semibold text-gray-300 truncate group-hover:text-brand-purple transition-colors">
                          {partnerName}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Dark Purple Theme */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-100 via-brand-purple-deep/20 to-dark-100 overflow-hidden border-t border-brand-purple/20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple-dark/20 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-8 shadow-glow">
            <Handshake className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="text-gradient">REJOIGNEZ-NOUS</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Collaborez avec <span className="text-brand-gold font-bold">notre agence créative</span> et 
            participez à des projets innovants qui marquent les esprits.
          </p>

          {/* CTA Button */}
          <a
            href="/contacternous"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white font-bold text-lg rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            <span>DEVENIR PARTENAIRE</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </a>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>+50 Collaborations</span>
            </div>
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-brand-purple" />
              <span>Partenariats durables</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;