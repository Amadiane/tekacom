import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Target,
  Loader2,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Save,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Award,
  Compass,
  Image as ImageIcon
} from "lucide-react";

/**
 * 🎨 GESTION VALEURS & MISSIONS - TEKACOM
 * Design: Fond blanc + Gradient orange (identique à PartnerPost)
 */

const MissionPost = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    valeur: "",
    mission: "",
    photo: null,
    is_active: true,
  });

  // Preview pour la photo
  const [photoPreview, setPhotoPreview] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // MOCK DATA pour test
  const mockData = [
    {
      id: 1,
      titre: "Excellence & Innovation",
      description: "Notre engagement envers l'excellence et l'innovation continue",
      valeur: "Nous visons l'excellence dans tout ce que nous faisons et innovons constamment pour rester à la pointe.",
      mission: "Fournir des solutions créatives de haute qualité qui dépassent les attentes de nos clients.",
      photo: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      titre: "Collaboration & Impact",
      description: "Travailler ensemble pour un impact durable",
      valeur: "Nous croyons au pouvoir de la collaboration et cherchons à créer un impact positif durable.",
      mission: "Accompagner nos clients dans leur transformation digitale avec des solutions sur mesure.",
      photo: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // FETCH VALEURS & MISSIONS
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_VALEUR_MISSION_LIST);
      if (!res.ok) {
        console.warn("API non disponible, utilisation des données mock");
        setItems(mockData);
        setUseMockData(true);
        setError("⚠️ Mode démo : API non disponible. Données factices affichées.");
        return;
      }
      const data = await res.json();
      setItems(data);
      setUseMockData(false);
      setError(null);
    } catch (err) {
      console.error(err);
      console.warn("Erreur réseau, utilisation des données mock");
      setItems(mockData);
      setUseMockData(true);
      setError("⚠️ Mode démo : Impossible de contacter l'API. Données factices affichées.");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url || null;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      valeur: "",
      mission: "",
      photo: null,
      is_active: true,
    });
    setPhotoPreview(null);
    setEditingId(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccessMessage(null);

  try {
    let photoToSend = null;

    // 1️⃣ Gestion de la photo
    if (formData.photo && typeof formData.photo !== "string") {
      // Nouvelle image → upload Cloudinary
      const uploadedUrl = await uploadToCloudinary(formData.photo);
      if (uploadedUrl) {
        photoToSend = uploadedUrl;
      } else {
        throw new Error("Erreur lors de l'upload de l'image");
      }
    } else if (formData.photo && typeof formData.photo === "string") {
      // URL existante → on garde l'URL
      photoToSend = formData.photo;
    }

    // 2️⃣ Préparer FormData pour Django
    const formDataToSend = new FormData();
    formDataToSend.append("titre", formData.titre.trim());
    formDataToSend.append("valeur", formData.valeur.trim());
    formDataToSend.append("mission", formData.mission.trim());
    formDataToSend.append("is_active", formData.is_active);

    if (formData.description?.trim()) {
      formDataToSend.append("description", formData.description.trim());
    }

    if (photoToSend) {
      formDataToSend.append("photo_url", photoToSend);
    }

    // 3️⃣ Déterminer le endpoint et la méthode
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? CONFIG.API_VALEUR_MISSION_UPDATE(editingId)
      : CONFIG.API_VALEUR_MISSION_CREATE;

    // 4️⃣ Envoi au backend
    const response = await fetch(url, {
      method,
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `Erreur ${response.status}`);
    }

    // 5️⃣ Gestion du succès
    const responseData = await response.json();
    setSuccessMessage(editingId ? "Valeur/Mission mise à jour !" : "Valeur/Mission ajoutée !");
    resetForm();
    await fetchItems();
    setShowForm(false);
    setShowList(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("❌ handleSubmit:", err);
    setError(err.message || "Erreur lors de la sauvegarde");
  } finally {
    setLoading(false);
  }
};




  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      titre: item.titre,
      description: item.description || "",
      valeur: item.valeur,
      mission: item.mission,
      photo: item.photo || null,
      is_active: item.is_active,
    });
    setPhotoPreview(item.photo || null);
    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // LOADING STATE
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                    <Compass className="text-white w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
                    Valeurs & Missions
                    {useMockData && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-300">
                        MODE DÉMO
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">Inspirer • Créer • Impacter</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchItems}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>

                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                      resetForm();
                      setShowList(false);
                    } else {
                      setShowList(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {showForm ? (
                    <>
                      <X className="w-5 h-5" />
                      Fermer
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Nouveau
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className={`${useMockData ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-xl p-4 mb-6 flex items-center gap-3`}>
            <div className={`flex-1 ${useMockData ? 'text-yellow-700' : 'text-red-700'} font-medium`}>{error}</div>
            <button onClick={() => setError(null)} className={`${useMockData ? 'text-yellow-500 hover:text-yellow-700' : 'text-red-500 hover:text-red-700'}`}>
              <X size={18} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="flex-1 text-green-700 font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Modifier" : "Nouveau"}
                </h3>
              </div>

              {/* Titre */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Excellence & Innovation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Description (optionnelle)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Courte description ou résumé..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium resize-none"
                ></textarea>
              </div>

              {/* Valeur */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FDB71A]" />
                  Valeur <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="valeur"
                  value={formData.valeur}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Décrivez la valeur de l'entreprise..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white font-medium resize-none"
                  required
                ></textarea>
              </div>

              {/* Mission */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#F47920]" />
                  Mission <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Décrivez la mission associée..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium resize-none"
                  required
                ></textarea>
              </div>

              {/* Photo (optionnelle) */}
              <div className="mb-6 space-y-3">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  Photo illustrative (optionnelle)
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer focus:border-[#F47920]"
                />
                {photoPreview && (
                  <div className="flex justify-center">
                    <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg w-full max-w-md h-48">
                      <img
                        src={photoPreview}
                        alt="Aperçu"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {editingId && typeof formData.photo === "string" && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            Photo actuelle
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statut */}
              <div className="mb-6 space-y-3">
                <label className="font-semibold text-gray-700 text-sm">Statut de publication</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-[#FDB71A] cursor-pointer"
                  />
                  <label htmlFor="is_active" className="font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                    {formData.is_active ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Actif
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Inactif
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? "Mettre à jour" : "Créer"}
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                      setShowList(true);
                    }}
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {items.length}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Compass className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun élément pour le moment</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {useMockData ? "Configurez l'API pour ajouter des éléments" : "Créez votre première valeur/mission"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50 p-6"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-xl font-black text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                                {item.titre}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1 italic">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {item.is_active ? (
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-200">
                                  <Check className="w-3 h-3" />
                                  Actif
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold border border-gray-300">
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Photo si disponible */}
                          {item.photo && (
                            <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={item.photo}
                                alt={item.titre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Award className="w-4 h-4 text-[#FDB71A]" />
                                <h5 className="text-sm font-bold text-[#F47920]">Valeur</h5>
                              </div>
                              <p className="text-gray-700 text-sm line-clamp-3">
                                {item.valeur}
                              </p>
                            </div>

                            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-[#E84E1B]" />
                                <h5 className="text-sm font-bold text-[#E84E1B]">Mission</h5>
                              </div>
                              <p className="text-gray-700 text-sm line-clamp-3">
                                {item.mission}
                              </p>
                            </div>
                          </div>

                          {item.created_at && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Eye size={16} />
                              Voir
                            </button>

                            <button
                              onClick={() => {
                                handleEdit(item);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Edit2 size={16} />
                              Modifier
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Trash2 size={16} />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DÉTAIL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <h2 className="text-2xl font-bold text-white pr-12">
                {selectedItem.titre}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Description si disponible */}
              {selectedItem.description && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-blue-700 text-lg">Description</h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {/* Photo si disponible */}
              {selectedItem.photo && (
                <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <img
                    src={selectedItem.photo}
                    alt={selectedItem.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-[#FDB71A]" />
                  <h3 className="font-bold text-[#F47920] text-lg">Valeur</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.valeur}
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-[#E84E1B]" />
                  <h3 className="font-bold text-[#E84E1B] text-lg">Mission</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.mission}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2"
                onClick={() => {
                  handleEdit(selectedItem);
                  setSelectedItem(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                onClick={() => handleDelete(selectedItem.id)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>

              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPost;