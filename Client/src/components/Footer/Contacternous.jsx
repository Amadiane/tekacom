import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail, User, MessageSquare, Tag, CheckCircle, AlertCircle, Loader } from "lucide-react";
import ChatBotNew from "../ChatBot/ChatbotNew";
import CONFIG from "../../config/config.js";

const Contacternous = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll vers le haut au chargement
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const apiUrl = CONFIG.API_CONTACT_CREATE; // point vers Django API Tekacom

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setResponseMessage(
          t("✅ Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.")
        );
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
      } else {
        const errorData = await res.json();
        setResponseMessage(
          errorData?.detail || t("❌ Une erreur est survenue lors de l'envoi du message.")
        );
      }
    } catch (error) {
      console.error("Erreur envoi :", error);
      setResponseMessage(
        t("⚠️ Erreur de connexion au serveur, veuillez réessayer plus tard.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess = responseMessage.includes("✅");
  const isError = responseMessage.includes("❌") || responseMessage.includes("⚠️");

  return (
    <div className="min-h-screen bg-[#0a0e27] w-full relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative">
        <div className="h-20 md:h-24"></div>
        <div className="pt-12 md:pt-20 pb-8 md:pb-12 px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3 tracking-tight">
            {t("Contactez-nous")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed px-4">
            {t("Nous sommes à votre écoute et vous répondrons dans les meilleurs délais. N'hésitez pas à nous faire part de vos questions ou commentaires.")}
          </p>
        </div>

        {/* Formulaire */}
        <div className="px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            {responseMessage && (
              <div className="mb-8">
                <div className={`p-4 rounded-xl ${isSuccess ? 'bg-green-500/20 border border-green-400' : 'bg-red-500/20 border border-red-400'}`}>
                  <div className="flex items-center gap-2">
                    {isSuccess ? <CheckCircle className="text-green-400" /> : <AlertCircle className="text-red-400" />}
                    <span className={`${isSuccess ? 'text-green-100' : 'text-red-100'}`}>{responseMessage}</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-400" /> {t("Nom complet")} <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500"
                    placeholder={t("Votre nom et prénom")}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" /> {t("Email")} <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500"
                    placeholder={t("votre.email@exemple.com")}
                  />
                </div>
              </div>

              {/* Sujet */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> {t("Sujet")} <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500"
                  placeholder={t("Objet de votre message")}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-400" /> {t("Catégorie")}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 text-white"
                >
                  <option value="general">{t("Question générale")}</option>
                  <option value="support">{t("Support technique")}</option>
                  <option value="partenariat">{t("Partenariat")}</option>
                  <option value="commentaire">{t("Commentaires et suggestions")}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" /> {t("Message")} <span className="text-orange-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 resize-none"
                  placeholder={t("Détaillez votre demande ici...")}
                />
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white ${
                  isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                }`}
              >
                {isSubmitting ? <Loader className="w-5 h-5 animate-spin inline-block mr-2" /> : <Send className="w-5 h-5 inline-block mr-2" />}
                {isSubmitting ? t("Envoi en cours...") : t("Envoyer le message")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBotNew />
      </div>
    </div>
  );
};

export default Contacternous;
