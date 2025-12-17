// import { useEffect, useState } from "react";
// import CONFIG from "../../config/config.js";
// import {
//   Factory,
//   Loader2,
//   Trash2,
//   PlusCircle,
//   Edit2,
//   X,
//   ExternalLink,
//   Sparkles,
//   Save,
//   RefreshCw,
//   List,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Image as ImageIcon
// } from "lucide-react";

// const PartnerPost = () => {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showList, setShowList] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedPartner, setSelectedPartner] = useState(null);
//   const [formData, setFormData] = useState({
//     name_fr: "",
//     name_en: "",
//     website_url: "",
//     cover_image: null,
//   });
//   const [preview, setPreview] = useState(null);

//   // PAGINATION
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // -----------------------------
//   // FETCH PARTNERS
//   // -----------------------------
//   const fetchPartners = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(CONFIG.API_PARTNER_LIST);
//       if (!res.ok) throw new Error("Erreur de chargement des partenaires");
//       const data = await res.json();
//       setPartners(data);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors du chargement des partenaires");
//     } finally {
//       setLoading(false);
//       setFetchLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   // -----------------------------
//   // CLOUDINARY UPLOAD
//   // -----------------------------
//   const uploadToCloudinary = async (file) => {
//     if (!file) return null;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
//         { method: "POST", body: formData }
//       );
//       const data = await res.json();
//       return data.secure_url;
//     } catch (err) {
//       console.error("Erreur upload Cloudinary:", err);
//       return null;
//     }
//   };

//   // -----------------------------
//   // HANDLE CHANGE
//   // -----------------------------
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       setPreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // -----------------------------
//   // RESET FORM
//   // -----------------------------
//   const resetForm = () => {
//     setFormData({
//       name_fr: "",
//       name_en: "",
//       website_url: "",
//       cover_image: null,
//     });
//     setPreview(null);
//     setEditingId(null);
//   };

//   // -----------------------------
//   // SUBMIT FORM
//   // -----------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       let imageUrl = null;
//       if (formData.cover_image) {
//         imageUrl = await uploadToCloudinary(formData.cover_image);
//       }

//       const payload = {
//         name_fr: formData.name_fr,
//         name_en: formData.name_en,
//         website_url: formData.website_url,
//         cover_image: imageUrl,
//       };

//       const url = editingId ? CONFIG.API_PARTNER_UPDATE(editingId) : CONFIG.API_PARTNER_CREATE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

//       setSuccessMessage(editingId ? "Partenaire mis à jour avec succès !" : "Partenaire ajouté avec succès !");
//       resetForm();
//       await fetchPartners();
//       setShowForm(false);
//       setShowList(true);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la sauvegarde");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------------
//   // DELETE PARTNER
//   // -----------------------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;

//     try {
//       const res = await fetch(CONFIG.API_PARTNER_DELETE(id), { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur de suppression");
//       setSuccessMessage("Partenaire supprimé avec succès !");
//       await fetchPartners();
//       setSelectedPartner(null);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la suppression");
//     }
//   };

//   // -----------------------------
//   // EDIT PARTNER
//   // -----------------------------
//   const handleEdit = (partner) => {
//     setEditingId(partner.id);
//     setFormData({
//       name_fr: partner.name_fr || "",
//       name_en: partner.name_en || "",
//       website_url: partner.website_url || "",
//       cover_image: null,
//     });
//     setPreview(partner.cover_image_url || null);
//     setShowForm(true);
//     setShowList(false);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
  

//   // -----------------------------
//   // PAGINATION LOGIC
//   // -----------------------------
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = partners.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(partners.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // -----------------------------
//   // LOADING STATE
//   // -----------------------------
//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex flex-col items-center justify-center">
//         <div className="relative w-20 h-20">
//           <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
//         </div>
//         <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des partenaires...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER AVEC DESIGN VIALI */}
//         <div className="relative mb-8">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-3xl rounded-3xl"></div>
          
//           <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/30 p-6 md:p-8 border-2 border-[#FDB71A]/30">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#FDB71A] to-[#E84E1B] opacity-30 blur-xl rounded-2xl animate-pulse"></div>
//                   <div className="relative w-16 h-16 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
//                     <Factory className="text-white w-8 h-8" />
//                   </div>
//                 </div>

//                 <div>
//                   <h1 className="text-3xl md:text-4xl font-black">
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
//                       Gestion des Partenaires
//                     </span>
//                   </h1>
//                   <p className="text-gray-600 font-medium mt-1">Industriels & Commerciaux</p>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => {
//                     fetchPartners();
//                   }}
//                   disabled={loading}
//                   className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
//                   Actualiser
//                 </button>

//                 <button
//                   onClick={() => {
//                     setShowForm(!showForm);
//                     if (!showForm) {
//                       resetForm();
//                       setShowList(false);
//                     } else {
//                       setShowList(true);
//                     }
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-400/50"
//                 >
//                   {showForm ? (
//                     <>
//                       <X className="w-5 h-5" />
//                       Fermer
//                     </>
//                   ) : (
//                     <>
//                       <PlusCircle className="w-5 h-5" />
//                       Nouveau Partenaire
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* MESSAGES */}
//         {error && (
//           <div className="relative bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300">
//             <div className="flex-1 text-red-700 font-medium">{error}</div>
//             <button onClick={() => setError(null)} className="text-gray-500 hover:text-gray-700">
//               <X size={18} />
//             </button>
//           </div>
//         )}

//         {successMessage && (
//           <div className="relative bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300">
//             <div className="flex-1 text-green-700 font-medium">{successMessage}</div>
//             <button onClick={() => setSuccessMessage(null)} className="text-gray-500 hover:text-gray-700">
//               <X size={18} />
//             </button>
//           </div>
//         )}

//         {/* FORMULAIRE AVEC ANIMATION */}
//         {showForm && (
//           <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/20 p-6 md:p-8 mb-10 border-2 border-[#FDB71A]/30 animate-in slide-in-from-top duration-500">
//             <form onSubmit={handleSubmit}>
//               {/* Badge du titre */}
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {editingId ? (
//                       <span className="flex items-center gap-2">
//                         <Edit2 className="w-6 h-6 text-[#F47920]" />
//                         Modifier le partenaire
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <Factory className="w-6 h-6 text-[#FDB71A]" />
//                         Nouveau partenaire
//                       </span>
//                     )}
//                   </h3>
//                 </div>
//               </div>

//               {/* Grille des champs - Noms */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <div className="space-y-2">
//                   <label className="font-bold text-gray-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
//                     Nom (FR) *
//                   </label>
//                   <input
//                     type="text"
//                     name="name_fr"
//                     value={formData.name_fr}
//                     onChange={handleChange}
//                     placeholder="Ex: Renault Maroc"
//                     className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="font-bold text-gray-700 flex items-center gap-2">
//                     <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
//                     Name (EN) *
//                   </label>
//                   <input
//                     type="text"
//                     name="name_en"
//                     value={formData.name_en}
//                     onChange={handleChange}
//                     placeholder="Ex: Renault Morocco"
//                     className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Site web */}
//               <div className="mb-6 space-y-2">
//                 <label className="font-bold text-gray-700 flex items-center gap-2">
//                   <ExternalLink className="w-4 h-4 text-[#E84E1B]" />
//                   Site web
//                 </label>
//                 <input
//                   type="url"
//                   name="website_url"
//                   value={formData.website_url}
//                   onChange={handleChange}
//                   placeholder="https://example.com"
//                   className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
//                 />
//               </div>

//               {/* Image upload */}
//               <div className="mb-6 space-y-3">
//                 <label className="font-bold text-gray-700 flex items-center gap-2">
//                   <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
//                   Logo du partenaire *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="file"
//                     name="cover_image"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="w-full p-3 border-2 border-dashed border-[#FDB71A] rounded-xl bg-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer"
//                   />
//                 </div>
//                 {preview && (
//                   <div className="flex justify-center mt-4">
//                     <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg w-48 h-48">
//                       <img
//                         src={preview}
//                         alt="Aperçu"
//                         className="w-full h-full object-contain"
//                       />
//                       <div className="absolute top-2 right-2">
//                         <Sparkles className="w-5 h-5 text-[#F47920]" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Boutons d'action */}
//               <div className="flex flex-wrap gap-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="relative group px-8 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-bold shadow-lg shadow-orange-400/50 hover:scale-105 hover:shadow-xl hover:shadow-orange-400/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="animate-spin w-5 h-5" />
//                       Enregistrement...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5" />
//                       {editingId ? "Mettre à jour" : "Créer le partenaire"}
//                     </>
//                   )}
//                 </button>

//                 {editingId && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       resetForm();
//                       setShowForm(false);
//                       setShowList(true);
//                     }}
//                     className="px-8 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:scale-105 transition-all duration-300 flex items-center gap-2"
//                   >
//                     <X className="w-5 h-5" />
//                     Annuler
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         )}

//         {/* SECTION LISTE */}
//         {showList && (
//           <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/20 border-2 border-[#FDB71A]/30 overflow-hidden animate-in slide-in-from-bottom duration-500">
//             {/* En-tête de section */}
//             <div className="p-6 md:p-8">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
//                   <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <List className="w-6 h-6 text-[#F47920]" />
//                     Liste des partenaires
//                   </h3>
//                   <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-4 py-1 rounded-full font-bold text-sm">
//                     {partners.length}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Contenu de la liste */}
//             <div className="px-6 md:px-8 pb-6 md:pb-8">
//               {loading ? (
//                 <div className="text-center py-12">
//                   <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
//                   <p className="text-gray-600 font-medium">Chargement des partenaires...</p>
//                 </div>
//               ) : partners.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 bg-gradient-to-br from-[#FDB71A]/20 to-[#E84E1B]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <Factory className="w-10 h-10 text-[#F47920]" />
//                   </div>
//                   <p className="text-gray-500 font-medium text-lg">Aucun partenaire pour le moment</p>
//                   <p className="text-gray-400 text-sm mt-2">Créez votre premier partenaire</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Grille des partenaires - Style NewsPost */}
//                   <div className="grid gap-6 mb-6">
//                     {currentItems.map((partner) => (
//                       <div
//                         key={partner.id}
//                         className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50"
//                       >
//                         <div className="flex flex-col md:flex-row gap-4 p-4">
//                           {/* Image */}
//                           {partner.cover_image_url && (
//                             <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
//                               <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 flex items-center justify-center p-4">
//                                 <img
//                                   src={partner.cover_image_url}
//                                   alt={partner.name_en}
//                                   className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
//                                 />
//                               </div>
//                             </div>
//                           )}

//                           {/* Contenu */}
//                           <div className="flex-1 flex flex-col justify-between">
//                             <div>
//                               <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
//                                 {partner.name_en}
//                               </h4>
//                               <p className="text-gray-600 text-sm leading-relaxed mb-2">
//                                 {partner.name_fr}
//                               </p>
//                               {partner.website_url && (
//                                 <a
//                                   href={partner.website_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   onClick={(e) => e.stopPropagation()}
//                                   className="text-xs text-[#F47920] flex items-center gap-1 hover:text-[#E84E1B] transition-colors"
//                                 >
//                                   <ExternalLink className="w-3 h-3" />
//                                   {partner.website_url}
//                                 </a>
//                               )}
//                             </div>

//                             {/* Boutons d'action */}
//                             <div className="flex flex-wrap gap-3 mt-4">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setSelectedPartner(partner);
//                                 }}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
//                               >
//                                 <Eye size={16} />
//                                 Voir
//                               </button>

//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleEdit(partner);
//                                   window.scrollTo({ top: 0, behavior: "smooth" });
//                                 }}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
//                               >
//                                 <Edit2 size={16} />
//                                 Modifier
//                               </button>

//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDelete(partner.id);
//                                 }}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
//                               >
//                                 <Trash2 size={16} />
//                                 Supprimer
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* PAGINATION */}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-center gap-2 pt-6 border-t-2 border-gray-200">
//                       <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="p-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                       >
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>

//                       {[...Array(totalPages)].map((_, index) => {
//                         const pageNumber = index + 1;
//                         return (
//                           <button
//                             key={pageNumber}
//                             onClick={() => handlePageChange(pageNumber)}
//                             className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
//                               currentPage === pageNumber
//                                 ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/50"
//                                 : "bg-white/70 backdrop-blur-md border-2 border-gray-200 text-gray-700 hover:scale-105"
//                             }`}
//                           >
//                             {pageNumber}
//                           </button>
//                         );
//                       })}

//                       <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                       >
//                         <ChevronRight className="w-5 h-5" />
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* MODAL DETAIL AVEC DESIGN MODERNE */}
//       {selectedPartner && (
//         <div 
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50 animate-in fade-in duration-200"
//           onClick={() => setSelectedPartner(null)}
//         >
//           <div 
//             className="relative bg-white/90 backdrop-blur-xl w-full max-w-3xl rounded-3xl shadow-2xl shadow-orange-400/40 overflow-hidden border-2 border-[#FDB71A]/30 animate-in zoom-in duration-300 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* En-tête du modal */}
//             <div className="relative bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6">
//               <button
//                 className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPartner(null);
//                 }}
//               >
//                 <X size={24} className="text-white" />
//               </button>

//               <h2 className="text-3xl font-black text-white pr-12 drop-shadow-lg">
//                 {selectedPartner.name_en}
//               </h2>

//               {selectedPartner.name_fr && (
//                 <p className="text-white/80 font-medium mt-2 italic">
//                   {selectedPartner.name_fr}
//                 </p>
//               )}
//             </div>

//             {/* Contenu du modal - scrollable */}
//             <div className="p-6 overflow-y-auto flex-1">
//               {/* Image du partenaire */}
//               <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-8 rounded-2xl mb-6 flex items-center justify-center min-h-[250px]">
//                 <img
//                   src={selectedPartner.cover_image_url}
//                   alt={selectedPartner.name_en}
//                   className="max-h-64 w-full object-contain"
//                 />
//               </div>

//               {/* Lien site web */}
//               {selectedPartner.website_url && (
//                 <a
//                   href={selectedPartner.website_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-[#F47920] font-bold mb-6 hover:text-[#E84E1B] transition-colors group bg-orange-50 p-4 rounded-xl"
//                 >
//                   <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
//                   <span>Visiter le site web du partenaire</span>
//                 </a>
//               )}
//             </div>

//             {/* Actions du modal */}
//             <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-6 flex flex-wrap justify-end gap-3 border-t-2 border-gray-200">
//               <button
//                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEdit(selectedPartner);
//                   setSelectedPartner(null);
//                 }}
//               >
//                 <Edit2 className="w-5 h-5" />
//                 Modifier
//               </button>

//               <button
//                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(selectedPartner.id);
//                 }}
//               >
//                 <Trash2 className="w-5 h-5" />
//                 Supprimer
//               </button>

//               <button
//                 className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:scale-105 transition-all duration-300"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedPartner(null);
//                 }}
//               >
//                 <X className="w-5 h-5" />
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PartnerPost;



import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Handshake,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  Loader2,
  RefreshCw,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Save,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";

const PartnerPost = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name_fr: "",
    name_en: "",
    description_fr: "",
    description_en: "",
    cover_image: null,
    website_url: "",
    is_active: true,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH PARTNERS
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/partners/`);
      const data = await res.json();
      console.log("📦 Partners data:", data); // Debug
      setPartners(data.results || data);
    } catch (error) {
      console.error("Erreur fetch partners:", error);
      setError("Erreur lors du chargement des partenaires");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // CLOUDINARY UPLOAD
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

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, cover_image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name_fr: "",
      name_en: "",
      description_fr: "",
      description_en: "",
      cover_image: null,
      website_url: "",
      is_active: true,
    });
    setPreview(null);
    setEditingId(null);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.cover_image && typeof formData.cover_image !== "string") {
        imageUrl = await uploadToCloudinary(formData.cover_image);
      } else if (typeof formData.cover_image === "string") {
        imageUrl = formData.cover_image;
      }

      const payload = {
        ...formData,
        cover_image: imageUrl,
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/partners/${editingId}/`
        : `${CONFIG.BASE_URL}/api/partners/`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage(editingId ? "Partenaire mis à jour avec succès !" : "Partenaire ajouté avec succès !");
      resetForm();
      await fetchPartners();
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

  // EDIT PARTNER
  const handleEdit = (partner) => {
    setFormData({
      name_fr: partner.name_fr,
      name_en: partner.name_en,
      description_fr: partner.description_fr || "",
      description_en: partner.description_en || "",
      website_url: partner.website_url,
      is_active: partner.is_active,
      cover_image: partner.cover_image,
    });

    setPreview(partner.cover_image_url || partner.cover_image);
    setEditingId(partner.id);

    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE PARTNER
  const deletePartner = async (partnerId) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/partners/${partnerId}/`, { method: "DELETE" });
      setSuccessMessage("Partenaire supprimé avec succès !");
      await fetchPartners();
      setSelectedPartner(null);
    } catch (error) {
      console.error("Erreur suppression:", error);
      setError("Erreur lors de la suppression");
    }
  };

  // TOGGLE ACTIVATION
  const handleToggleActive = async (partnerId, currentStatus) => {
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/partners/${partnerId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        setSuccessMessage(`Partenaire ${!currentStatus ? 'activé' : 'désactivé'} avec succès !`);
        await fetchPartners();
      }
    } catch (error) {
      console.error("Erreur changement statut:", error);
      setError("Erreur lors du changement de statut");
    }
  };

  // FETCH HISTORY
  const fetchHistory = async (partnerId) => {
    try {
      const url = CONFIG.API_PARTNER_HISTORY(partnerId);
      console.log("📍 Fetching history from:", url);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 404) {
          console.error("❌ 404: L'endpoint n'existe pas:", url);
          setHistory([]);
          setSelectedPartner(partners.find(p => p.id === partnerId));
          setError("L'endpoint d'historique retourne 404. Vérifiez l'URL Django et le paramètre dans urls.py");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("✅ History data received:", data);
      setHistory(Array.isArray(data) ? data : data.results || []);
      setSelectedPartner(partners.find(p => p.id === partnerId));
    } catch (error) {
      console.error("❌ Erreur fetch history:", error);
      setHistory([]);
      setSelectedPartner(partners.find(p => p.id === partnerId));
      setError("L'historique n'est pas disponible. Vérifiez que l'endpoint Django est configuré.");
    }
  };

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = partners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(partners.length / itemsPerPage);

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
          <p className="text-gray-600 font-medium">Chargement des partenaires...</p>
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
                    <Handshake className="text-white w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                    Gestion des Partenaires
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">Nos partenaires stratégiques</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchPartners}
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
                      Nouveau Partenaire
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
                  {editingId ? "Modifier le partenaire" : "Nouveau partenaire"}
                </h3>
              </div>

              {/* Grille des champs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">
                    Nom (FR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    placeholder="Ex: Entreprise Partenaire"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">
                    Name (EN)
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Ex: Partner Company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">
                    Description (FR)
                  </label>
                  <textarea
                    name="description_fr"
                    value={formData.description_fr}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Décrivez le partenariat..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white font-medium resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">
                    Description (EN)
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the partnership..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              {/* URL et Statut */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#E84E1B]" />
                    Site web
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#E84E1B] focus:ring-2 focus:ring-[#E84E1B]/20 transition-all bg-white font-medium"
                  />
                </div>

                <div className="space-y-2">
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
                          Partenaire actif
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Partenaire inactif
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo upload */}
              <div className="mb-6 space-y-3">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
                  Logo du partenaire
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer focus:border-[#F47920]"
                  />
                </div>
                {preview && (
                  <div className="flex justify-center mt-4">
                    <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-lg w-48 h-48">
                      <img
                        src={preview}
                        alt="Aperçu"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                )}
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
                      {editingId ? "Mettre à jour" : "Créer le partenaire"}
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

        {/* LISTE DES PARTENAIRES */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* En-tête */}
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste des partenaires
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {partners.length}
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
              ) : partners.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun partenaire pour le moment</p>
                  <p className="text-gray-400 text-sm mt-1">Créez votre premier partenaire</p>
                </div>
              ) : (
                <>
                  {/* Grille */}
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((partner) => {
                      // Debug pour voir ce que contient partner
                      console.log("🔍 Partner:", partner);
                      
                      return (
                        <div
                          key={partner.id}
                          className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50"
                        >
                          <div className="flex flex-col md:flex-row gap-4 p-4">
                            {/* Logo */}
                            <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
                              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
                                {partner.cover_image_url || partner.cover_image ? (
                                  <img
                                    src={partner.cover_image_url || partner.cover_image}
                                    alt={partner.name_fr || partner.display_name}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                      console.error("❌ Erreur chargement image:", partner.cover_image_url || partner.cover_image);
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <Handshake className={`w-24 h-24 text-gray-300 ${(partner.cover_image_url || partner.cover_image) ? 'hidden' : ''}`} />
                              </div>
                              {/* Badge actif/inactif */}
                              {partner.cover_image_url || partner.cover_image ? (
                                <div className="absolute top-2 right-2">
                                  {partner.is_active ? (
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
                              ) : null}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-xl font-black text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                                    {partner.name_fr || partner.display_name}
                                  </h4>
                                  {!partner.is_active && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                                      Masqué
                                    </span>
                                  )}
                                </div>
                                {partner.description_fr && (
                                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-2">
                                    {partner.description_fr}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {partner.website_url && (
                                    <a
                                      href={partner.website_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1 text-[#F47920] hover:text-[#E84E1B] transition-colors"
                                    >
                                      <Globe className="w-3 h-3" />
                                      Site web
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                  onClick={() => handleToggleActive(partner.id, partner.is_active)}
                                  className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg ${
                                    partner.is_active 
                                      ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                                      : 'bg-gradient-to-r from-green-500 to-green-600'
                                  }`}
                                >
                                  {partner.is_active ? (
                                    <>
                                      <X size={16} />
                                      Désactiver
                                    </>
                                  ) : (
                                    <>
                                      <Check size={16} />
                                      Activer
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => fetchHistory(partner.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                  <Calendar size={16} />
                                  Historique
                                </button>

                                <button
                                  onClick={() => {
                                    handleEdit(partner);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                  <Edit2 size={16} />
                                  Modifier
                                </button>

                                <button
                                  onClick={() => deletePartner(partner.id)}
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

      {/* MODAL HISTORIQUE */}
      {selectedPartner && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                onClick={() => setSelectedPartner(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <h2 className="text-2xl font-bold text-white pr-12 flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                Historique - {selectedPartner.name_fr || selectedPartner.display_name}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Suivi des modifications de statut
              </p>
            </div>

            {/* Contenu modal */}
            <div className="p-6 overflow-y-auto flex-1">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucune modification enregistrée</p>
                  <p className="text-gray-400 text-sm mt-1">L'historique apparaîtra ici</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {history.map((h) => (
                    <li
                      key={h.id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#FDB71A]/50 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${h.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="font-semibold text-gray-800">
                            {h.is_active ? "✓ Activé" : "⨯ Désactivé"}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm font-medium">
                          {new Date(h.changed_at).toLocaleString('fr-FR', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions modal */}
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setSelectedPartner(null)}
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

export default PartnerPost;