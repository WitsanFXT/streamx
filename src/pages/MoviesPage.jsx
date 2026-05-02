import { useEffect, useState } from "react";
import { tmdb } from "@/lib/tmdb";
import Navbar from "@/components/streaming/Navbar";
import MovieCard from "@/components/streaming/MovieCard";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    tmdb.getGenres().then(d => setGenres(d.genres || []));
    base44.entities.Favorite.list().then(f => setFavorites(f || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = selectedGenre
      ? tmdb.getByGenre(selectedGenre, "movie")
      : tmdb.getPopularMovies();
    fetch.then((data) => {
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 20));
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [selectedGenre, page]);

  const handleFavorite = async (item) => {
    const exists = favorites.find(f => f.tmdb_id === item.id);
    if (exists) {
      await base44.entities.Favorite.delete(exists.id);
      setFavorites(prev => prev.filter(f => f.tmdb_id !== item.id));
      toast.success("Removido dos favoritos");
    } else {
      const created = await base44.entities.Favorite.create({
        tmdb_id: item.id,
        media_type: "movie",
        title: item.title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
      });
      setFavorites(prev => [...prev, created]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <h1 className="text-white font-extrabold text-3xl mb-6">🎬 Filmes</h1>

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setSelectedGenre(null); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedGenre ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Todos
          </button>
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelectedGenre(g.id); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === g.id ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map(item => (
                <MovieCard
                  key={item.id}
                  item={{ ...item, media_type: "movie" }}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.some(f => f.tmdb_id === item.id)}
                />
              ))}
            </div>

            {selectedGenre && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-400 text-sm">Página {page} de {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}