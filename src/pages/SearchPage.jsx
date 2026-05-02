import { useEffect, useState } from "react";
import { tmdb } from "@/lib/tmdb";
import Navbar from "@/components/streaming/Navbar";
import MovieCard from "@/components/streaming/MovieCard";
import { Search } from "lucide-react";

export default function SearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    tmdb.search(query).then((data) => {
      setResults((data.results || []).filter(r => r.media_type !== "person"));
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes e séries..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-base rounded-2xl pl-12 pr-5 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nenhum resultado para "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <h2 className="text-white font-bold text-xl mb-5">
              {results.length} resultados para "{query}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {!query && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Digite algo para buscar</p>
          </div>
        )}
      </div>
    </div>
  );
}