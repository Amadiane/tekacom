import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, AlertCircle, Award, Compass } from "lucide-react";
import CONFIG from "../../config/config.js";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement...</span>
  </div>
);

const NosMissions = () => {
  const { t, i18n } = useTranslation();
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

        // Filtrer uniquement les éléments actifs
        const activeItems = itemsData.filter(
          (item) => item.is_active === true
        );

        setItems(activeItems);
      } catch (err) {
        console.error("Erreur API Valeurs & Missions:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-xl rounded-2xl"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                <Compass className="text-white w-8 h-8" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("missions.title", "NOS VALEURS & MISSIONS")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("missions.subtitle", "Inspirer • Créer • Impacter")}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
        
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
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
              <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t("missions.empty", "Aucune valeur/mission trouvée")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "missions.empty_desc",
                  "Revenez bientôt pour découvrir nos valeurs et missions"
                )}
              </p>
            </div>
          </div>
        )}

        {/* Liste des Valeurs & Missions */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-20">
            {items.map((item, index) => (
              <article 
                key={item.id} 
                className="group"
              >
                {/* Card avec bordure et ombre au hover */}
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/30 p-8 md:p-12">
                  
                  {/* Titre */}
                  <div className="mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-10 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                        {item.titre}
                      </h2>
                    </div>
                  </div>

                  {/* Grid 2 colonnes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Colonne gauche : Valeur */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 border border-orange-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center shadow-md">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[#F47920]">
                          Valeur
                        </h3>
                      </div>
                      
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {item.valeur}
                      </p>
                    </div>

                    {/* Colonne droite : Mission */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-red-100 hover:border-red-200 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E84E1B] to-[#F47920] rounded-xl flex items-center justify-center shadow-md">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[#E84E1B]">
                          Mission
                        </h3>
                      </div>
                      
                      {/* Si la mission contient des points/lignes, les afficher avec des puces */}
                      {item.mission.includes('\n') ? (
                        <div className="space-y-3">
                          {item.mission
                            .split('\n')
                            .filter(line => line.trim().length > 0)
                            .map((line, idx) => (
                              <div key={idx} className="flex gap-3 items-start">
                                <div className="flex-shrink-0 mt-2">
                                  <div className="w-2 h-2 rounded-full bg-[#E84E1B]"></div>
                                </div>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1">
                                  {line.trim()}
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                          {item.mission}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Numéro de l'item (optionnel) */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-medium">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    {item.created_at && (
                      <span className="text-sm text-gray-400 font-medium">
                        {new Date(item.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    )}
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Section Call-to-Action (optionnel) */}
      {!loading && !error && items.length > 0 && (
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                Prêt à collaborer avec nous ?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Découvrez comment nos valeurs et notre mission peuvent transformer votre projet
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
              >
                Contactez-nous
                <Target className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NosMissions;