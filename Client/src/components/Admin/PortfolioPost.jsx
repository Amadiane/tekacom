import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Briefcase,
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
  Image as ImageIcon,
  Check,
  Calendar
} from "lucide-react";

/**
 * 🎨 GESTION PORTFOLIO - TEKACOM
 * 
 * Structure:
 * - title: Titre du projet (FR uniquement)
 * - description: Description (FR uniquement)
 * - cover_photo: Photo de couverture (obligatoire)
 * - image_1 à image_8: Images additionnelles (optionnelles)
 * - is_active: Statut actif/inactif
 * 
 * Charte graphique: Fond blanc + Gradient orange
 */

const PortfolioPost = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Previews pour toutes les images
  const [coverPreview, setCoverPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
    image_5: null,
    image_6: null,
    image_7: null,
    image_8: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_photo: null,
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
    image_5: null,
    image_6: null,
    image_7: null,
    image_8: null,
    is_active: true,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // -----------------------------
  // FETCH ITEMS
  // -----------------------------
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_PORTFOLIO_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement du portfolio");
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

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === "file" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      
      // Preview différent selon le champ
      const previewUrl = URL.createObjectURL(files[0]);
      if (name === "cover_photo") {
        setCoverPreview(previewUrl);
      } else {
        setImagePreviews({ ...imagePreviews, [name]: previewUrl });
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      cover_photo: null,
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      image_5: null,
      image_6: null,
      image_7: null,
      image_8: null,
      is_active: true,
    });
    setCoverPreview(null);
    setImagePreviews({
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      image_5: null,
      image_6: null,
      image_7: null,
      image_8: null,
    });
    setEditingId(null);
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Upload cover photo (obligatoire)
      let coverUrl = null;
      if (formData.cover_photo instanceof File) {
        coverUrl = await uploadToCloudinary(formData.cover_photo);
      } else if (typeof formData.cover_photo === "string") {
        coverUrl = formData.cover_photo;
      }

      if (!coverUrl) {
        throw new Error("La photo de couverture est obligatoire");
      }

      // Upload images additionnelles (optionnelles)
      const imageUrls = {};
      for (let i = 1; i <= 8; i++) {
        const fieldName = `image_${i}`;
        const image = formData[fieldName];
        
        if (image instanceof File) {
          imageUrls[fieldName] = await uploadToCloudinary(image);
        } else if (typeof image === "string" && image) {
          imageUrls[fieldName] = image;
        } else {
          imageUrls[fieldName] = null;
        }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        cover_photo: coverUrl,
        ...imageUrls,
        is_active: formData.is_active,
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? CONFIG.API_PORTFOLIO_UPDATE(editingId)
        : CONFIG.API_PORTFOLIO_CREATE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage(
        editingId 
          ? "Portfolio mis à jour avec succès !" 
          : "Portfolio créé avec succès !"
      );
      resetForm();
      await fetchItems();
      setShowForm(false);
      setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE ITEM
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

    try {
      const res = await fetch(CONFIG.API_PORTFOLIO_DELETE(id), { 
        method: "DELETE" 
      });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Projet supprimé avec succès !");
      await fetchItems();
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // -----------------------------
  // EDIT ITEM
  // -----------------------------
  const handleEdit = (item) => {
    setEditingId(item.id);
    
    const updatedFormData = {
      title: item.title || "",
      description: item.description || "",
      cover_photo: item.cover_photo || null,
      is_active: item.is_active ?? true,
    };

    // Charger les 8 images additionnelles
    const updatedPreviews = {};
    for (let i = 1; i <= 8; i++) {
      const fieldName = `image_${i}`;
      updatedFormData[fieldName] = item[fieldName] || null;
      updatedPreviews[fieldName] = item[fieldName] || null;
    }

    setFormData(updatedFormData);
    setCoverPreview(item.cover_photo);
    setImagePreviews(updatedPreviews);
    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // PAGINATION LOGIC
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement du portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER MODERNE */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="text-white w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                    Gestion du Portfolio
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">
                    Projets & Réalisations
                  </p>
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
                      Nouveau Projet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="flex-1 text-red-700 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
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
              
              {/* En-tête du formulaire */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Modifier le projet" : "Nouveau projet"}
                </h3>
              </div>

              {/* Titre */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Titre du projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Identité visuelle - Restaurant Le Gourmet"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Décrivez le projet, le client, les objectifs..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium resize-none"
                ></textarea>
              </div>

              {/* Photo de couverture (obligatoire) */}
              <div className="mb-6 space-y-3">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
                  Photo de couverture <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="cover_photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer focus:border-[#F47920]"
                  required={!editingId}
                />
                {coverPreview && (
                  <div className="flex justify-center">
                    <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-4 shadow-lg w-full max-w-md h-64">
                      <img
                        src={coverPreview}
                        alt="Couverture"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Couverture
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Images additionnelles (1 à 8) */}
              <div className="mb-6">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  Images additionnelles (jusqu'à 8 images)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const fieldName = `image_${num}`;
                    return (
                      <div key={num} className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">
                          Image {num}
                        </label>
                        <input
                          type="file"
                          name={fieldName}
                          accept="image/*"
                          onChange={handleChange}
                          className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                        />
                        {imagePreviews[fieldName] && (
                          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={imagePreviews[fieldName]}
                              alt={`Image ${num}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1">
                              <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                                {num}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statut */}
              <div className="mb-6 space-y-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Statut de publication
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded accent-[#FDB71A] cursor-pointer"
                  />
                  <label 
                    htmlFor="is_active" 
                    className="font-semibold text-gray-700 cursor-pointer flex items-center gap-2"
                  >
                    {formData.is_active ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Projet actif
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Projet inactif
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? "Mettre à jour" : "Créer le projet"}
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

        {/* LISTE DES PROJETS */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* En-tête */}
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste des projets
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {items.length}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun projet pour le moment</p>
                  <p className="text-gray-400 text-sm mt-1">Créez votre premier projet</p>
                </div>
              ) : (
                <>
                  {/* Grille */}
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((item) => {
                      // Compter les images additionnelles
                      const additionalImages = [1, 2, 3, 4, 5, 6, 7, 8].filter(
                        (num) => item[`image_${num}`]
                      ).length;

                      return (
                        <div
                          key={item.id}
                          className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50"
                        >
                          <div className="flex flex-col md:flex-row gap-4 p-4">
                            
                            {/* Image de couverture */}
                            <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                              {item.cover_photo ? (
                                <img
                                  src={item.cover_photo}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <Briefcase className={`${item.cover_photo ? 'hidden' : ''} w-16 h-16 text-gray-400`} />
                              
                              <div className="absolute top-2 right-2">
                                {item.is_active ? (
                                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                    <Check className="w-3 h-3" />
                                    Actif
                                  </span>
                                ) : (
                                  <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                                    Inactif
                                  </span>
                                )}
                              </div>
                              
                              {additionalImages > 0 && (
                                <div className="absolute bottom-2 left-2">
                                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                    <ImageIcon className="w-3 h-3" />
                                    +{additionalImages}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-xl font-black text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                                    {item.title}
                                  </h4>
                                  {!item.is_active && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                                      Masqué
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-2">
                                  {item.description || "Aucune description"}
                                </p>
                                
                                {item.created_at && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-3 mt-4">
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
                        </div>
                      );
                    })}
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
            className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <h2 className="text-2xl font-bold text-white pr-12">
                {selectedItem.title}
              </h2>
            </div>

            {/* Contenu modal */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Photo de couverture */}
              {selectedItem.cover_photo && (
                <div className="mb-6">
                  <img
                    src={selectedItem.cover_photo}
                    className="w-full h-96 object-cover rounded-xl"
                    alt={selectedItem.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Description */}
              {selectedItem.description && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {/* Images additionnelles */}
              {[1, 2, 3, 4, 5, 6, 7, 8].some((num) => selectedItem[`image_${num}`]) && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    Images du projet
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                      const imageUrl = selectedItem[`image_${num}`];
                      if (!imageUrl) return null;
                      
                      return (
                        <div key={num} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                          <img
                            src={imageUrl}
                            alt={`Image ${num}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              {num}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions modal */}
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

export default PortfolioPost;