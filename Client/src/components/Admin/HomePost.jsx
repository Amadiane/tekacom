import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight,
  Image as ImageIcon, Check, Sparkles,
  Clock, Home as HomeIcon
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
  const [selectedCards, setSelectedCards] = useState([]);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null, // File ou URL
  });

  const fetchHomes = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_HOME_LIST);
      const data = await res.json();
      setHomes(data);
      setError(null);
    } catch (err) {
      setError("Erreur chargement");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  /* ================= CLOUDINARY ================= */

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    return data.secure_url;
  };

  /* ================= FORM ================= */

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", image: null });
    setPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        imageUrl = await uploadToCloudinary(formData.image);
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setSuccessMessage("✨ Succès !");
      resetForm();
      setShowForm(false);
      setShowList(true);
      fetchHomes();
    } catch {
      setError("Erreur sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (home) => {
    setEditingId(home.id);
    setFormData({
      title: home.title,
      description: home.description,
      image: home.image_url, // 🔑 IMPORTANT
    });
    setPreview(home.image_url);
    setShowForm(true);
    setShowList(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    await fetch(CONFIG.API_HOME_DELETE(id), { method: "DELETE" });
    fetchHomes();
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-white text-2xl font-black">Page d’accueil</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); setShowList(false); }}
          className="px-6 py-3 bg-purple-600 rounded-xl text-white flex gap-2"
        >
          <PlusCircle /> Nouveau
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl mb-8">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full p-3 mb-4 bg-gray-800 text-white rounded"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 mb-4 bg-gray-800 text-white rounded"
            required
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover mb-4 rounded"
            />
          )}

          <input type="file" name="image" onChange={handleChange} />

          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-green-600 rounded-xl text-white"
          >
            {editingId ? "Mettre à jour" : "Créer"}
          </button>
        </form>
      )}

      {/* GRID */}
      {showList && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homes.map((home) => (
            <div key={home.id} className="bg-gray-800 rounded-xl overflow-hidden">
              {home.image_url ? (
                <img
                  src={home.image_url}
                  className="h-48 w-full object-cover"
                  alt={home.title}
                />
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <HomeIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}

              <div className="p-4">
                <h3 className="text-white font-bold">{home.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {home.description}
                </p>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleEdit(home)} className="text-blue-400">
                    <Edit2 />
                  </button>
                  <button onClick={() => handleDelete(home.id)} className="text-red-400">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePost;
