import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tmdb } from "@/lib/tmdb";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/streaming/Navbar";
import ContentRow from "@/components/streaming/ContentRow";
import { Star, Clock, Heart, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      tmdb.details("movie", id),
      base44.entities.Favorite.list(),
    ]).then(([m, favs]) => {
      setMovie(m);
      setFavorites(favs || []);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  const isFav = favorites.some(f => f.tmdb_id === Number(id));

  const handleFavorite = async () => {
    const exists = favorites.find(f => f.tmdb_id === Number(id));
    if (exists) {
      await base44.entities.Favorite.delete(exists.id);
      setFavorites(prev => prev.filter(f => f.tmdb_id !== Number(id)));
      toast.success("Removido dos favoritos");
    } else {
      const created = await base44.entities.Favorite.create({
        tmdb_id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      });
      setFavorites(prev => [...prev, created]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return null;

  const backdrop = tmdb.backdrop(movie.backdrop_path);
  const poster = tmdb.image(movie.poster_path, "w342");
  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genres?.map(g => g.name).join(", ");
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[50vh] mt-0">
        {backdrop && (
          <img src={backdrop} alt={movie.title} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/60 to-black/40" />
        <Link to="/" className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex gap-6 md:gap-10 mb-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-32 md:w-52 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
            {poster ? (
              <img src={poster} alt={movie.title} className="w-full h-auto" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-20 md:pt-28">
            <h1 className="text-white text-2xl md:text-4xl font-extrabold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {year && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {year}
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {runtime}
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{movie.vote_average?.toFixed(1)}</span>
                </div>
              )}
              {genres && <span className="text-purple-400 text-sm">{genres}</span>}
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
              {movie.overview || "Sem descrição disponível."}
            </p>
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isFav ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
              {isFav ? "Favoritado" : "Adicionar aos Favoritos"}
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-4">▶ Assistir</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={`https://myembed.biz/filme/${id}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* Similar */}
        {movie.similar?.results?.length > 0 && (
          <ContentRow
            title="Filmes Similares"
            items={movie.similar.results}
          />
        )}
      </div>
    </div>
  );
}