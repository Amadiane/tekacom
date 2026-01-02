import React, { useEffect, useState } from "react";
import { Target, Award, Compass, Sparkles, ArrowRight, MessageCircle, Heart, Zap, Phone, Mail, Users, TrendingUp, CheckCircle } from "lucide-react";
import CONFIG from "../../config/config.js";

/** Spinner */
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="w-24 h-24 border-4 border-[#a34ee5]/20 rounded-full relative animate-spin"></div>
    <span className="text-gray-300 text-lg mt-8 font-bold animate-pulse">Chargement...</span>
  </div>
);

/** Carte Mission */
const MissionCard = ({ item }) => {
  // LOGIQUE PHOTO inspirée de MissionPost
  const photoUrl = item.photo_url || item.photo || null;

  return (
    <div className="bg-[#41124f]/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#a34ee5]/20 hover:border-[#a34ee5]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#a34ee5]/20">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{item.titre}</h2>
        {item.description && <p className="text-gray-300 mb-3">{item.description}</p>}

        {/* Image */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={item.titre}
            className="w-full h-48 md:h-64 object-contain rounded-lg mb-3"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-48 md:h-64 bg-gray-700 flex items-center justify-center rounded-lg mb-3">
            <Compass className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Valeur & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-gradient-to-br from-[#a34ee5]/10 to-[#fec603]/10 rounded-lg border border-[#a34ee5]/30">
            <h3 className="text-[#fec603] font-bold mb-2">Notre Valeur</h3>
            <p className="text-gray-300">{item.valeur}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#7828a8]/10 to-[#a34ee5]/10 rounded-lg border border-[#7828a8]/30">
            <h3 className="text-[#a34ee5] font-bold mb-2">Notre Mission</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{item.mission}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Composant principal NosMissions */
const NosMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMissions = async () => {
    try {
      const res = await fetch(CONFIG.API_MISSION_LIST);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      const items = data.results || data;
      const activeItems = items.filter(item => item.is_active);
      setMissions(activeItems);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMissions(); }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="text-red-500 text-center mt-12">{error}</div>;

  if (missions.length === 0) return <div className="text-gray-400 text-center mt-12">Aucune mission trouvée</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {missions.map((m) => <MissionCard key={m.id} item={m} />)}
    </div>
  );
};

export default NosMissions;
