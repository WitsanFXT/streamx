import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tmdb } from "@/lib/tmdb";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/streaming/Navbar";
import ContentRow from "@/components/streaming/ContentRow";
import { Star, Heart, ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function SerieDetail() {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [playerMode, setPlayerMode] = useState("all"); // "all" | "episode"

  useEffect(() => {
    setLoading(true);
    Promise.all([
      tmdb.details("tv", id),
      base44.entities.Favorite.list(),
    ]).then(([s, favs]) => {
      setSerie(s);
      setFavorites(favs || []);
      if (s.seasons?.length > 0) {
        const firstSeason = s.seasons.find(s => s.season_number > 0) || s.seasons[0];
        setSelectedSeason(firstSeason.season_number);
      }
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (selectedSeason === null) return;
    setLoadingEpisodes(true);
    tmdb.episodesList(id, selectedSeason).then((data) => {
      setEpisodes(data.episodes || []);
      setSelectedEpisode(null);
      setLoadingEpisodes(false);
    });
  }, [selectedSeason, id]);

  const isFav = favorites.some(f => f.tmdb_id === Number(id));

  const handleFavorite = async () => {
    const exists = favorites.find(f => f.tmdb_id === Number(id));
    if (exists) {
      await base44.entities.Favorite.delete(exists.id);
      setFavorites(prev => prev.filter(f => f.tmdb_id !== Number(id)));
      toast.success("Removido dos favoritos");
    } else {
      const created = await base44.entities.Favorite.create({
        tmdb_id: serie.id,
        media_type: "tv",
        title: serie.name,
        poster_path: serie.poster_path,
        vote_average: serie.vote_average,
      });
      setFavorites(prev => [...prev, created]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const playerUrl = playerMode === "episode" && selectedSeason && selectedEpisode
    ? `https://myembed.biz/serie/${id}/${selectedSeason}/${selectedEpisode}`
    : `https://myembed.biz/serie/${id}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!serie) return null;

  const backdrop = tmdb.backdrop(serie.backdrop_path);
  const poster = tmdb.image(serie.poster_path, "w342");
  const year = serie.first_air_date?.slice(0, 4);
  const genres = serie.genres?.map(g => g.name).join(", ");
  const seasons = serie.seasons?.filter(s => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />

      <div className="relative h-[50vh]">
        {backdrop && (
          <img src={backdrop} alt={serie.name} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/60 to-black/40" />
        <Link to="/" className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex gap-6 md:gap-10 mb-8">
          <div className="flex-shrink-0 w-32 md:w-52 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
            {poster ? (
              <img src={poster} alt={serie.name} className="w-full h-auto" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl" />
            )}
          </div>

          <div className="flex-1 pt-20 md:pt-28">
            <h1 className="text-white text-2xl md:text-4xl font-extrabold mb-2">{serie.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {year && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {year}
                </div>
              )}
              {serie.number_of_seasons && (
                <span className="text-gray-400 text-sm">{serie.number_of_seasons} temporadas</span>
              )}
              {serie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{serie.vote_average?.toFixed(1)}</span>
                </div>
              )}
              {genres && <span className="text-purple-400 text-sm">{genres}</span>}
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
              {serie.overview || "Sem descrição disponível."}
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

        {/* Player Section */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-white font-bold text-xl">▶ Assistir</h2>
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={() => setPlayerMode("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  playerMode === "all" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Todas as Temporadas
              </button>
              <button
                onClick={() => setPlayerMode("episode")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  playerMode === "episode" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Episódio Específico
              </button>
            </div>
          </div>

          {playerMode === "episode" && (
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Season selector */}
              <div className="relative">
                <select
                  value={selectedSeason || ""}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {seasons.map(s => (
                    <option key={s.season_number} value={s.season_number} className="bg-[#1a1a2e]">
                      {s.name || `Temporada ${s.season_number}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Episode selector */}
              {!loadingEpisodes && episodes.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedEpisode || ""}
                    onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                    className="appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1a2e]">Selecionar episódio</option>
                    {episodes.map(ep => (
                      <option key={ep.episode_number} value={ep.episode_number} className="bg-[#1a1a2e]">
                        Ep. {ep.episode_number} - {ep.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              key={playerUrl}
              src={playerUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* Episodes list */}
        {playerMode === "episode" && episodes.length > 0 && (
          <div className="mb-10">
            <h3 className="text-white font-bold text-lg mb-3">Episódios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {episodes.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => setSelectedEpisode(ep.episode_number)}
                  className={`flex gap-3 p-3 rounded-xl transition-colors text-left ${
                    selectedEpisode === ep.episode_number
                      ? "bg-purple-600/30 border border-purple-500"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                >
                  {ep.still_path ? (
                    <img
                      src={tmdb.image(ep.still_path, "w185")}
                      alt={ep.name}
                      className="w-24 aspect-video object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 aspect-video bg-gray-700 rounded-lg flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold line-clamp-1">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2 mt-1">{ep.overview}</p>
                    {ep.vote_average > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs">{ep.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Similar series */}
        {serie.similar?.results?.length > 0 && (
          <ContentRow title="Séries Similares" items={serie.similar.results} />
        )}
      </div>
    </div>
  );
}