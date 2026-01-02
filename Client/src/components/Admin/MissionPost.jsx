import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import { Loader2, Trash2, PlusCircle, Edit2, X, Save, Check, Image as ImageIcon } from "lucide-react";

const MissionPost = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    valeur: "",
    mission: "",
    is_active: true,
    photo: null,
  });

  // 🔹 Récupération des missions
  const fetchMissions = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/missions/`);
      const data = await res.json();
      setMissions(data.results || data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des missions");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // 🔹 Upload Cloudinary
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

  // 🔹 Formulaire
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      valeur: "",
      mission: "",
      is_active: true,
      photo: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let photoUrl =
        formData.photo && typeof formData.photo !== "string"
          ? await uploadToCloudinary(formData.photo)
          : formData.photo;

      const payload = { ...formData, photo: photoUrl };
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/missions/${editingId}/`
        : `${CONFIG.BASE_URL}/api/missions/`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage("✨ Succès !");
      resetForm();
      await fetchMissions();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mission) => {
    setEditingId(mission.id);
    setFormData({
      titre: mission.titre,
      description: mission.description || "",
      valeur: mission.valeur || "",
      mission: mission.mission || "",
      is_active: mission.is_active,
      photo: mission.photo_url || mission.photo,
    });
    setPreview(mission.photo_url || mission.photo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette mission ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/missions/${id}/`, { method: "DELETE" });
      setSuccessMessage("✨ Supprimé !");
      await fetchMissions();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-white text-2xl mb-6 font-bold">Missions</h1>

      {/* Bouton créer */}
      <button
        onClick={() => { setShowForm(true); resetForm(); }}
        className="mb-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" /> Nouveau
      </button>

      {/* Formulaire */}
      {showForm && (
        <div className="mb-6 p-6 bg-gray-800 rounded-xl">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Titre"
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white"
            />
            <input
              type="text"
              name="valeur"
              value={formData.valeur}
              onChange={handleChange}
              placeholder="Valeur"
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white"
            />
            <input
              type="text"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              placeholder="Mission"
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Actif
            </label>
            <label className="block mb-4">
              <span className="text-white mb-2 block">Photo</span>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain mb-2"
                />
              )}
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              {editingId ? "Mettre à jour" : "Créer"}
            </button>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((m) => (
          <div key={m.id} className="bg-gray-800 rounded-xl p-4 relative">
            {m.photo_url ? (
              <img
                src={m.photo_url}
                alt={m.titre}
                className="w-full h-48 object-contain mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center mb-4">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            <h2 className="text-white font-bold">{m.titre}</h2>
            <p className="text-gray-300">{m.description}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(m)} className="text-blue-500 flex items-center gap-1">
                <Edit2 /> Edit
              </button>
              <button onClick={() => handleDelete(m.id)} className="text-red-500 flex items-center gap-1">
                <Trash2 /> Suppr
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
    </div>
  );
};

export default MissionPost;
