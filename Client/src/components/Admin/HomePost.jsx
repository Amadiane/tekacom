import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
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

const HomePost = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedHome, setSelectedHome] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // -----------------------------
  // FETCH HOMES
  // -----------------------------
  const fetchHomes = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_HOME_LIST);
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setHomes(data);
        setError(null);
      } catch {
        throw new Error("Réponse non JSON : probablement mauvais endpoint ou backend non lancé");
      }
    } catch (err) {
      console.error("❌ fetchHomes error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
  const resetForm = () => {
    setFormData({ title: "", description: "", image: null });
    setPreview(null);
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
      let imageUrl = null;

      if (formData.image && typeof formData.image !== "string") {
        imageUrl = await uploadToCloudinary(formData.image);
      } else if (typeof formData.image === "string") {
        imageUrl = formData.image;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? CONFIG.API_HOME_UPDATE(editingId)
        : CONFIG.API_HOME_CREATE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage(editingId ? "Page mise à jour !" : "Page créée !");
      resetForm();
      await fetchHomes();
      setShowForm(false);
      setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE HOME
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette page ?")) return;

    try {
      const res = await fetch(CONFIG.API_HOME_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Page supprimée avec succès !");
      await fetchHomes();
      setSelectedHome(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // -----------------------------
  // EDIT HOME
  // -----------------------------
  const handleEdit = (home) => {
    setEditingId(home.id);
    setFormData({ title: home.title, description: home.description, image: home.image });
    setPreview(home.image);
    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // PAGINATION LOGIC
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = homes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(homes.length / itemsPerPage);

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
        <Loader2 className="w-12 h-12 text-[#F47920] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-gray-900">Gestion Home</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchHomes}
              className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2 hover:shadow"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              onClick={() => { setShowForm(!showForm); if(!showForm){resetForm(); setShowList(false);} else {setShowList(true);} }}
              className="px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl flex items-center gap-2 hover:shadow-lg"
            >
              {showForm ? <><X className="w-5 h-5" /> Fermer</> : <><PlusCircle className="w-5 h-5" /> Nouveau</>}
            </button>
          </div>
        </div>

        {/* ERROR / SUCCESS */}
        {error && <div className="bg-red-50 p-4 mb-4 rounded-xl flex justify-between items-center"><span>{error}</span><X onClick={() => setError(null)} className="cursor-pointer"/></div>}
        {successMessage && <div className="bg-green-50 p-4 mb-4 rounded-xl flex justify-between items-center"><span>{successMessage}</span><X onClick={() => setSuccessMessage(null)} className="cursor-pointer"/></div>}

        {/* FORM */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="font-semibold">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre"
                  className="w-full border px-4 py-2 rounded-xl"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Description"
                  className="w-full border px-4 py-2 rounded-xl"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full file:py-2 file:px-4 file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white rounded-xl border-2 border-dashed"
                />
                {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover mt-2 rounded-xl"/>}
              </div>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
                {editingId ? "Mettre à jour" : "Créer"}
              </button>
            </form>
          </div>
        )}

        {/* LISTE */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
            {homes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Aucune page</div>
            ) : (
              <div className="grid gap-6 p-6">
                {currentItems.map(home => (
                  <div key={home.id} className="flex gap-4 p-4 border rounded-xl shadow hover:shadow-lg">
                    <div className="w-48 h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                      {home.image ? <img src={home.image} alt={home.title} className="w-full h-full object-cover"/> : <span className="text-gray-400">Aucune image</span>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{home.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{home.description}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3"/>{new Date(home.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setSelectedHome(home)} className="px-3 py-1 bg-blue-500 text-white rounded-xl flex items-center gap-1"><Eye size={14}/> Voir</button>
                        <button onClick={() => handleEdit(home)} className="px-3 py-1 bg-orange-500 text-white rounded-xl flex items-center gap-1"><Edit2 size={14}/> Modifier</button>
                        <button onClick={() => handleDelete(home.id)} className="px-3 py-1 bg-red-500 text-white rounded-xl flex items-center gap-1"><Trash2 size={14}/> Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4">
                <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => handlePageChange(i+1)} className={`px-3 py-1 rounded ${currentPage===i+1?'bg-orange-500 text-white':'border'}`}>{i+1}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedHome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedHome(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">{selectedHome.title}</h2>
              <button onClick={() => setSelectedHome(null)}><X/></button>
            </div>
            {selectedHome.image && <img src={selectedHome.image} alt={selectedHome.title} className="w-full h-80 object-cover rounded-xl mb-4"/>}
            <p>{selectedHome.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePost;
