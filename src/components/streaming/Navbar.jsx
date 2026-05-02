import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Home, Tv, Film, Menu, X, Play } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/filmes", label: "Filmes", Icon: Film },
  { to: "/series", label: "Séries", Icon: Tv },
  { to: "/favoritos", label: "Favoritos", Icon: Heart },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d1a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight hidden sm:block">
            Wits<span className="text-purple-500">Play</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === to ? "text-purple-400" : "text-gray-300 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden sm:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes e séries..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-colors"
            />
          </div>
        </form>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </form>
          {links.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-2 text-sm font-medium ${
                location.pathname === to ? "text-purple-400" : "text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}