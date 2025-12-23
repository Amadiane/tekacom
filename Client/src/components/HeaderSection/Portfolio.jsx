import React, { useEffect, useState } from "react";
import { Briefcase, AlertCircle, X, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";
import CONFIG from "../../config/config.js";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement du portfolio...</span>
  </div>
);

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch des projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_PORTFOLIO_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const projectData = Array.isArray(data) ? data : data.results || [];
        
        // Filter only active projects
        const activeProjects = projectData.filter(
          project => project.is_active === true
        );
        
        console.log(`💼 Total projects: ${projectData.length}, Active projects: ${activeProjects.length}`);
        
        setProjects(activeProjects);
      } catch (err) {
        console.error("Erreur API Portfolio:", err);
        setError(err.message || "Une erreur est survenue lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            NOTRE PORTFOLIO
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            Découvrez nos{" "}
            <span className="text-[#F47920]">projets et réalisations</span>
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-red-50 rounded-2xl p-12 border border-red-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucun projet disponible
                </h3>
                <p className="text-gray-600">
                  Nos projets arrivent bientôt. Revenez plus tard.
                </p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {projects.map((project) => {
                const projectImage = project.cover_photo;
                
                // Compter les images additionnelles
                const additionalImages = [1, 2, 3, 4, 5, 6, 7, 8].filter(
                  (num) => project[`image_${num}`]
                ).length;

                return (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="group cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Voir les détails de ${project.title}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleProjectClick(project);
                      }
                    }}
                  >
                    {/* Card Container */}
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#F47920]/30 transition-all duration-300 hover:shadow-xl">
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] p-8 bg-gradient-to-br from-gray-50 to-white">
                        {projectImage ? (
                          <img
                            src={projectImage}
                            alt={project.title || "Projet"}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              console.error("❌ Erreur chargement image:", projectImage);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Briefcase className={`w-24 h-24 text-gray-300 mx-auto ${projectImage ? 'hidden' : ''}`} />
                        
                        {/* Badge nombre d'images */}
                        {additionalImages > 0 && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                              <ImageIcon className="w-3.5 h-3.5" />
                              +{additionalImages}
                            </div>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#F47920] bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-4 shadow-lg">
                            <ChevronRight className="w-7 h-7 text-[#F47920]" />
                          </div>
                        </div>
                      </div>

                      {/* Project Name */}
                      <div className="px-5 py-4 bg-white border-t border-gray-100 group-hover:bg-orange-50 transition-colors duration-300">
                        <h3 className="text-center text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#F47920] transition-colors min-h-[3rem]">
                          {project.title || "Sans titre"}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!loading && !error && projects.length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl mb-8 shadow-xl shadow-orange-500/20">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              UN PROJET EN TÊTE ?
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Contactez <span className="text-[#F47920] font-bold">TEKACOM</span> pour donner vie à votre projet créatif
            </p>

            {/* CTA Button */}
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold text-lg rounded-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-500 hover:scale-105"
            >
              <span>NOUS CONTACTER</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </section>
      )}

      {/* MODAL DÉTAILS PROJET */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={handleCloseModal}
          style={{ top: 0 }}
        >
          <div
            className="relative bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-8 md:p-10">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-700/20 rounded-full blur-2xl"></div>
              
              <button
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-10"
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="relative">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white pr-16 mb-2 drop-shadow-lg">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 md:p-10 overflow-y-auto flex-1 bg-gradient-to-br from-white via-orange-50/20 to-white">
              
              {/* Photo de couverture */}
              {selectedProject.cover_photo && (
                <div className="mb-8">
                  <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-6">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F47920]/20 to-transparent rounded-bl-full"></div>
                    
                    <img
                      src={selectedProject.cover_photo}
                      className="relative w-full h-full object-contain drop-shadow-2xl"
                      alt={selectedProject.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedProject.description && (
                <div className="mb-8">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FDB71A] to-[#F47920] opacity-0 group-hover:opacity-20 blur-lg transition-opacity rounded-3xl"></div>
                    <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50/50 to-orange-50 p-6 md:p-8 rounded-3xl border-l-4 border-[#F47920] shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center shadow-lg">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-black text-gray-900 text-xl">
                          Description du projet
                        </h3>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Images additionnelles en galerie */}
              {[1, 2, 3, 4, 5, 6, 7, 8].some((num) => selectedProject[`image_${num}`]) && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#F47920] rounded-full"></div>
                    <h3 className="font-black text-gray-900 text-2xl flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-[#F47920]" />
                      Galerie du projet
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                      const imageUrl = selectedProject[`image_${num}`];
                      if (!imageUrl) return null;
                      
                      return (
                        <div 
                          key={num} 
                          className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group cursor-pointer hover:border-orange-400 transition-all duration-300"
                        >
                          <img
                            src={imageUrl}
                            alt={`${selectedProject.title} - Image ${num}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gray-100"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span className="text-white font-bold text-sm">Image {num}</span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              {num}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Information
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Vous aimez ce projet ? Contactez-nous pour discuter de votre propre projet.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="relative bg-gradient-to-r from-gray-50 to-orange-50/30 p-6 md:p-8 border-t-2 border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-[#F47920] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Projet réalisé par TEKACOM
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Démarrer un projet</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <button
                    className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
                    onClick={handleCloseModal}
                  >
                    <X className="w-5 h-5" />
                    <span>Fermer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;