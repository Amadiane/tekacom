import React, { useEffect, useState } from "react";
import { Handshake, ExternalLink, AlertCircle, ArrowRight } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement...</span>
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Style NotreEquipe */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("partner.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("partner.subtitle.part1")}{" "}
            <span className="text-orange-500">{t("partner.subtitle.club")}</span>{" "}
            {t("partner.subtitle.part2")}
          </p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-red-50 rounded-2xl p-12 border border-red-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && partners.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
                <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t("partner.no_partners_title")}
                </h3>
                <p className="text-gray-600">
                  {t("partner.no_partners_text")}
                </p>
              </div>
            </div>
          )}

          {/* Partners Grid - Ultra Modern Design */}
          {!loading && !error && partners.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {partners.map((partner) => {
                // Récupérer le nom du partenaire (même logique que PartnerPost)
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
                    {/* Card Container */}
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
                      {/* Image Container */}
                      <div className="relative aspect-square p-6 bg-gradient-to-br from-gray-50 to-white">
                        {partnerImage ? (
                          <img
                            src={partnerImage}
                            alt={`Logo ${partnerName}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              console.error("❌ Erreur chargement image:", partnerImage);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Handshake className={`w-20 h-20 text-gray-300 mx-auto ${partnerImage ? 'hidden' : ''}`} />
                        
                        {/* Hover Overlay */}
                        {partner.website_url && (
                          <div className="absolute inset-0 bg-orange-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2 shadow-lg">
                              <ExternalLink className="w-5 h-5 text-orange-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Partner Name - Clickable */}
                      <div className="px-4 py-3 bg-white border-t border-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                        <h3 className="text-center text-sm font-semibold text-gray-900 truncate group-hover:text-orange-500 transition-colors">
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

      {/* CTA Section - Modern & Stylish */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mb-8 shadow-xl shadow-orange-500/20">
            <Handshake className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            REJOIGNEZ NOS PARTENAIRES
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Soutenez <span className="text-orange-500 font-bold">VIALI</span> et participez à notre passion commune : 
            la fabrication de sardines et de thon de qualité.
          </p>

          {/* CTA Button */}
          <a
            href="/contacternous"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-lg rounded-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-500 hover:scale-105"
            style={{ backgroundSize: '200% 100%' }}
          >
            <span>DEVENIR PARTENAIRE</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partner;