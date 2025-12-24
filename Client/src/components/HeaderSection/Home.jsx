import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { AlertCircle, Handshake, Camera, Target, Folder } from "lucide-react";

const Home = () => {
  const { i18n, t } = useTranslation();
  const [home, setHome] = useState(null);
  const [partners, setPartners] = useState([]);
  const [team, setTeam] = useState([]);
  const [valeursMissions, setValeursMissions] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchHomeData = async () => {
      try {
        // Home
        const homeRes = await fetch(CONFIG.API_HOME_LATEST);
        if (!homeRes.ok) throw new Error("Erreur API Home Latest");
        const homeData = await homeRes.json();
        setHome(homeData);


        // Partners
        const partnersRes = await fetch(CONFIG.API_PARTNER_LIST);
        const partnersData = await partnersRes.json();
        setPartners(partnersData);

        // Team
        const teamRes = await fetch(CONFIG.API_TEAM_LIST);
        const teamData = await teamRes.json();
        setTeam(teamData);

        // Valeurs & Missions
        const vmRes = await fetch(CONFIG.API_VALEUR_MISSION_LIST);
        const vmData = await vmRes.json();
        setValeursMissions(vmData);

        // Services
        const serviceRes = await fetch(CONFIG.API_SERVICE_LIST);
        const serviceData = await serviceRes.json();
        setServices(serviceData);

        // Portfolio
        const portfolioRes = await fetch(CONFIG.API_PORTFOLIO_LIST);
        const portfolioData = await portfolioRes.json();
        setPortfolios(portfolioData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getLocalized = (obj, field) => {
    const lang = i18n.language || "fr";
    return obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || obj?.[`${field}_en`] || "";
  };

  const getImageUrl = (obj, field = "image") => {
    if (!obj) return null;
    const img = obj[field];
    if (!img) return null;
    return img.url || img; // si c’est un objet Cloudinary ou juste un lien
  };

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

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">

      {/* Home */}
      {home && (
        <section className="text-center py-20 px-4 bg-[#0f1729]/80">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{getLocalized(home, "title")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">{getLocalized(home, "description")}</p>
          {getImageUrl(home) && (
            <div className="mt-8">
              <img src={getImageUrl(home)} alt={getLocalized(home, "title")} className="mx-auto rounded-xl" />
            </div>
          )}
        </section>
      )}

      {/* Partenaires */}
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

      {/* Équipe */}
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

      {/* Valeurs & Missions */}
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

      {/* Services */}
      {services.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" /> {t("home.services")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(s) && (
                  <img src={getImageUrl(s)} alt={getLocalized(s, "title")} className="w-full h-48 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold">{getLocalized(s, "title")}</h3>
                <p className="text-gray-400">{getLocalized(s, "description")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Portfolio */}
      {portfolios.length > 0 && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Folder className="w-6 h-6" /> {t("home.portfolio")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <div key={p.id} className="bg-[#0f1729]/80 p-4 rounded-xl">
                {getImageUrl(p) && (
                  <img src={getImageUrl(p)} alt={getLocalized(p, "title")} className="w-full h-48 object-cover rounded-lg mb-2" />
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
