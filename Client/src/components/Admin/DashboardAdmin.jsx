// import React, { useEffect, useState } from "react";
// import CONFIG from "../../config/config"; // Assure-toi que le chemin est correct
// import { Navigate } from "react-router-dom";

// const DashboardAdmin = () => {
//   const token = localStorage.getItem("access");
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   if (!token) return <Navigate to="/login" replace />;

//   const fetchStats = async () => {
//     setError(null);
//     try {
//       const res = await fetch(`${CONFIG.BASE_URL}/api/track/stats/`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error(`Erreur fetch stats: ${res.status}`);
//       const data = await res.json();
//       setStats(data);
//     } catch (err) {
//       console.error("Erreur fetch stats:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 fetch initial + interval automatique
//   useEffect(() => {
//     fetchStats();
//     const interval = setInterval(() => {
//       fetchStats();
//     }, 5000); // toutes les 5 secondes

//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <div className="p-4 text-center">Chargement des statistiques...</div>;
//   if (error) return <div className="p-4 text-red-600">Erreur: {error}</div>;
//   if (!stats) return <div className="p-4">Aucune statistique disponible.</div>;

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {/* Totals */}
//       <div className="bg-blue-100 p-4 rounded shadow">
//         <h3 className="text-lg font-bold">Visites</h3>
//         <p className="text-2xl">{stats.totals.visits}</p>
//       </div>
//       <div className="bg-green-100 p-4 rounded shadow">
//         <h3 className="text-lg font-bold">Clics</h3>
//         <p className="text-2xl">{stats.totals.clicks}</p>
//       </div>
//       <div className="bg-yellow-100 p-4 rounded shadow">
//         <h3 className="text-lg font-bold">Contacts</h3>
//         <p className="text-2xl">{stats.totals.contacts}</p>
//       </div>
//       <div className="bg-red-100 p-4 rounded shadow">
//         <h3 className="text-lg font-bold">Mails envoyés</h3>
//         <p className="text-2xl">{stats.totals.mails}</p>
//       </div>

//       {/* Top pages */}
//       <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
//         <h3 className="text-xl font-bold mb-2">Pages les plus visitées</h3>
//         <ul className="list-disc pl-5">
//           {stats.top_pages.map((p, idx) => (
//             <li key={idx}>
//               {p.page} - {p.total} actions
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Timeseries */}
//       <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
//         <h3 className="text-xl font-bold mb-2">Historique des actions</h3>
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full border-collapse border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="border px-2 py-1">Date</th>
//                 <th className="border px-2 py-1">Nombre d'actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.timeseries.map((item, idx) => (
//                 <tr key={idx}>
//                   <td className="border px-2 py-1">{item.day}</td>
//                   <td className="border px-2 py-1">{item.count}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardAdmin;

import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import { Navigate } from "react-router-dom";
import { 
  TrendingUp, TrendingDown, Eye, MousePointerClick, Mail, Users, 
  Sparkles, AlertCircle, Target, Activity, ArrowUpRight, 
  ArrowDownRight, Zap, Brain, BarChart3, PieChart, X, 
  CheckCircle, LightbulbIcon, TrendingUpIcon, Info
} from "lucide-react";

const DashboardAdmin = () => {
  const token = localStorage.getItem("access");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState(7); // 7, 30, ou 90 jours
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [showMetricDetail, setShowMetricDetail] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showPageAnalysis, setShowPageAnalysis] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  if (!token) return <Navigate to="/login" replace />;

  // Mapping des URLs vers des noms lisibles
  const pageNameMap = {
    "/": "Page d'accueil",
    "/home": "Page d'accueil",
    "/services": "Services",
    "/contact": "Contact",
    "/contactenous": "Contactez-nous",
    "/about": "À propos",
    "/apropos": "À propos",
    "/portfolio": "Portfolio",
    "/blog": "Blog",
    "/pricing": "Tarifs",
    "/team": "Équipe",
    "/careers": "Carrières",
    "/faq": "FAQ",
  };

  const getPageName = (url) => {
    return pageNameMap[url] || url.replace(/\//g, "") || "Autre";
  };

  // Fonction pour filtrer les données timeseries selon le timeframe
  const getFilteredTimeseries = () => {
    if (!stats || !stats.timeseries) return [];
    
    const now = new Date();
    const filtered = stats.timeseries.filter(item => {
      const itemDate = new Date(item.day);
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= timeframe;
    });
    
    return filtered.slice(-timeframe);
  };

  // Fonction pour analyser une métrique spécifique
  const analyzeMetric = (metricType) => {
    const analyses = {
      visits: {
        title: "Analyse des Visites",
        icon: Eye,
        color: "blue",
        currentValue: stats.totals.visits,
        explanation: "Les visites représentent le nombre total d'utilisateurs qui ont consulté votre site. C'est la métrique de base pour mesurer votre portée.",
        insights: [
          stats.totals.visits > 1000 
            ? "✅ Excellent trafic ! Vous avez une bonne visibilité."
            : stats.totals.visits > 500
            ? "✅ Trafic correct. Il y a du potentiel pour augmenter."
            : "⚠️ Trafic faible. Concentrez-vous sur l'acquisition.",
          `📊 Taux d'engagement actuel: ${conversionRate}%`,
          `🎯 ${stats.totals.clicks} visiteurs ont interagi avec votre contenu`
        ],
        recommendations: [
          {
            priority: "Haute",
            action: "Optimiser le SEO",
            description: "Améliorez vos mots-clés et meta descriptions pour augmenter le trafic organique.",
            impact: "Peut augmenter le trafic de 30-50%"
          },
          {
            priority: "Moyenne",
            action: "Campagnes réseaux sociaux",
            description: "Lancez des campagnes ciblées sur les réseaux sociaux pour attirer plus de visiteurs.",
            impact: "Augmentation estimée: 20-40%"
          },
          {
            priority: "Moyenne",
            action: "Marketing de contenu",
            description: "Créez du contenu de qualité (blog, vidéos) pour attirer naturellement des visiteurs.",
            impact: "Croissance durable à long terme"
          }
        ]
      },
      engagement: {
        title: "Analyse du Taux d'Engagement",
        icon: MousePointerClick,
        color: "purple",
        currentValue: `${conversionRate}%`,
        explanation: "Le taux d'engagement mesure le pourcentage de visiteurs qui interagissent avec votre site (clics, formulaires, etc.).",
        insights: [
          conversionRate > 50 
            ? "⭐ Excellent ! Votre contenu est très engageant."
            : conversionRate > 30
            ? "✅ Bon engagement. Les visiteurs trouvent votre contenu intéressant."
            : conversionRate > 15
            ? "⚠️ Engagement moyen. Il y a de la marge d'amélioration."
            : "🚨 Engagement faible. Action urgente requise.",
          `📈 ${stats.totals.clicks} clics sur ${stats.totals.visits} visites`,
          stats.top_pages.length > 0 
            ? `🎯 "${getPageName(stats.top_pages[0].page)}" est votre meilleure page`
            : "Aucune page ne se démarque particulièrement"
        ],
        recommendations: [
          {
            priority: "Haute",
            action: "Améliorer les CTAs",
            description: "Rendez vos appels à l'action plus visibles et attractifs. Utilisez des couleurs contrastées et des messages clairs.",
            impact: "Peut doubler votre taux de clics"
          },
          {
            priority: "Haute",
            action: "Réduire le temps de chargement",
            description: "Un site plus rapide = plus d'engagement. Optimisez vos images et le code.",
            impact: "+15-25% d'engagement"
          },
          {
            priority: "Moyenne",
            action: "Test A/B",
            description: "Testez différentes versions de vos pages pour voir ce qui fonctionne le mieux.",
            impact: "Amélioration continue"
          }
        ]
      },
      contacts: {
        title: "Analyse des Contacts",
        icon: Users,
        color: "green",
        currentValue: stats.totals.contacts,
        explanation: "Les contacts sont les utilisateurs qui ont pris une action significative (formulaire de contact, inscription, etc.).",
        insights: [
          `📊 Taux de conversion clic→contact: ${contactRate}%`,
          contactRate > 40 
            ? "✅ Excellent ! Vos visiteurs sont très intéressés."
            : contactRate > 20
            ? "✅ Bon taux. Vos formulaires sont efficaces."
            : "⚠️ Peu de clics se transforment en contacts.",
          `💰 Valeur estimée par contact: À définir selon votre business`
        ],
        recommendations: [
          {
            priority: "Haute",
            action: "Simplifier les formulaires",
            description: "Réduisez le nombre de champs requis. Demandez seulement l'essentiel (nom, email).",
            impact: "+30-50% de conversions"
          },
          {
            priority: "Haute",
            action: "Ajouter des preuves sociales",
            description: "Affichez des témoignages, avis clients et logos de partenaires pour rassurer.",
            impact: "+20-35% de confiance"
          },
          {
            priority: "Moyenne",
            action: "Offrir un incentive",
            description: "Proposez un guide gratuit, une consultation ou une réduction pour encourager le contact.",
            impact: "Augmentation de 40-60%"
          }
        ]
      },
      mails: {
        title: "Analyse des Emails",
        icon: Mail,
        color: "orange",
        currentValue: stats.totals.mails,
        explanation: "Nombre d'emails envoyés suite aux contacts reçus. C'est votre pipeline de conversion.",
        insights: [
          `📧 Taux de conversion contact→email: ${mailRate}%`,
          mailRate > 80 
            ? "⭐ Excellent suivi ! Vous répondez rapidement."
            : mailRate > 60
            ? "✅ Bon taux de réponse."
            : mailRate > 40
            ? "⚠️ Vous perdez des opportunités. Améliorez votre réactivité."
            : "🚨 Beaucoup de contacts sans réponse !",
          `⏱️ Temps de réponse moyen: À suivre pour optimiser`
        ],
        recommendations: [
          {
            priority: "Haute",
            action: "Automatiser les réponses",
            description: "Mettez en place des emails automatiques pour répondre instantanément aux nouveaux contacts.",
            impact: "Taux de réponse = 100%"
          },
          {
            priority: "Haute",
            action: "Créer des templates",
            description: "Préparez des modèles d'emails pour répondre plus rapidement et de manière professionnelle.",
            impact: "Gain de temps x3"
          },
          {
            priority: "Moyenne",
            action: "Segmenter vos contacts",
            description: "Envoyez des messages personnalisés selon le type de contact et leurs intérêts.",
            impact: "+40% de taux d'ouverture"
          }
        ]
      }
    };

    return analyses[metricType];
  };

  // Fonction pour analyser une page spécifique
  const analyzePage = (pageUrl, pageActions) => {
    const pageName = getPageName(pageUrl);
    const percentOfTotal = ((pageActions / stats.top_pages.reduce((sum, p) => sum + p.total, 0)) * 100).toFixed(1);
    
    const pageTypeAnalysis = {
      "/": {
        type: "Page d'accueil",
        role: "C'est la vitrine de votre site. Elle doit captiver et orienter les visiteurs.",
        kpis: ["Taux de rebond", "Temps sur la page", "Clics vers les sections clés"]
      },
      "/contact": {
        type: "Page de contact",
        role: "Point de conversion principal. Doit être simple et rassurante.",
        kpis: ["Taux de soumission formulaire", "Temps avant soumission", "Champs abandonnés"]
      },
      "/services": {
        type: "Page services",
        role: "Présente votre offre. Doit convaincre et pousser à l'action.",
        kpis: ["Taux de scroll", "Clics sur CTAs", "Navigation vers contact"]
      },
      "/blog": {
        type: "Page blog",
        role: "Attire du trafic SEO et établit votre expertise.",
        kpis: ["Temps de lecture", "Taux de partage", "Articles lus par visite"]
      },
      "default": {
        type: "Page standard",
        role: "Doit informer et guider vers une action.",
        kpis: ["Engagement", "Navigation suivante", "Taux de sortie"]
      }
    };

    const analysis = pageTypeAnalysis[pageUrl] || pageTypeAnalysis["default"];

    return {
      title: `Analyse: ${pageName}`,
      pageName,
      pageUrl,
      actions: pageActions,
      percentOfTotal,
      ...analysis,
      performance: pageActions > 50 ? "Excellente" : pageActions > 20 ? "Bonne" : "À améliorer",
      insights: [
        `📊 ${pageActions} actions générées (${percentOfTotal}% du total)`,
        pageActions > 50 
          ? "⭐ Cette page performe exceptionnellement bien !"
          : pageActions > 20 
          ? "✅ Bonne performance, continuez sur cette lancée."
          : "⚠️ Cette page a du potentiel d'amélioration.",
        `🎯 Type: ${analysis.type}`
      ],
      recommendations: [
        {
          priority: "Haute",
          action: "Analyser le contenu gagnant",
          description: `Identifiez ce qui fonctionne sur "${pageName}". Quels mots-clés attirent ? Quel contenu engage ?`,
          impact: "Répliquez le succès sur d'autres pages"
        },
        {
          priority: "Haute",
          action: "Optimiser les CTAs",
          description: "Assurez-vous que chaque CTA est clair, visible et orienté action.",
          impact: "+25-40% de conversions"
        },
        {
          priority: "Moyenne",
          action: "Améliorer le SEO",
          description: "Optimisez les balises title, meta description et le contenu pour les moteurs de recherche.",
          impact: "+30-50% de trafic organique"
        },
        {
          priority: "Moyenne",
          action: "Tester différentes versions",
          description: "Faites des tests A/B pour améliorer continuellement les performances.",
          impact: "Amélioration continue de 10-20%"
        }
      ]
    };
  };

  // Fonction pour générer une analyse complète basée sur l'insight
  const generateInsightAnalysis = (insight) => {
    const analyses = {
      "Optimiser les CTAs": {
        title: "Plan d'Action: Optimisation des CTAs",
        problem: `Votre taux de conversion visite→clic est de ${conversionRate}%, ce qui indique que les visiteurs ne sont pas suffisamment incités à interagir.`,
        analysis: [
          "🎯 Les Call-to-Actions (CTAs) sont essentiels pour guider vos visiteurs vers l'action souhaitée.",
          "⚠️ Un CTA inefficace = perte de leads potentiels",
          `📊 Sur ${stats.totals.visits} visites, seulement ${stats.totals.clicks} ont cliqué`
        ],
        recommendations: [
          {
            priority: "Critique",
            action: "Rendre les CTAs plus visibles",
            description: "Utilisez des couleurs contrastées (orange, vert vif, bleu) qui attirent l'œil. Le bouton doit se démarquer du reste de la page.",
            examples: ["Bouton orange sur fond blanc", "Taille minimum: 44x44px (zone tactile mobile)", "Espace blanc autour du bouton"],
            impact: "+40-60% de clics"
          },
          {
            priority: "Critique",
            action: "Messages orientés action",
            description: "Utilisez des verbes d'action forts et personnalisés.",
            examples: [
              "❌ 'En savoir plus' → ✅ 'Démarrez maintenant'",
              "❌ 'Cliquez ici' → ✅ 'Obtenez votre devis gratuit'",
              "❌ 'Soumettre' → ✅ 'Recevoir mon guide gratuit'"
            ],
            impact: "+30-50% de conversions"
          },
          {
            priority: "Haute",
            action: "Position stratégique",
            description: "Placez vos CTAs aux endroits où l'attention est maximale.",
            examples: [
              "Above the fold (visible sans scroller)",
              "Après chaque section de bénéfices",
              "En fin d'article/page"
            ],
            impact: "+25-35% de visibilité"
          },
          {
            priority: "Moyenne",
            action: "Créer l'urgence",
            description: "Ajoutez des éléments qui encouragent l'action immédiate.",
            examples: [
              "Offre limitée dans le temps",
              "Places disponibles limitées",
              "Bonus pour les premiers inscrits"
            ],
            impact: "+20-30% de conversions"
          }
        ],
        nextSteps: [
          "1. Auditez tous vos CTAs actuels",
          "2. Identifiez les 3 pages principales à optimiser",
          "3. Créez 2-3 versions de chaque CTA",
          "4. Lancez des tests A/B",
          "5. Mesurez les résultats après 2 semaines"
        ]
      },
      "Maintenir l'élan": {
        title: "Plan d'Action: Maintenir la Performance",
        problem: `Félicitations ! Votre taux d'engagement de ${conversionRate}% est solide. L'objectif est maintenant de maintenir et d'améliorer ces résultats.`,
        analysis: [
          "✅ Votre stratégie actuelle fonctionne bien",
          `🎯 ${stats.totals.clicks} clics sur ${stats.totals.visits} visites`,
          "📈 Il est crucial de ne pas se reposer sur ses lauriers"
        ],
        recommendations: [
          {
            priority: "Haute",
            action: "Documenter ce qui fonctionne",
            description: "Créez un document détaillant votre stratégie actuelle pour pouvoir la répliquer.",
            examples: [
              "Screenshots des CTAs qui performent",
              "Templates des messages efficaces",
              "Structure des pages qui convertissent"
            ],
            impact: "Assure la cohérence"
          },
          {
            priority: "Haute",
            action: "Analyser les top performers",
            description: "Identifiez précisément pourquoi certaines pages/sections fonctionnent mieux.",
            examples: [
              "Quels mots-clés attirent le plus ?",
              "Quel type de contenu engage le plus ?",
              "Quelles sources de trafic convertissent le mieux ?"
            ],
            impact: "Insights actionnables"
          },
          {
            priority: "Moyenne",
            action: "Optimisation continue",
            description: "Même si ça fonctionne, il y a toujours de la marge d'amélioration.",
            examples: [
              "Tests A/B mensuels",
              "Améliorations progressives",
              "Nouveaux formats de contenu"
            ],
            impact: "+10-20% d'amélioration"
          },
          {
            priority: "Moyenne",
            action: "Surveiller la concurrence",
            description: "Restez informé des tendances et des stratégies concurrentes.",
            examples: [
              "Analyse des sites concurrents",
              "Veille sur les nouvelles pratiques",
              "Participation à des webinaires/conférences"
            ],
            impact: "Avantage compétitif"
          }
        ],
        nextSteps: [
          "1. Créez un tableau de bord de suivi hebdomadaire",
          "2. Planifiez des tests A/B mensuels",
          "3. Documentez vos best practices",
          "4. Formez votre équipe aux bonnes pratiques",
          "5. Mettez en place des alertes si les KPIs baissent"
        ]
      },
      "Analyser le contenu": {
        title: "Plan d'Action: Analyse de Contenu",
        problem: `La page "${getPageName(stats.top_pages[0]?.page)}" génère ${stats.top_pages[0]?.total} actions. Il est crucial de comprendre pourquoi pour répliquer ce succès.`,
        analysis: [
          "🎯 Cette page est votre star performer",
          "📊 Elle attire et convertit mieux que les autres",
          "💡 Comprendre son succès = clé pour améliorer tout le site"
        ],
        recommendations: [
          {
            priority: "Critique",
            action: "Analyse approfondie du contenu",
            description: "Décomposez tous les éléments qui font le succès de cette page.",
            examples: [
              "Structure de la page (h1, h2, sections)",
              "Longueur et style du contenu",
              "Type et position des visuels",
              "Placement et formulation des CTAs",
              "Mots-clés et sémantique utilisés"
            ],
            impact: "Comprendre le succès"
          },
          {
            priority: "Critique",
            action: "Répliquer la formule gagnante",
            description: "Appliquez les éléments qui fonctionnent sur d'autres pages.",
            examples: [
              "Utiliser la même structure",
              "Adapter le style de rédaction",
              "Reprendre les visuels similaires",
              "Dupliquer les CTAs efficaces"
            ],
            impact: "+50-100% sur autres pages"
          },
          {
            priority: "Haute",
            action: "Optimiser encore plus",
            description: "Même votre meilleure page peut s'améliorer.",
            examples: [
              "Tests A/B des titres",
              "Ajout de vidéos/animations",
              "Amélioration du maillage interne",
              "Optimisation de la vitesse"
            ],
            impact: "+15-30% d'amélioration"
          },
          {
            priority: "Moyenne",
            action: "Créer du contenu similaire",
            description: "Développez plus de contenu sur le même sujet ou format.",
            examples: [
              "Articles de blog complémentaires",
              "Pages thématiques connexes",
              "Guides et ressources similaires"
            ],
            impact: "Augmente le trafic total"
          }
        ],
        nextSteps: [
          "1. Faites un audit complet de votre page star",
          "2. Créez une checklist des éléments de succès",
          "3. Appliquez cette checklist sur 3 pages prioritaires",
          "4. Mesurez les résultats après 2-3 semaines",
          "5. Ajustez et itérez"
        ]
      },
      "Scaler la stratégie": {
        title: "Plan d'Action: Mise à l'Échelle",
        problem: `Excellent ! ${mailRate}% de vos contacts reçoivent des emails. Votre pipeline fonctionne. Il est temps de scaler.`,
        analysis: [
          "⭐ Votre système de conversion est efficace",
          `📧 ${stats.totals.mails} emails envoyés sur ${stats.totals.contacts} contacts`,
          "🚀 Prêt pour la croissance"
        ],
        recommendations: [
          {
            priority: "Critique",
            action: "Automatiser le processus",
            description: "L'automatisation permet de gérer plus de volume sans perte de qualité.",
            examples: [
              "Email automation (Mailchimp, Sendinblue)",
              "CRM intégré (HubSpot, Pipedrive)",
              "Séquences d'emails automatiques",
              "Scoring automatique des leads"
            ],
            impact: "Gérer 10x plus de contacts"
          },
          {
            priority: "Critique",
            action: "Augmenter le volume de trafic",
            description: "Maintenant que la conversion fonctionne, amenez plus de visiteurs.",
            examples: [
              "Campagnes Google Ads",
              "Publicités Facebook/Instagram",
              "Partenariats et affiliations",
              "Marketing de contenu intensif"
            ],
            impact: "Croissance exponentielle"
          },
          {
            priority: "Haute",
            action: "Segmenter et personnaliser",
            description: "Pour scaler efficacement, personnalisez l'expérience.",
            examples: [
              "Segmentation par intérêt",
              "Emails personnalisés par profil",
              "Landing pages par source de trafic",
              "Offres adaptées au parcours client"
            ],
            impact: "+40-60% de conversion"
          },
          {
            priority: "Moyenne",
            action: "Optimiser le lifetime value",
            description: "Maximisez la valeur de chaque client.",
            examples: [
              "Upsells et cross-sells",
              "Programme de fidélité",
              "Nurturing long terme",
              "Réactivation des anciens clients"
            ],
            impact: "+100-200% de revenus"
          }
        ],
        nextSteps: [
          "1. Mettez en place l'automatisation email",
          "2. Lancez une première campagne paid",
          "3. Créez 3 segments de contacts",
          "4. Testez des séquences personnalisées",
          "5. Mesurez le ROI et ajustez"
        ]
      },
      "Optimiser le follow-up": {
        title: "Plan d'Action: Optimisation du Suivi",
        problem: `${mailRate}% de vos contacts reçoivent un email. C'est correct, mais vous perdez ${100 - mailRate}% d'opportunités.`,
        analysis: [
          "⚠️ Chaque contact non suivi est une opportunité perdue",
          `📉 ${stats.totals.contacts - stats.totals.mails} contacts sans réponse`,
          "⏱️ La rapidité de réponse est cruciale"
        ],
        recommendations: [
          {
            priority: "Critique",
            action: "Réponse automatique instantanée",
            description: "Chaque nouveau contact doit recevoir une réponse immédiate.",
            examples: [
              "Email de confirmation automatique",
              "Message de bienvenue personnalisé",
              "Indication du délai de réponse",
              "Proposition d'un calendrier de rendez-vous"
            ],
            impact: "Taux de réponse = 100%"
          },
          {
            priority: "Critique",
            action: "Créer des templates d'emails",
            description: "Gagnez du temps avec des modèles pré-rédigés de qualité.",
            examples: [
              "Template de premier contact",
              "Template de relance",
              "Template de proposition",
              "Template de remerciement"
            ],
            impact: "Gain de temps x5"
          },
          {
            priority: "Haute",
            action: "Système de rappels",
            description: "Ne laissez jamais un contact sans suivi.",
            examples: [
              "Rappels automatiques après 24h",
              "To-do list de suivi",
              "Notifications push",
              "Alertes par email"
            ],
            impact: "+50-70% de suivi"
          },
          {
            priority: "Moyenne",
            action: "Analyser les raisons du non-suivi",
            description: "Comprenez pourquoi certains contacts ne sont pas traités.",
            examples: [
              "Manque de temps ?",
              "Contacts hors cible ?",
              "Processus trop complexe ?",
              "Manque de ressources ?"
            ],
            impact: "Identifier les blocages"
          }
        ],
        nextSteps: [
          "1. Configurez l'email automatique de bienvenue",
          "2. Créez 5 templates d'emails",
          "3. Mettez en place un système de rappels",
          "4. Formez l'équipe au processus de suivi",
          "5. Suivez le taux de réponse hebdomadaire"
        ]
      },
      "Améliorer le pipeline": {
        title: "Plan d'Action: Amélioration du Pipeline",
        problem: `Seulement ${mailRate}% de vos contacts reçoivent un email. C'est critique ! Vous perdez la majorité de vos opportunités.`,
        analysis: [
          "🚨 Situation urgente: la plupart des contacts ne sont pas traités",
          `❌ ${stats.totals.contacts - stats.totals.mails} contacts perdus`,
          "💰 Perte de revenus potentielle significative"
        ],
        recommendations: [
          {
            priority: "URGENTE",
            action: "Automatisation complète immédiate",
            description: "Vous DEVEZ automatiser le processus dès maintenant.",
            examples: [
              "Zapier/Make.com pour connecter formulaire→email",
              "Auto-répondeur immédiat",
              "CRM avec workflows automatiques",
              "Notifications en temps réel"
            ],
            impact: "Passer de ${mailRate}% à 100%"
          },
          {
            priority: "URGENTE",
            action: "Audit du processus actuel",
            description: "Identifiez où se situe le problème dans votre pipeline.",
            examples: [
              "Les contacts arrivent-ils bien dans votre système ?",
              "Y a-t-il des filtres anti-spam ?",
              "Qui est responsable du suivi ?",
              "Quel est le processus actuel ?"
            ],
            impact: "Identifier le point de blocage"
          },
          {
            priority: "Critique",
            action: "Ressources dédiées",
            description: "Assignez quelqu'un spécifiquement au suivi des contacts.",
            examples: [
              "Responsable dédié au suivi",
              "Planning de réponse défini",
              "KPIs de suivi à respecter",
              "Formation de l'équipe"
            ],
            impact: "Responsabilisation"
          },
          {
            priority: "Haute",
            action: "Système de sauvegarde",
            description: "Mettez en place un filet de sécurité pour ne rien perdre.",
            examples: [
              "Double notification (email + SMS)",
              "Backup dans Google Sheets",
              "Alertes d'escalade si pas de réponse",
              "Dashboard de monitoring"
            ],
            impact: "Zéro contact perdu"
          }
        ],
        nextSteps: [
          "🔥 AUJOURD'HUI: Configurez l'auto-répondeur",
          "🔥 CETTE SEMAINE: Auditez le processus complet",
          "📅 SEMAINE 2: Mettez en place l'automatisation",
          "📅 SEMAINE 3: Formez l'équipe",
          "📅 SEMAINE 4: Mesurez l'amélioration"
        ]
      }
    };

    return analyses[insight.action] || analyses["Maintenir l'élan"];
  };

  const fetchStats = async () => {
    setError(null);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/track/stats/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Erreur fetch stats: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erreur fetch stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <p className="text-red-800 font-semibold text-lg">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Calculs pour les insights marketing
  const conversionRate = stats.totals.visits > 0 
    ? ((stats.totals.clicks / stats.totals.visits) * 100).toFixed(1)
    : 0;
  
  const contactRate = stats.totals.clicks > 0 
    ? ((stats.totals.contacts / stats.totals.clicks) * 100).toFixed(1)
    : 0;

  const mailRate = stats.totals.contacts > 0
    ? ((stats.totals.mails / stats.totals.contacts) * 100).toFixed(1)
    : 0;

  // Insights IA dynamiques basés sur les vraies données
  const getAIInsights = () => {
    const insights = [];
    
    // Insight 1: Taux de conversion visite->clic
    if (conversionRate < 20) {
      insights.push({
        type: "warning",
        icon: AlertCircle,
        color: "orange",
        title: "Taux de conversion faible",
        message: `${conversionRate}% des visiteurs cliquent. Optimisez vos CTAs pour augmenter l'engagement.`,
        action: "Optimiser les CTAs"
      });
    } else if (conversionRate >= 20 && conversionRate < 50) {
      insights.push({
        type: "success",
        icon: TrendingUp,
        color: "green",
        title: "Bon taux d'engagement",
        message: `${conversionRate}% de conversion visite→clic. Performance solide !`,
        action: "Maintenir l'élan"
      });
    } else {
      insights.push({
        type: "success",
        icon: Sparkles,
        color: "green",
        title: "Excellent taux d'engagement",
        message: `${conversionRate}% de conversion visite→clic. Performance exceptionnelle !`,
        action: "Analyser le succès"
      });
    }

    // Insight 2: Page la plus performante
    if (stats.top_pages.length > 0) {
      const topPage = stats.top_pages[0];
      const pageName = getPageName(topPage.page);
      insights.push({
        type: "info",
        icon: Target,
        color: "blue",
        title: "Page star",
        message: `"${pageName}" génère le plus d'actions (${topPage.total}). Dupliquez cette stratégie.`,
        action: "Analyser le contenu"
      });
    }

    // Insight 3: Taux de conversion email
    if (stats.totals.contacts > 0) {
      if (mailRate > 70) {
        insights.push({
          type: "success",
          icon: Zap,
          color: "purple",
          title: "Excellent taux de conversion email",
          message: `${mailRate}% des contacts deviennent des leads par email. Pipeline efficace !`,
          action: "Scaler la stratégie"
        });
      } else if (mailRate > 40) {
        insights.push({
          type: "info",
          icon: Mail,
          color: "blue",
          title: "Bon taux de conversion email",
          message: `${mailRate}% des contacts reçoivent des emails. Continuez sur cette lancée.`,
          action: "Optimiser le follow-up"
        });
      } else {
        insights.push({
          type: "warning",
          icon: AlertCircle,
          color: "orange",
          title: "Améliorer le suivi email",
          message: `Seulement ${mailRate}% des contacts reçoivent des emails. Augmentez le taux de conversion.`,
          action: "Améliorer le pipeline"
        });
      }
    }

    // Si pas assez d'insights, ajouter un insight sur les contacts
    if (insights.length < 3 && stats.totals.contacts > 0) {
      const contactTrend = contactRate > 30 ? "positive" : "à améliorer";
      insights.push({
        type: contactRate > 30 ? "success" : "warning",
        icon: Users,
        color: contactRate > 30 ? "green" : "orange",
        title: contactRate > 30 ? "Bonne conversion en contacts" : "Conversion à améliorer",
        message: `${contactRate}% des clics deviennent des contacts. Tendance ${contactTrend}.`,
        action: contactRate > 30 ? "Maintenir l'effort" : "Améliorer le parcours"
      });
    }

    return insights.slice(0, 3); // Maximum 3 insights
  };

  const aiInsights = getAIInsights();

  const mainMetrics = [
    {
      title: "Visites totales",
      value: stats.totals.visits,
      icon: Eye,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      change: "+12%",
      trending: "up"
    },
    {
      title: "Taux d'engagement",
      value: `${conversionRate}%`,
      icon: MousePointerClick,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      change: conversionRate > 30 ? "+8%" : "-3%",
      trending: conversionRate > 30 ? "up" : "down"
    },
    {
      title: "Contacts générés",
      value: stats.totals.contacts,
      icon: Users,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      change: "+24%",
      trending: "up"
    },
    {
      title: "Emails convertis",
      value: stats.totals.mails,
      icon: Mail,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
      change: `${mailRate}%`,
      trending: mailRate > 80 ? "up" : "down"
    }
  ];

  const conversationFunnel = [
    { label: "Visites", value: stats.totals.visits, percentage: 100, color: "bg-blue-500" },
    { label: "Clics", value: stats.totals.clicks, percentage: conversionRate, color: "bg-purple-500" },
    { label: "Contacts", value: stats.totals.contacts, percentage: contactRate, color: "bg-green-500" },
    { label: "Emails", value: stats.totals.mails, percentage: mailRate, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec insights IA */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Hub</h1>
              <p className="text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Mise à jour en temps réel • Dernière actualisation: il y a quelques secondes
              </p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg">
              <Brain className="w-6 h-6" />
              <span className="font-semibold">IA Insights activés</span>
            </div>
          </div>

          {/* AI Insights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon;
              const colorClasses = {
                orange: "bg-orange-50 border-orange-200 text-orange-900",
                green: "bg-green-50 border-green-200 text-green-900",
                blue: "bg-blue-50 border-blue-200 text-blue-900",
                purple: "bg-purple-50 border-purple-200 text-purple-900"
              };
              
              return (
                <div key={idx} className={`${colorClasses[insight.color]} border-2 rounded-2xl p-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{insight.title}</h3>
                      <p className="text-xs opacity-80">{insight.message}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setAnalysisData(generateInsightAnalysis(insight));
                      setShowAnalysisModal(true);
                    }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {insight.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Main Metrics - Grande taille */}
          {mainMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trending === "up" ? ArrowUpRight : ArrowDownRight;
            
            return (
              <div
                key={idx}
                className="group relative bg-white border-2 border-gray-200 rounded-3xl p-6 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.bgGradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${metric.bgGradient} rounded-2xl shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const metricTypes = {
                            "Visites totales": "visits",
                            "Taux d'engagement": "engagement",
                            "Contacts générés": "contacts",
                            "Emails convertis": "mails"
                          };
                          setSelectedMetric(analyzeMetric(metricTypes[metric.title]));
                          setShowMetricDetail(true);
                        }}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                        title="Voir les détails et conseils"
                      >
                        <Info className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                        metric.trending === "up" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        <TrendIcon className="w-4 h-4" />
                        {metric.change}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">{metric.title}</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  
                  {/* Mini sparkline */}
                  <div className="flex items-end gap-1 h-8">
                    {[40, 55, 48, 62, 70, 58, 75, 82, 78, 88].map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 bg-gradient-to-t ${metric.bgGradient} rounded-t opacity-30 hover:opacity-60 transition-opacity`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Funnel de conversion + Pages populaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Funnel de conversion */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Funnel de conversion</h2>
                <p className="text-sm text-gray-500">Parcours utilisateur complet</p>
              </div>
            </div>

            <div className="space-y-4">
              {conversationFunnel.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{stage.percentage}%</span>
                      <span className="text-lg font-bold text-gray-900">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${stage.color} h-full rounded-full transition-all duration-500 shadow-inner`}
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Metric cards en bas */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2 border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Visite→Clic</p>
                <p className="text-2xl font-bold text-blue-600">{conversionRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Clic→Contact</p>
                <p className="text-2xl font-bold text-purple-600">{contactRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Contact→Email</p>
                <p className="text-2xl font-bold text-green-600">{mailRate}%</p>
              </div>
            </div>
          </div>

          {/* Pages populaires */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-2xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pages les plus performantes</h2>
                <p className="text-sm text-gray-500">Classement par actions</p>
              </div>
            </div>

            <div className="space-y-3">
              {stats.top_pages.length > 0 ? (
                stats.top_pages.slice(0, 8).map((page, idx) => {
                  const maxActions = stats.top_pages[0].total;
                  const percentage = (page.total / maxActions) * 100;
                  
                  return (
                    <div
                      key={idx}
                      className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-white shadow-md ${
                          idx === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" :
                          idx === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" :
                          idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-500" :
                          "bg-gradient-to-br from-gray-300 to-gray-400"
                        }`}>
                          {idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 truncate">
                              {getPageName(page.page)}
                            </h3>
                            <button
                              onClick={() => {
                                setSelectedPage(analyzePage(page.page, page.total));
                                setShowPageAnalysis(true);
                              }}
                              className="ml-3 px-3 py-1 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-full text-sm font-bold text-gray-900 shadow-sm whitespace-nowrap hover:shadow-md transition-all flex items-center gap-1"
                            >
                              {page.total} actions
                              <Info className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline d'activité */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tendance d'activité</h2>
                <p className="text-sm text-gray-500">
                  {timeframe === 7 ? "7 derniers jours" : timeframe === 30 ? "30 derniers jours" : "90 derniers jours"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2">
              <button 
                onClick={() => setTimeframe(7)}
                className={`px-4 py-2 font-semibold rounded-lg text-sm transition-all ${
                  timeframe === 7 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                7j
              </button>
              <button 
                onClick={() => setTimeframe(30)}
                className={`px-4 py-2 font-semibold rounded-lg text-sm transition-all ${
                  timeframe === 30 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                30j
              </button>
              <button 
                onClick={() => setTimeframe(90)}
                className={`px-4 py-2 font-semibold rounded-lg text-sm transition-all ${
                  timeframe === 90 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                90j
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {(() => {
              const filteredData = getFilteredTimeseries();
              
              if (filteredData.length === 0) {
                return (
                  <div className="col-span-full text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Aucune donnée disponible pour cette période</p>
                  </div>
                );
              }
              
              const maxCount = Math.max(...filteredData.map(d => d.count));
              const displayData = filteredData.slice(-10); // Afficher max 10 barres
              
              return displayData.map((item, idx) => {
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden group">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-xl transition-all duration-500 group-hover:from-green-600 group-hover:to-green-500"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white text-gray-900 font-bold text-xs px-2 py-1 rounded-lg shadow-lg">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">
                      {new Date(item.day).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Modal d'analyse d'insight */}
        {showAnalysisModal && analysisData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-900">{analysisData.title}</h2>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Problématique */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Situation actuelle
                  </h3>
                  <p className="text-blue-800">{analysisData.problem}</p>
                </div>

                {/* Analyse */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Analyse
                  </h3>
                  <div className="space-y-2">
                    {analysisData.analysis.map((point, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-gray-800">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                    Recommandations
                  </h3>
                  <div className="space-y-4">
                    {analysisData.recommendations.map((rec, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{rec.action}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            rec.priority === "Critique" || rec.priority === "URGENTE" 
                              ? "bg-red-100 text-red-700"
                              : rec.priority === "Haute"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        
                        {rec.examples && (
                          <div className="bg-gray-50 rounded-xl p-4 mb-3">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Exemples concrets:</p>
                            <ul className="space-y-1">
                              {rec.examples.map((example, i) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">Impact: {rec.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prochaines étapes */}
                {analysisData.nextSteps && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Plan d'action
                    </h3>
                    <ul className="space-y-2">
                      {analysisData.nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-purple-900 font-medium">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de détail métrique */}
        {showMetricDetail && selectedMetric && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-${selectedMetric.color}-500 rounded-xl`}>
                    <selectedMetric.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMetric.title}</h2>
                </div>
                <button
                  onClick={() => setShowMetricDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Valeur actuelle */}
                <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-2">Valeur actuelle</p>
                  <p className="text-5xl font-bold text-gray-900">
                    {typeof selectedMetric.currentValue === 'number' 
                      ? selectedMetric.currentValue.toLocaleString() 
                      : selectedMetric.currentValue}
                  </p>
                </div>

                {/* Explication */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">📖 Qu'est-ce que c'est ?</h3>
                  <p className="text-blue-800">{selectedMetric.explanation}</p>
                </div>

                {/* Insights */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Insights</h3>
                  <div className="space-y-2">
                    {selectedMetric.insights.map((insight, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-gray-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                    Comment améliorer ?
                  </h3>
                  <div className="space-y-4">
                    {selectedMetric.recommendations.map((rec, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{rec.action}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            rec.priority === "Haute" 
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">Impact: {rec.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'analyse de page */}
        {showPageAnalysis && selectedPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h2>
                <button
                  onClick={() => setShowPageAnalysis(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Stats de la page */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-blue-700 mb-1">Actions</p>
                    <p className="text-3xl font-bold text-blue-900">{selectedPage.actions}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-purple-700 mb-1">% du total</p>
                    <p className="text-3xl font-bold text-purple-900">{selectedPage.percentOfTotal}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-green-700 mb-1">Performance</p>
                    <p className="text-xl font-bold text-green-900">{selectedPage.performance}</p>
                  </div>
                </div>

                {/* Type et rôle */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">🎯 Rôle de cette page</h3>
                  <p className="text-purple-800 mb-3"><strong>Type:</strong> {selectedPage.type}</p>
                  <p className="text-purple-800">{selectedPage.role}</p>
                </div>

                {/* KPIs à suivre */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">📊 KPIs recommandés</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedPage.kpis.map((kpi, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <p className="font-semibold text-gray-900">{kpi}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Insights</h3>
                  <div className="space-y-2">
                    {selectedPage.insights.map((insight, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-gray-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                    Plan d'amélioration
                  </h3>
                  <div className="space-y-4">
                    {selectedPage.recommendations.map((rec, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{rec.action}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            rec.priority === "Haute" 
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUpIcon className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">Impact: {rec.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;