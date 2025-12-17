import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Mail, 
  CheckCircle, 
  Loader2, 
  X, 
  Send,
  Clock,
  Filter,
  Search,
  Users,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import CONFIG from "../../config/config.js";

// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientButton = ({ onClick, children, disabled = false, variant = "primary", className = "", type = "button" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-400/40 hover:shadow-xl hover:shadow-red-400/50",
    secondary: "bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50",
  };

  return (
    <button
      type={type}
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
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle,
    },
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
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement...</p>
  </div>
);

const ListeAbonnement = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Charger les abonnements
  const fetchAbonnements = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_NEWSLETTER_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setAbonnements(data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setError("Impossible de charger les abonnements");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAbonnements();
  }, []);

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet abonnement ?")) return;

    try {
      await fetch(CONFIG.API_NEWSLETTER_DELETE(id), { method: "DELETE" });
      setAbonnements(abonnements.filter((item) => item.id !== id));
      setSuccessMessage("Abonnement supprimé avec succès !");
    } catch (error) {
      console.error("Erreur suppression :", error);
      setError("Erreur lors de la suppression");
    }
  };

  // Répondre
  const handleReply = async () => {
    if (!replyMessage.trim()) {
      setError("Veuillez écrire un message.");
      return;
    }

    setReplyLoading(true);

    try {
      const res = await fetch(CONFIG.API_NEWSLETTER_REPLY(selectedAbonnement.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (res.ok) {
        setSuccessMessage("Réponse envoyée avec succès !");
        setSelectedAbonnement(null);
        setReplyMessage("");
        fetchAbonnements();
      } else {
        setError("Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setError("Erreur lors de l'envoi");
    }

    setReplyLoading(false);
  };

  // Filtrer et rechercher
  const filteredAbonnements = abonnements.filter((item) => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "replied" ? item.is_replied :
      filter === "pending" ? !item.is_replied :
      true;
    
    const matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAbonnements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbonnements = filteredAbonnements.slice(startIndex, endIndex);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Statistiques
  const stats = {
    total: abonnements.length,
    pending: abonnements.filter(a => !a.is_replied).length,
    replied: abonnements.filter(a => a.is_replied).length,
    confirmed: abonnements.filter(a => a.is_confirmed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Decorative background */}
      <div className="fixed top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/10 to-[#F47920]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/10 to-[#FDB71A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#F47920] blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-3 rounded-2xl shadow-xl shadow-orange-400/50">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                Gestion Newsletter
              </h1>
              <p className="text-gray-600 text-sm md:text-base font-medium">
                Gérez vos abonnés et répondez aux demandes
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-bold">Total</span>
              <Users className="w-5 h-5 text-[#F47920]" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-bold">En attente</span>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-bold">Répondus</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-green-600">{stats.replied}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-bold">Confirmés</span>
              <Mail className="w-5 h-5 text-[#F47920]" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#F47920]">{stats.confirmed}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-orange-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filtres */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              <button
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                Tous
              </button>

              <button
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === "pending"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("pending")}
              >
                En attente
              </button>

              <button
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filter === "replied"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("replied")}
              >
                Répondus
              </button>
            </div>

            {/* Recherche */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : currentAbonnements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-[#F47920]" />
              </div>
              <p className="text-gray-600 font-bold text-lg">Aucun abonnement trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-orange-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Confirmé
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Répondu
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {currentAbonnements.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-800">
                            #{item.id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 text-[#F47920]" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {item.email}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {new Date(item.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {item.is_confirmed ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                              <CheckCircle className="w-3 h-3" />
                              Confirmé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                              <XCircle className="w-3 h-3" />
                              Non confirmé
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {item.is_replied ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                              <CheckCircle className="w-3 h-3" />
                              Répondu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                              <Clock className="w-3 h-3" />
                              En attente
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedAbonnement(item)}
                              className="p-2 rounded-lg bg-gradient-to-br from-[#FDB71A]/10 to-[#F47920]/10 text-[#F47920] hover:from-[#FDB71A]/20 hover:to-[#F47920]/20 transition-colors"
                              title="Répondre"
                            >
                              <Mail className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-t-2 border-orange-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">
                    Page <span className="font-bold text-gray-800">{currentPage}</span> sur{" "}
                    <span className="font-bold text-gray-800">{totalPages}</span>
                    {" "}• Affichage de{" "}
                    <span className="font-bold text-gray-800">{startIndex + 1}</span>-
                    <span className="font-bold text-gray-800">{Math.min(endIndex, filteredAbonnements.length)}</span> sur{" "}
                    <span className="font-bold text-gray-800">{filteredAbonnements.length}</span> résultat(s)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border-2 border-orange-200 text-[#F47920] hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg font-bold text-sm transition-colors ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40"
                                : "bg-white border-2 border-orange-200 text-gray-700 hover:bg-orange-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="text-gray-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border-2 border-orange-200 text-[#F47920] hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODALE DE RÉPONSE */}
      {selectedAbonnement && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-2 border-orange-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Répondre à l'abonné</h2>
                  <p className="text-orange-100 text-sm">{selectedAbonnement.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAbonnement(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Votre message
              </label>
              <textarea
                className="w-full border-2 border-orange-200 rounded-xl p-4 h-40 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
              />

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <GradientButton
                  variant="secondary"
                  onClick={() => setSelectedAbonnement(null)}
                  className="flex-1 sm:flex-none"
                >
                  Annuler
                </GradientButton>

                <GradientButton
                  onClick={handleReply}
                  disabled={replyLoading || !replyMessage.trim()}
                  className="flex-1"
                >
                  {replyLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer la réponse
                    </>
                  )}
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeAbonnement;