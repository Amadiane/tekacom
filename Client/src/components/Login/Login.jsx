import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import CONFIG from '../../config/config.js';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('user', JSON.stringify({ username }));

        navigate('/dashboardAdmin');
      } else {
        setError(data.detail || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.log(err);
      setError("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin(e);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden flex items-center justify-center p-4">
      {/* Effets de fond lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      {/* Carte de login */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 rounded-3xl blur opacity-30 animate-pulse"></div>
        
        <div className="relative bg-[#0f1729]/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-orange-500/30 p-8 md:p-10">
          {/* Logo et Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/50">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-2 tracking-tight">
              ADMIN ACCESS
            </h1>
            <p className="text-blue-300 text-sm font-semibold">Espace réservé aux administrateurs</p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-xl"></div>
              <div className="relative bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Champ Username */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" />
                Nom d'utilisateur
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-orange-500/10 blur-lg opacity-0 group-hover/input:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-16 pr-4 py-4 bg-white/5 border-2 border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300 font-semibold"
                    placeholder="Entrez votre username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            </div>

            {/* Champ Password */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Mot de passe
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-blue-500/10 blur-lg opacity-0 group-hover/input:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="w-full pl-16 pr-14 py-4 bg-white/5 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-semibold"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-sm text-blue-400 hover:text-orange-400 font-semibold transition-colors duration-300 flex items-center gap-1 group"
              >
                Mot de passe oublié ?
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="relative w-full group/submit overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-xl opacity-50 group-hover/submit:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-black text-lg shadow-2xl border-2 border-orange-400/50 group-hover/submit:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white">CONNEXION...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6 text-white" />
                    <span className="text-white">SE CONNECTER</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Badge sécurisé */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="font-semibold">Connexion sécurisée SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Particules décoratives */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-10 w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default Login;