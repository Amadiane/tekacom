import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { AlertCircle, Handshake, Camera, Target, Folder } from "lucide-react";

const Home = () => {
  const { i18n, t } = useTranslation();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper pour récupérer le champ selon la langue
  const getLocalized = (obj, field) => {
    if (!obj) return "";
    const lang = i18n.language || "fr";
    return obj[`${field}_${lang}`] || obj[`${field}_fr`] || obj[`${field}_en`] || "";
  };

  // Helper pour obtenir l'URL de l'image (gère _url ou Cloudinary)
  const getImageUrl = (obj, field) => {
    if (!obj) return null;

    // Priorité au champ xxx_url si présent (Partner, Team, Mission)
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
        if (!res.ok) throw new Error("Erreur API Home Full");
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
        <p className="text-white">{t("home.loading")}</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27] text-white">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" /> {error}
      </div>
    );

  // Destructuring des sections (avec fallback vide)
  const {
    home = {},
    partners = [],
    latest_team_members: team = [],
    latest_valeurs_missions: valeursMissions = [],
    services = [],
    portfolios = [],
  } = homeData || {};

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">

      {/* Home Section */}
      {home && (
        <section className="text-center py-20 px-4 bg-[#0f1729]/80">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{getLocalized(home, "title")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">{getLocalized(home, "description")}</p>
          {getImageUrl(home, "image") && (
            <div className="mt-8">
              <img src={getImageUrl(home, "image")} alt={getLocalized(home, "title")} className="mx-auto rounded-xl" />
            </div>
          )}
        </section>
      )}

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Handshake className="w-6 h-6" /> {t("home.partners")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((p) => (
              <div key={p.id} className="bg-[#0f1729]/80 p-4 rounded-xl flex items-center justify-center">
                {getImageUrl(p, "cover_image") ? (
                  <img src={getImageUrl(p, "cover_image")} alt={getLocalized(p, "name")} className="w-full h-auto object-contain" />
                ) : (
                  <span>{getLocalized(p, "name")}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Camera className="w-6 h-6" /> {t("home.team")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(m, "photo") && (
                  <img src={getImageUrl(m, "photo")} alt={m.full_name} className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold">{m.full_name}</h3>
                <p className="text-gray-400">{getLocalized(m, "position")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Valeurs & Missions Section */}
      {valeursMissions.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" /> {t("home.values_missions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valeursMissions.map((v) => (
              <div key={v.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(v, "photo") && (
                  <img src={getImageUrl(v, "photo")} alt={getLocalized(v, "titre")} className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold">{getLocalized(v, "titre")}</h3>
                <p className="text-gray-400">{getLocalized(v, "description")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" /> {t("home.services")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(s, "image") && (
                  <img src={getImageUrl(s, "image")} alt={getLocalized(s, "title")} className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold">{getLocalized(s, "title")}</h3>
                <p className="text-gray-400">{getLocalized(s, "description")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {portfolios.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Folder className="w-6 h-6" /> {t("home.portfolio")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <div key={p.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(p, "cover_photo") && (
                  <img src={getImageUrl(p, "cover_photo")} alt={getLocalized(p, "title")} className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold">{getLocalized(p, "title")}</h3>
                <p className="text-gray-400">{getLocalized(p, "description")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
