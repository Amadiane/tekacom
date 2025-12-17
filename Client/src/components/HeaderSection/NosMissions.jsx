import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement...</span>
  </div>
);

const NosMissions = () => {
  const { t, i18n } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
    return `${CONFIG.BASE_URL}/${url}`;
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_MISSION_LIST);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const missionData = Array.isArray(data) ? data : data.results || [];

        const activeMissions = missionData.filter(
          (mission) => mission.is_active === true || mission.isActive === true
        );

        const normalized = activeMissions.map((m) => ({
          ...m,
          image_url: normalizeUrl(m.image_url || m.image),
        }));

        setMissions(normalized);
      } catch (err) {
        console.error("Erreur API Missions:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des missions"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("missions.title", "NOS MISSIONS")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("missions.title2", "Découvrez notre engagement")}
          </p>
        </div>
      </section>

      {/* Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
        
        {loading && <LoadingSpinner />}

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

        {!loading && !error && missions.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t("missions.empty", "Aucune mission trouvée")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "missions.empty_desc",
                  "Revenez bientôt pour découvrir nos nouvelles missions"
                )}
              </p>
            </div>
          </div>
        )}

        {/* Liste */}
        {!loading && !error && missions.length > 0 && (
          <div className="space-y-24">
            {missions.map((mission) => {
              const missionContent =
                mission[`content_${i18n.language}`] ||
                mission.content_fr ||
                mission.content_en ||
                "";

              // === DÉCOUPAGE LEFT / RIGHT ===
              const parts = missionContent.split(/\[RIGHT\]/i);
              const leftPart = parts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
              const rightPart = parts[1]?.trim() || "";

              // Colonne gauche = un seul bloc
              const leftSentences = [leftPart];

              // Colonne droite = chaque ligne = un item
              const rightSentences = rightPart
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 2);

              return (
                <article key={mission.id} className="group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    
                    {/* Colonne gauche */}
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                        {leftPart}
                      </p>
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-5">
                      {rightSentences.map((sentence, idx) => {
                        const words = sentence.trim().split(" ");
                        const boldWords = words.slice(0, 2).join(" ");
                        const restOfSentence = words.slice(2).join(" ");

                        return (
                          <div key={idx} className="flex gap-4 items-start">
                            <div className="flex-shrink-0 mt-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed flex-1">
                              <span className="font-bold text-gray-900">
                                {boldWords}
                              </span>
                              {restOfSentence && ` ${restOfSentence}`}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default NosMissions;
