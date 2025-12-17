// import React, { useState, useEffect } from "react";
// import { Loader2, Trash2, CheckCircle2, AlertCircle, Send, Mail, User, MessageSquare, Tag, Calendar, Sparkles } from "lucide-react";
// import CONFIG from "../../config/config.js";

// const Contacternous = () => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     category: "question",
//     message: "",
//   });

//   // Options de sujet basées sur la catégorie sélectionnée
//   const subjectOptions = {
//     commentaire: [
//       "Suggestion d'amélioration",
//       "Retour d'expérience",
//       "Témoignage",
//       "Autre commentaire"
//     ],
//     question: [
//       "Question sur les services",
//       "Question sur les tarifs",
//       "Question sur les délais",
//       "Autre question"
//     ],
//     support: [
//       "Problème technique",
//       "Bug signalé",
//       "Aide à l'utilisation",
//       "Autre problème"
//     ],
//     partenariat: [
//       "Proposition de collaboration",
//       "Demande de partenariat",
//       "Opportunité commerciale",
//       "Autre demande"
//     ]
//   };
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   //   useEffect(() => {
//   //   fetchContacts();
//   // }, []);

//   // 🔥 Scroll vers le haut au chargement
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);


//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(CONFIG.API_CONTACT_LIST);
//       if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
//       const data = await res.json();
//       setContacts(data);
//     } catch (err) {
//       console.error(err);
//       setError("Impossible de récupérer les contacts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Si la catégorie change, réinitialiser le sujet
//     if (name === "category") {
//       setFormData((prev) => ({ ...prev, [name]: value, subject: "" }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       const res = await fetch(CONFIG.API_CONTACT_CREATE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error("Erreur lors de l'envoi du message");
//       setSuccessMessage("Message envoyé avec succès !");

//        // 🔥 Remonter en haut quand le message est envoyé
//       window.scrollTo({ top: 0, behavior: "smooth" });

//       setFormData({
//         name: "",
//         email: "",
//         subject: "",
//         category: "question",
//         message: "",
//       });
//       fetchContacts();
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de l'envoi du message");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
//     try {
//       const res = await fetch(CONFIG.API_CONTACT_DELETE(id), { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur lors de la suppression");
//       setSuccessMessage("Message supprimé !");
//       fetchContacts();
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la suppression");
//     }
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/20">
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-3xl rounded-full animate-pulse"></div>
//         <Loader2 className="relative animate-spin w-16 h-16 text-[#F47920]" />
//       </div>
//       <p className="mt-6 text-gray-700 font-semibold">Chargement des messages...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/20 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* En-tête avec style Viali */}
//         <div className="text-center mb-12">
//           <div className="relative inline-block mb-4">
//             <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-30 blur-2xl rounded-full"></div>
//             <div className="relative flex items-center justify-center gap-3">
//               <Sparkles className="w-8 h-8 text-[#FDB71A] animate-pulse" />
//               <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
//                 CONTACTEZ-NOUS
//               </h1>
//               <Sparkles className="w-8 h-8 text-[#E84E1B] animate-pulse" />
//             </div>
//           </div>
//           <p className="text-gray-600 text-lg font-medium">Nous sommes là pour vous aider</p>
//         </div>

//         {/* Messages de notification */}
//         {error && (
//           <div className="bg-red-50/90 backdrop-blur-sm text-red-700 border-2 border-red-200 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-red-100">
//             <AlertCircle className="w-6 h-6 flex-shrink-0" />
//             <span className="font-medium">{error}</span>
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-50/90 backdrop-blur-sm text-green-700 border-2 border-green-200 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-green-100 animate-pulse">
//             <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
//             <span className="font-medium">{successMessage}</span>
//           </div>
//         )}

//         {/* Formulaire de contact moderne */}
//         <div className="bg-white/80 backdrop-blur-xl border-2 border-[#F47920]/20 rounded-3xl shadow-2xl shadow-orange-200/50 p-6 md:p-10 mb-12">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center shadow-lg">
//               <Send className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Contactez-nous</h2>
//               <p className="text-gray-600 text-sm mt-1">Une question ? Un projet ? Nous sommes à votre écoute !</p>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Nom */}
//               <div className="group">
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   <User className="inline w-4 h-4 mr-2 text-[#F47920]" />
//                   Nom complet
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Votre nom"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
//                 />
//               </div>

//               {/* Email */}
//               <div className="group">
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   <Mail className="inline w-4 h-4 mr-2 text-[#F47920]" />
//                   Adresse email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="votre.email@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
//                 />
//               </div>
//             </div>

//             {/* Catégorie */}
//             <div className="group">
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 <Tag className="inline w-4 h-4 mr-2 text-[#F47920]" />
//                 Catégorie
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white text-gray-900"
//               >
//                 <option value="question" className="text-gray-900">Questions générales</option>
//                 <option value="support" className="text-gray-900">Support technique</option>
//                 <option value="partenariat" className="text-gray-900">Partenariat</option>
//                 <option value="commentaire" className="text-gray-900">Commentaires et suggestions</option>
//               </select>
//             </div>

//             {/* Sujet (dynamique selon catégorie) */}
//            {/* Sujet */}
//             <div className="group">
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 <MessageSquare className="inline w-4 h-4 mr-2 text-[#F47920]" />
//                 Sujet
//               </label>
//               <input
//                 type="text"
//                 name="subject"
//                 placeholder="De quoi souhaitez-vous parler ?"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
//               />
//             </div>

//             {/* Message */}
//             <div className="group">
//               <label className="block text-sm font-bold text-gray-700 mb-2">
//                 <MessageSquare className="inline w-4 h-4 mr-2 text-[#F47920]" />
//                 Votre message
//               </label>
//               <textarea
//                 name="message"
//                 placeholder="Décrivez votre demande en détail..."
//                 value={formData.message}
//                 onChange={handleChange}
//                 rows="6"
//                 required
//                 className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none resize-none text-gray-900"
//               />
//             </div>

//             {/* Bouton d'envoi */}
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Envoi en cours...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   Envoyer le message
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contacternous;



import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, Send, Mail, User, MessageSquare, Tag, Sparkles } from "lucide-react";
import CONFIG from "../../config/config.js";
import { trackAction } from "../../utils/tracker"; // ✅ import tracker

const Contacternous = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "question",
    message: "",
  });

  useEffect(() => {
    fetchContacts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_LIST);
      if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subject: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);
  setSuccessMessage(null);

  try {
    const res = await fetch(CONFIG.API_CONTACT_CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi du message");

    setSuccessMessage("Message envoyé avec succès !");

    // 🔹 Tracker soumission formulaire
    trackAction({
      action_type: "contact_submit",
      page: "/contact",
      label: formData.subject || "Contact Form",
    });

    // 🔹 Tracker envoi mail (IMPORTANT)
    trackAction({
      action_type: "mail_sent",
      page: "/contact",
      label: formData.email,
      meta: { subject: formData.subject },
    });

    // Réinitialiser le formulaire
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "question",
      message: "",
    });

    fetchContacts();
    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (err) {
    console.error(err);
    setError("Erreur lors de l'envoi du message");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;

    try {
      const res = await fetch(CONFIG.API_CONTACT_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setSuccessMessage("Message supprimé !");
      
      // 🔹 Tracker suppression
      trackAction({
        action_type: "admin_action",
        page: "/contact",
        label: `Supprimé message ID: ${id}`,
      });

      fetchContacts();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-3xl rounded-full animate-pulse"></div>
        <Loader2 className="relative animate-spin w-16 h-16 text-[#F47920]" />
      </div>
      <p className="mt-6 text-gray-700 font-semibold">Chargement des messages...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-30 blur-2xl rounded-full"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-[#FDB71A] animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                CONTACTEZ-NOUS
              </h1>
              <Sparkles className="w-8 h-8 text-[#E84E1B] animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Nous sommes là pour vous aider</p>
        </div>

        {/* Messages d'erreur / succès */}
        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm text-red-700 border-2 border-red-200 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-red-100">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50/90 backdrop-blur-sm text-green-700 border-2 border-green-200 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-green-100 animate-pulse">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white/80 backdrop-blur-xl border-2 border-[#F47920]/20 rounded-3xl shadow-2xl shadow-orange-200/50 p-6 md:p-10 mb-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nom et Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2 text-[#F47920]" /> Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2 text-[#F47920]" /> Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="votre.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-2 text-[#F47920]" /> Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white text-gray-900"
              >
                <option value="question">Questions générales</option>
                <option value="support">Support technique</option>
                <option value="partenariat">Partenariat</option>
                <option value="commentaire">Commentaires et suggestions</option>
              </select>
            </div>

            {/* Sujet */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-2 text-[#F47920]" /> Sujet
              </label>
              <input
                type="text"
                name="subject"
                placeholder="De quoi souhaitez-vous parler ?"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none text-gray-900"
              />
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-2 text-[#F47920]" /> Votre message
              </label>
              <textarea
                name="message"
                placeholder="Décrivez votre demande en détail..."
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none resize-none text-gray-900"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacternous;
