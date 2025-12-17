
import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";
import { 
  Loader, 
  AlertCircle, 
  Quote, 
  Calendar, 
  Play, 
  Users, 
  Handshake,
  ArrowRight,
  Newspaper,
  Trophy,
  Camera
} from "lucide-react";

const Home = () => {
  const { i18n, t } = useTranslation();
  const [homeFull, setHomeFull] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchHomeFull = async () => {
      try {
        const response = await fetch(`${CONFIG.BASE_URL}/api/home-full/`);
        if (!response.ok) throw new Error(t("home.error_api"));
        const data = await response.json();
        setHomeFull(data);
      } catch (err) {
        console.error("Erreur Home API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeFull();
  }, [t]);

  const getLocalized = (obj, field) => {
    const lang = i18n.language || "fr";
    return (
      obj?.[`${field}_${lang}`] ||
      obj?.[`${field}_fr`] ||
      obj?.[`${field}_en`] ||
      ""
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">{t("home.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border-2 border-red-500/50 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="font-bold text-xl">{t("home.error")}</p>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!homeFull) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <p className="text-white">{t("home.no_content")}</p>
      </div>
    );
  }

  const {
    home,
    latest_news,
    latest_videos,
    latest_matches,
    partners,
    latest_team_members,
    latest_missions,
    latest_valeurs,
    latest_mot_president
  } = homeFull;

  return (
    <div className="min-h-screen bg-[#0a0e27] w-full relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Compact - Style NosMissions */}
      <div className="relative pt-40 pb-8 text-center w-full">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-orange-500/30 to-blue-500/30 blur-3xl scale-150 animate-pulse"></div>
          
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3 tracking-tight">
              {home ? getLocalized(home, "title") : t("home.title")}
            </h1>
            
            <div className="relative w-24 h-1 mx-auto mt-4 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 animate-pulse"></div>
            </div>
            
            {home && (
              <p className="text-lg md:text-xl text-gray-300 font-medium mt-6 max-w-3xl mx-auto px-4">
                {getLocalized(home, "description")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Home Image - Format ajusté pour afficher l'image complète */}
      {home && home.image_url && (
        <div className="relative w-full px-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
              
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl">
                <img
                  src={home.image_url}
                  alt={getLocalized(home, "title")}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mot du Président - Format ajusté */}
      {latest_mot_president && latest_mot_president.length > 0 && (
        <div className="relative w-full py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
              
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl">
                <div className="relative">
                  {latest_mot_president[0].image_url && (
                    <>
                      <img
                        src={latest_mot_president[0].image_url}
                        alt={getLocalized(latest_mot_president[0], "title")}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-[#0f1729]/70 to-transparent"></div>
                    </>
                  )}
                  
                  <div className="absolute top-6 left-6 md:top-8 md:left-8">
                    <div className="inline-flex items-center gap-3 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 px-4 py-2 rounded-full">
                      <Quote className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-bold uppercase tracking-wide">
                        {t("home.president_message")}
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 md:left-12 right-8 md:right-12">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                      {getLocalized(latest_mot_president[0], "title")}
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-transparent rounded-full"></div>
                  </div>
                </div>

                <div className="p-6 md:p-8 lg:p-10">
                  <div className="max-w-4xl mx-auto">
                    <blockquote className="text-base md:text-lg lg:text-xl text-gray-300 font-medium leading-relaxed mb-6">
                      {getLocalized(latest_mot_president[0], "description")}
                    </blockquote>
                    
                    <div className="flex justify-end">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl blur opacity-20"></div>
                        <div className="relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 backdrop-blur-sm border-2 border-orange-500/30 rounded-xl p-4 text-right">
                          <p className="text-lg md:text-xl font-black text-white mb-1">
                            {latest_mot_president[0].president_name || t("home.president_name")}
                          </p>
                          <p className="text-orange-400 font-bold text-sm">
                            {t("home.president_role")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actualités Section - Espacement réduit */}
      {latest_news && latest_news.length > 0 && (
        <div className="relative py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
                <Newspaper className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white">
                  {t("home.latest_news")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full mt-2"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest_news.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-orange-500/30 hover:border-orange-500/60 transition-all shadow-xl">
                    {item.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={getLocalized(item, "title")}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] to-transparent"></div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {getLocalized(item, "title")}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                        {getLocalized(item, "description")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendrier Section - Espacement réduit */}
      {latest_matches && latest_matches.length > 0 && (
        <div className="relative py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-white">
                  {t("home.calendar")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full mt-2"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest_matches.map((match, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-blue-500/30 hover:border-blue-500/60 transition-all shadow-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                        <Trophy className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-xs font-bold uppercase">Match</span>
                      </div>
                      {match.match_date && (
                        <span className="text-gray-400 text-sm font-semibold">
                          {new Date(match.match_date).toLocaleDateString(i18n.language)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">
                      {match.home_team_name}
                    </h3>
                    {match.location && (
                      <p className="text-gray-300 text-sm">{match.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photos Section - Espacement réduit */}
      {latest_team_members && latest_team_members.length > 0 && (
        <div className="relative py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                <Camera className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-white">
                  {t("home.team")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full mt-2"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {latest_team_members.map((member, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/60 transition-all shadow-xl">
                    {member.photo_url && (
                      <div className="relative h-48 md:h-64 overflow-hidden">
                        <img
                          src={member.photo_url}
                          alt={getLocalized(member, "name")}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-transparent to-transparent"></div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-white mb-1">
                        {getLocalized(member, "name")}
                      </h3>
                      <p className="text-purple-400 text-sm font-semibold">
                        {getLocalized(member, "role")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vidéos Section - Espacement réduit */}
      {latest_videos && latest_videos.length > 0 && (
        <div className="relative py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white">
                  {t("home.videos")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-transparent rounded-full mt-2"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest_videos.map((video, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-red-500/30 hover:border-red-500/60 transition-all shadow-xl">
                    {video.cover_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={video.cover_image}
                          alt={getLocalized(video, "title")}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-all">
                          <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {getLocalized(video, "title")}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Partenaires Section - Espacement réduit */}
      {partners && partners.length > 0 && (
        <div className="relative py-8 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                <Handshake className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-white">
                  {t("home.partners")}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full mt-2"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-green-500/30 hover:border-green-500/60 transition-all shadow-xl p-6 flex items-center justify-center aspect-square">
                    {partner.cover_image_url ? (
                      <img
                        src={partner.cover_image_url}
                        alt={getLocalized(partner, "name")}
                        className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                      />
                    ) : (
                      <h3 className="text-base font-bold text-white text-center">
                        {getLocalized(partner, "name")}
                      </h3>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;