import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import CONFIG from "../../config/config.js";

const NotreEquipe = () => {
  const { t, i18n } = useTranslation();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll vers le haut
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch Équipe - Filtrer uniquement les membres actifs
  useEffect(() => {
    const normalizeUrl = (url) => {
      if (!url) return null;
      if (url.startsWith("http")) return url;
      if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
      return `${CONFIG.BASE_URL}/${url}`;
    };

    const fetchEquipe = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_TEAM_LIST);
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        const teamData = Array.isArray(data) ? data : data.results || [];
        
        // ✅ Filtrer uniquement les membres actifs
        const activeMembres = teamData.filter(membre => membre.is_active === true);
        
        const normalized = activeMembres.map((m) => ({
          ...m,
          photo_url: normalizeUrl(m.photo_url || m.photo),
        }));
        
        setMembres(normalized);
      } catch (err) {
        console.error("Erreur API Équipe:", err);
        setError(err.message || "Une erreur est survenue lors du chargement de l'équipe");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Ultra Simple */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("team.title", "Notre Équipe")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {/* Les talents qui font notre entreprise */}
            {t("team.title2", "Notre Équipe")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-3">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">{t("team.loading", "Chargement...")}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && membres.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {t("team.no_members", "Aucun membre trouvé")}
            </h3>
            <p className="text-gray-500 text-lg">L'équipe sera bientôt disponible</p>
          </div>
        )}

        {/* Team Grid - Disposition 2-3-3 avec toutes les photos de même taille */}
        {!loading && !error && membres.length > 0 && (
          <div className="space-y-10 md:space-y-14 max-w-5xl mx-auto">
            {/* Ligne 1: 2 personnes - Parfaitement centrées */}
            {membres.slice(0, 2).length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                {membres.slice(0, 2).map((membre) => (
                  <article
                    key={membre.id}
                    className="group w-full md:w-[calc(33.333%-1.5rem)]"
                  >
                    <div className="relative mb-2 overflow-hidden rounded-3xl bg-gray-100 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50">
                      <img
                        src={
                          membre.photo_url ||
                          "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                        }
                        alt={membre.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="text-center">
                      {membre.linkedin ? (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-lg md:text-xl font-black text-gray-900 hover:text-[#F47920] transition-colors duration-300 mb-0.5"
                        >
                          {membre.full_name}
                        </a>
                      ) : (
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-0.5">
                          {membre.full_name}
                        </h3>
                      )}
                      
                      <p className="text-sm md:text-base text-gray-600 font-semibold">
                        {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Ligne 2: 3 personnes */}
            {membres.slice(2, 5).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {membres.slice(2, 5).map((membre) => (
                  <article
                    key={membre.id}
                    className="group"
                  >
                    <div className="relative mb-2 overflow-hidden rounded-3xl bg-gray-100 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50">
                      <img
                        src={
                          membre.photo_url ||
                          "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                        }
                        alt={membre.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="text-center">
                      {membre.linkedin ? (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-lg md:text-xl font-black text-gray-900 hover:text-[#F47920] transition-colors duration-300 mb-0.5"
                        >
                          {membre.full_name}
                        </a>
                      ) : (
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-0.5">
                          {membre.full_name}
                        </h3>
                      )}
                      
                      <p className="text-sm md:text-base text-gray-600 font-semibold">
                        {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Ligne 3: 3 personnes suivantes */}
            {membres.slice(5, 8).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {membres.slice(5, 8).map((membre) => (
                  <article
                    key={membre.id}
                    className="group"
                  >
                    <div className="relative mb-2 overflow-hidden rounded-3xl bg-gray-100 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50">
                      <img
                        src={
                          membre.photo_url ||
                          "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                        }
                        alt={membre.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="text-center">
                      {membre.linkedin ? (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-lg md:text-xl font-black text-gray-900 hover:text-[#F47920] transition-colors duration-300 mb-0.5"
                        >
                          {membre.full_name}
                        </a>
                      ) : (
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-0.5">
                          {membre.full_name}
                        </h3>
                      )}
                      
                      <p className="text-sm md:text-base text-gray-600 font-semibold">
                        {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Ligne 4: Membres supplémentaires s'il y en a plus de 8 */}
            {membres.slice(8).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
                {membres.slice(8).map((membre) => (
                  <article
                    key={membre.id}
                    className="group"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-3xl bg-gray-100 aspect-[3/4] shadow-lg">
                      <img
                        src={
                          membre.photo_url ||
                          "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                        }
                        alt={membre.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="text-center">
                      {membre.linkedin ? (
                        <a
                          href={membre.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-lg md:text-xl font-black text-gray-900 hover:text-[#F47920] transition-colors duration-300 mb-1"
                        >
                          {membre.full_name}
                        </a>
                      ) : (
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1">
                          {membre.full_name}
                        </h3>
                      )}
                      
                      <p className="text-sm md:text-base text-gray-600 font-semibold">
                        {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotreEquipe;