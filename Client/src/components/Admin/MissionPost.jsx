import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Target, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight, Check, Sparkles,
  Archive, Clock, Award, Compass, Image as ImageIcon
} from "lucide-react";

/**
 * 🎨 MISSION V4 - GRID + FLOATING BAR
 * Style: Same as ServicePost
 * Charte: violet #a34ee5, or #fec603, violet foncé #7828a8, noir #0a0a0a
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
  const [selectedCards, setSelectedCards] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [useMockData, setUseMockData] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    valeur: "",
    mission: "",
    photo: null,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const NAVADMIN_HEIGHT = 80;
  const SCROLL_OFFSET = 20;

  const scrollToForm = () => {
    setTimeout(() => {
      window.scrollTo({ 
        top: NAVADMIN_HEIGHT + SCROLL_OFFSET,
        behavior: "smooth" 
      });
    }, 100);
  };

  const mockData = [
    {
      id: 1,
      titre: "Excellence & Innovation",
      description: "Notre engagement envers l'excellence",
      valeur: "Nous visons l'excellence dans tout ce que nous faisons et innovons constamment.",
      mission: "Fournir des solutions créatives de haute qualité qui dépassent les attentes.",
      photo: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_VALEUR_MISSION_LIST);
      if (!res.ok) {
        console.warn("API non disponible, utilisation des données mock");
        setItems(mockData);
        setUseMockData(true);
        setError("⚠️ Mode démo : API non disponible.");
        return;
      }
      const data = await res.json();
      setItems(data);
      setUseMockData(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setItems(mockData);
      setUseMockData(true);
      setError("⚠️ Mode démo : Impossible de contacter l'API.");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
      if (formData.photo && typeof formData.photo !== "string") {
        const uploadedUrl = await uploadToCloudinary(formData.photo);
        if (uploadedUrl) {
          photoToSend = uploadedUrl;
        } else {
          throw new Error("Erreur lors de l'upload de l'image");
        }
      } else if (formData.photo && typeof formData.photo === "string") {
        photoToSend = formData.photo;
      }

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

      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? CONFIG.API_VALEUR_MISSION_UPDATE(editingId) : CONFIG.API_VALEUR_MISSION_CREATE;

      const response = await fetch(url, { method, body: formDataToSend });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `Erreur ${response.status}`);
      }

      setSuccessMessage("✨ Succès !");
      resetForm();
      await fetchItems();
      setShowForm(false);
      setShowList(true);
    } catch (err) {
      console.error(err);
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
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    try {
      const res = await fetch(CONFIG.API_VALEUR_MISSION_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("✨ Supprimé !");
      await fetchItems();
      setSelectedItem(null);
      setSelectedCards([]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const toggleCardSelection = (id) => {
    setSelectedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) return;
    if (!window.confirm(`Supprimer ${selectedCards.length} élément(s) ?`)) return;

    for (const id of selectedCards) {
      try {
        await fetch(CONFIG.API_VALEUR_MISSION_DELETE(id), { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    }
    
    setSuccessMessage(`✨ ${selectedCards.length} élément(s) supprimé(s) !`);
    setSelectedCards([]);
    await fetchItems();
  };

  const filteredItems = items.filter(item => {
    if (filterStatus === 'active') return item.is_active;
    if (filterStatus === 'inactive') return !item.is_active;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#a34ee5]/30 border-t-[#fec603] rounded-full animate-spin"></div>
          <span className="text-gray-400 font-medium">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative pb-32">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a34ee5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fec603]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-6 py-8">
        
        {/* COMPACT HEADER */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#a34ee5] to-[#7828a8] rounded-2xl flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Valeurs & Missions</h1>
              <p className="text-xs text-gray-500">{filteredItems.length} élément{filteredItems.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filterStatus === 'all' ? 'bg-[#a34ee5] text-white' : 'bg-[#41124f]/30 text-gray-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${
                  filterStatus === 'active' ? 'bg-green-500 text-white' : 'bg-[#41124f]/30 text-gray-400 hover:text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                Actifs
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filterStatus === 'inactive' ? 'bg-gray-500 text-white' : 'bg-[#41124f]/30 text-gray-400 hover:text-white'
                }`}
              >
                Inactifs
              </button>
            </div>

            <button
              onClick={fetchItems}
              disabled={loading}
              className="p-3 bg-[#41124f]/40 hover:bg-[#41124f]/60 border border-[#a34ee5]/30 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-[#a34ee5] ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setShowList(false);
                resetForm();
                scrollToForm();
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] hover:from-[#7828a8] hover:to-[#a34ee5] text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden md:inline">Nouveau</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className={`mb-6 p-4 ${useMockData ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-2xl flex items-center gap-3`}>
            <div className={`flex-1 ${useMockData ? 'text-yellow-300' : 'text-red-300'} text-sm font-medium`}>{error}</div>
            <button onClick={() => setError(null)} className={useMockData ? 'text-yellow-400' : 'text-red-400'}><X size={18} /></button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3">
            <div className="flex-1 text-green-300 text-sm font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-400"><X size={18} /></button>
          </div>
        )}

        {/* DRAWER FORM */}
        {showForm && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => { setShowForm(false); setShowList(true); resetForm(); }}></div>
            <div className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-[#0a0a0a] border-l border-[#a34ee5]/20 z-50 overflow-y-auto animate-slide-in pt-20">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#a34ee5]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#a34ee5] to-[#fec603] rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white">{editingId ? "Modifier" : "Créer"}</h3>
                  </div>
                  <button type="button" onClick={() => { setShowForm(false); setShowList(true); resetForm(); }} className="p-2 bg-[#41124f]/40 hover:bg-[#41124f]/60 rounded-xl transition-all">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Titre *</label>
                  <input type="text" name="titre" value={formData.titre} onChange={handleChange} placeholder="Excellence & Innovation" className="w-full px-4 py-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5]/60 transition-all" required />
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Courte description..." className="w-full px-4 py-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5]/60 transition-all resize-none"></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Award className="w-4 h-4" />Valeur *</label>
                  <textarea name="valeur" value={formData.valeur} onChange={handleChange} rows="4" placeholder="Décrivez la valeur..." className="w-full px-4 py-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5]/60 transition-all resize-none" required></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target className="w-4 h-4" />Mission *</label>
                  <textarea name="mission" value={formData.mission} onChange={handleChange} rows="4" placeholder="Décrivez la mission..." className="w-full px-4 py-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#a34ee5]/60 transition-all resize-none" required></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Photo</label>
                  {photoPreview ? (
                    <div className="relative group rounded-xl overflow-hidden">
                      <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                      <button type="button" onClick={() => { setPhotoPreview(null); setFormData({ ...formData, photo: null }); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="block h-48 border-2 border-dashed border-[#a34ee5]/30 rounded-xl hover:border-[#a34ee5]/60 cursor-pointer bg-[#41124f]/20 transition-all">
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-10 h-10 text-[#a34ee5]" />
                        <span className="text-sm text-gray-400">Cliquez pour ajouter</span>
                      </div>
                      <input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="mb-8">
                  <label className="flex items-center gap-3 p-4 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl cursor-pointer hover:border-[#a34ee5]/50 transition-all">
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 rounded accent-[#a34ee5]" />
                    <span className="font-bold text-white">Actif</span>
                    {formData.is_active && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="flex-1 px-6 py-4 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] hover:from-[#7828a8] hover:to-[#a34ee5] text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></> : <><Save className="w-5 h-5" /><span>{editingId ? "Mettre à jour" : "Créer"}</span></>}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* GRID */}
        {showList && (
          <>
            {loading ? (
              <div className="flex justify-center py-32">
                <div className="w-16 h-16 border-4 border-[#a34ee5]/30 border-t-[#fec603] rounded-full animate-spin"></div>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-20 h-20 bg-[#41124f]/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Compass className="w-10 h-10 text-[#a34ee5]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Aucun élément</h3>
                <p className="text-gray-500">Créez votre première valeur/mission</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentItems.map((item) => {
                    const isSelected = selectedCards.includes(item.id);
                    return (
                      <div key={item.id}>
                        <div className={`group relative bg-[#41124f]/20 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'border-[#fec603] shadow-xl shadow-[#fec603]/20' : 'border-[#a34ee5]/20 hover:border-[#a34ee5]/60'}`} onClick={() => toggleCardSelection(item.id)}>
                          <div className="relative h-64 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                            {item.photo ? (
                              <img src={item.photo} alt={item.titre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <Compass className="w-24 h-24 text-gray-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute top-3 left-3">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#fec603] border-[#fec603]' : 'bg-white/20 border-white/40 backdrop-blur-sm'}`}>
                                {isSelected && <Check className="w-4 h-4 text-[#0a0a0a]" />}
                              </div>
                            </div>
                            <div className="absolute top-3 right-3">
                              {item.is_active ? (
                                <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-500/90 backdrop-blur-sm text-white rounded-lg text-xs font-bold">
                                  <Archive className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-bold mb-1 line-clamp-1">{item.titre}</h3>
                            {item.description && <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>}
                            {item.created_at && (
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }} className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg text-sm font-bold transition-all">
                                <Eye size={14} className="mx-auto" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="flex-1 px-3 py-2 bg-[#a34ee5]/20 hover:bg-[#a34ee5]/30 backdrop-blur-sm border border-[#a34ee5]/40 text-white rounded-lg text-sm font-bold transition-all">
                                <Edit2 size={14} className="mx-auto" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/40 text-white rounded-lg transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-[#a34ee5] hover:bg-[#41124f]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-4 py-3 rounded-xl font-bold transition-all ${currentPage === pageNumber ? "bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white" : "bg-[#41124f]/40 border border-[#a34ee5]/30 text-gray-400 hover:text-white"}`}>
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl text-[#a34ee5] hover:bg-[#41124f]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* FLOATING BAR */}
      {selectedCards.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-[#0a0a0a] border-2 border-[#fec603] rounded-2xl shadow-2xl shadow-[#fec603]/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#fec603]/20 border border-[#fec603]/40 rounded-xl">
                <Check className="w-5 h-5 text-[#fec603]" />
                <span className="font-bold text-white">{selectedCards.length} sélectionné{selectedCards.length > 1 ? 's' : ''}</span>
              </div>
              <button onClick={handleBulkDelete} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Supprimer</span>
              </button>
              <button onClick={() => setSelectedCards([])} className="p-3 bg-[#41124f]/60 hover:bg-[#41124f] rounded-xl transition-all">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 z-[9999]" onClick={() => setSelectedItem(null)}>
          <div className="bg-[#0a0a0a] border border-[#a34ee5]/30 w-full max-w-4xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#a34ee5]/20 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">{selectedItem.titre}</h2>
              <button onClick={() => setSelectedItem(null)} className="p-2 bg-[#41124f]/40 hover:bg-[#41124f]/60 rounded-xl transition-all">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {selectedItem.description && (
                <div className="p-6 bg-[#41124f]/20 border border-[#a34ee5]/20 rounded-2xl">
                  <p className="text-gray-300 leading-relaxed">{selectedItem.description}</p>
                </div>
              )}
              {selectedItem.photo && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={selectedItem.photo} alt={selectedItem.titre} className="w-full h-64 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <div className="p-6 bg-[#41124f]/20 border border-[#a34ee5]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-[#fec603]" />
                  <h3 className="font-bold text-[#fec603] text-lg">Valeur</h3>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedItem.valeur}</p>
              </div>
              <div className="p-6 bg-[#41124f]/20 border border-[#a34ee5]/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-[#a34ee5]" />
                  <h3 className="font-bold text-[#a34ee5] text-lg">Mission</h3>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedItem.mission}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-up {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MissionPost;