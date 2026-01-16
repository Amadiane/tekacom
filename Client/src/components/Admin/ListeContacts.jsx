import React, { useEffect, useState } from "react";
import { 
  Trash2, Mail, CheckCircle, Loader2, X, Send, Clock,
  Filter, Search, MessageSquare, XCircle, ChevronLeft, ChevronRight,
  AlertCircle, Eye, Tag, Calendar, Zap
} from "lucide-react";
import CONFIG from "../../config/config.js";

const ListeContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setContacts(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les contacts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce contact ?")) return;

    try {
      await fetch(CONFIG.API_CONTACT_DELETE(id), { method: "DELETE" });
      setContacts(contacts.filter((item) => item.id !== id));
      setSuccessMessage("✨ Supprimé !");
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la suppression");
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      setError("Veuillez écrire un message.");
      return;
    }
    setReplyLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_REPLY(selectedContact.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyMessage }),
      });

      if (res.ok) {
        setSuccessMessage("✨ Réponse envoyée !");
        setContacts(contacts.map(c => 
          c.id === selectedContact.id ? { ...c, is_replied: true } : c
        ));
        setSelectedContact(null);
        setReplyMessage("");
        setViewMode(null);
      } else {
        const errData = await res.json();
        setError(errData?.detail || "Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      setError("Erreur lors de l'envoi");
    }
    setReplyLoading(false);
  };

  const filteredContacts = contacts.filter((item) => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "replied" ? item.is_replied :
      filter === "pending" ? !item.is_replied :
      true;

    const matchesSearch = 
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  useEffect(() => setCurrentPage(1), [filter, searchTerm]);

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => !c.is_replied).length,
    replied: contacts.filter(c => c.is_replied).length,
  };

  const getCategoryConfig = (category) => {
    const configs = {
      general: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40", label: "Question générale" },
      support: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40", label: "Support technique" },
      partenariat: { bg: "bg-[#a34ee5]/20", text: "text-[#a34ee5]", border: "border-[#a34ee5]/40", label: "Partenariat" },
      commentaire: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/40", label: "Commentaire / Suggestion" },
    };
    return configs[category] || configs.general;
  };

  if (loading) {
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
    <div className="min-h-screen bg-[#0a0a0a] relative pb-16">
      {/* Background & Header omitted for brevity, reuse your existing design */}

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentContacts.map((item) => {
          const categoryConfig = getCategoryConfig(item.category);
          return (
            <div key={item.id} className="group relative bg-[#41124f]/20 backdrop-blur-xl border-2 border-[#a34ee5]/20 hover:border-[#a34ee5]/60 rounded-2xl overflow-hidden transition-all duration-300">
              
              {/* Header */}
              <div className="p-6 border-b border-[#a34ee5]/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a34ee5]/20 to-[#fec603]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[#a34ee5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-500">Message #{item.id}</p>
                      <p className="text-sm font-black text-white mt-1 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate">{item.email}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 line-clamp-2 mb-3">{item.subject || "Sans sujet"}</p>

                <div className="flex flex-wrap gap-2">
                  {item.category && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${categoryConfig.bg} ${categoryConfig.text} border ${categoryConfig.border}`}>
                      <Tag className="w-3 h-3" />
                      {categoryConfig.label}
                    </span>
                  )}
                  {item.is_replied ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold">
                      <CheckCircle className="w-3 h-3" /> Répondu
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
                      <Clock className="w-3 h-3" /> En attente
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-2">
                <button onClick={() => { setSelectedContact(item); setViewMode("view"); }} className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 rounded-xl font-bold flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> Voir</button>
                <button onClick={() => { setSelectedContact(item); setViewMode("reply"); setReplyMessage(""); }} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] hover:from-[#7828a5] hover:to-[#a34ee5] text-white rounded-xl font-bold flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Répondre</button>
                <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL VUE/RÉPONSE */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#a34ee5]/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative p-6 border-b border-[#a34ee5]/20 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">{viewMode === "view" ? "Détails du message" : "Répondre"}</h2>
              <button onClick={() => { setSelectedContact(null); setViewMode(null); }} className="p-2 bg-[#41124f]/40 hover:bg-[#41124f]/60 rounded-lg transition-all"><X className="w-6 h-6 text-white" /></button>
            </div>
            <div className="p-6">
              {viewMode === "view" ? (
                <div className="space-y-4">
                  <div className="bg-[#41124f]/40 border border-[#a34ee5]/30 p-4 rounded-xl"><p className="text-xs font-bold text-[#a34ee5] mb-1">EMAIL</p><p className="text-white font-medium">{selectedContact.email}</p></div>
                  <div className="bg-[#41124f]/40 border border-[#a34ee5]/30 p-4 rounded-xl"><p className="text-xs font-bold text-[#a34ee5] mb-1">SUJET</p><p className="text-white font-medium">{selectedContact.subject || "Sans sujet"}</p></div>
                  <div className="bg-[#41124f]/40 border border-[#a34ee5]/30 p-4 rounded-xl"><p className="text-xs font-bold text-[#a34ee5] mb-1">MESSAGE</p><p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p></div>
                  <button onClick={() => setViewMode("reply")} className="mt-4 px-6 py-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white rounded-xl font-bold flex items-center justify-center gap-2"><Send className="w-5 h-5" /> Répondre</button>
                </div>
              ) : (
                <>
                  <textarea className="w-full bg-[#41124f]/40 border border-[#a34ee5]/30 rounded-xl p-4 h-40 text-white placeholder-gray-600 resize-none" value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Écrivez votre réponse ici..." />
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => { setSelectedContact(null); setViewMode(null); }} className="flex-1 px-6 py-3 bg-[#41124f]/40 border border-[#a34ee5]/30 text-white rounded-xl font-bold">Annuler</button>
                    <button onClick={handleReply} disabled={replyLoading || !replyMessage.trim()} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {replyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Envoyer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeContacts;
