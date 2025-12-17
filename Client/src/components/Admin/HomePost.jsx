import React, { useState, useEffect } from "react";
import { Loader2, Trash2, PlusCircle, Edit2, X, AlertCircle, CheckCircle2, Save } from "lucide-react";
import CONFIG from "../../config/config.js";

// 🔶 Composants réutilisables
const GradientButton = ({ onClick, children, disabled = false, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-400/40 hover:shadow-xl hover:shadow-red-400/50",
    secondary: "bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Alert = ({ type, message, onClose }) => {
  const types = {
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertCircle },
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle2 },
  };
  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.text} border-2 ${config.border} p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des posts...</p>
  </div>
);

const HomePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    is_active: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 Récupération des posts
  const fetchPosts = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_HOME_GET);
      if (!res.ok) throw new Error("Erreur de chargement des posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des posts");
    } finally {
      setFetchLoading(false);
    }
  };

  // 🔹 Upload image sur Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // 🔹 Gestion du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", image: null, is_active: true });
    setPreview(null);
    setEditingId(null);
  };

  // 🔹 Création / mise à jour
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.image) imageUrl = await uploadToCloudinary(formData.image);

      const payload = {
        title: formData.title,
        content: formData.content,
        image: imageUrl, // doit correspondre au champ Django
        is_active: formData.is_active,
      };

      const url = editingId ? CONFIG.API_HOME_UPDATE(editingId) : CONFIG.API_HOME_CREATE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

      setSuccessMessage(editingId ? "Post mis à jour !" : "Post ajouté !");
      resetForm();
      fetchPosts();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Modifier un post
  const handleEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      image: null,
      is_active: post.is_active,
    });
    setPreview(post.image || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Supprimer un post
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post ?")) return;
    try {
      const res = await fetch(CONFIG.API_HOME_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Post supprimé !");
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des posts</h1>
        <GradientButton onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} className="flex items-center gap-2">
          {showForm ? <X size={18} /> : <PlusCircle size={18} />}
          {showForm ? "Fermer" : "Ajouter un post"}
        </GradientButton>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="mb-4">
            <label className="font-bold block mb-2">Titre *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-xl" />
          </div>
          <div className="mb-4">
            <label className="font-bold block mb-2">Contenu *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="4" className="w-full border-2 border-gray-300 p-3 rounded-xl"></textarea>
          </div>
          <div className="mb-4">
            <label className="font-bold block mb-2">Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {preview && <img src={preview} alt="Aperçu" className="mt-4 w-64 h-64 object-cover rounded-xl" />}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            <label className="font-bold">Post actif</label>
          </div>
          <div className="flex gap-4">
            <GradientButton onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{editingId ? "Mettre à jour" : "Ajouter"}</span>
            </GradientButton>
            <GradientButton onClick={() => { resetForm(); setShowForm(false); }} variant="secondary">Annuler</GradientButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow-md">
            {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-xl mb-4" />}
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-600">{post.content}</p>
            <div className="flex gap-2 mt-4">
              <GradientButton onClick={() => handleEdit(post)} variant="primary">Modifier</GradientButton>
              <GradientButton onClick={() => handleDelete(post.id)} variant="danger">Supprimer</GradientButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePost;
