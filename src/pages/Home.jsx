import { useEffect, useState } from "react";
import { tmdb } from "@/lib/tmdb";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/streaming/Navbar";
import HeroBanner from "@/components/streaming/HeroBanner";
import ContentRow from "@/components/streaming/ContentRow";
import { toast } from "sonner";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tmdb.getTrending(),
      tmdb.getPopularMovies(),
      tmdb.getPopularSeries(),
      tmdb.getTopRatedMovies(),
      tmdb.getTopRatedSeries(),
      base44.entities.Favorite.list(),
    ]).then(([t, pm, ps, trm, trs, favs]) => {
      setTrending(t.results || []);
      setPopularMovies(pm.results || []);
      setPopularSeries(ps.results || []);
      setTopRatedMovies(trm.results || []);
      setTopRatedSeries(trs.results || []);
      setFavorites(favs || []);
      setLoading(false);
    });
  }, []);

  const handleFavorite = async (item, type) => {
    const exists = favorites.find(f => f.tmdb_id === item.id);
    if (exists) {
      await base44.entities.Favorite.delete(exists.id);
      setFavorites(prev => prev.filter(f => f.tmdb_id !== item.id));
      toast.success("Removido dos favoritos");
    } else {
      const created = await base44.entities.Favorite.create({
        tmdb_id: item.id,
        media_type: type,
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
      });
      setFavorites(prev => [...prev, created]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const hero = trending[0];

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />
      {loading ? (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <HeroBanner item={hero} />
          <div className="pb-16 -mt-8 relative z-10">
            <ContentRow title="🔥 Em Alta" items={trending.slice(0, 20)} onFavorite={handleFavorite} favorites={favorites} />
            <ContentRow title="🎬 Filmes Populares" items={popularMovies} onFavorite={handleFavorite} favorites={favorites} />
            <ContentRow title="📺 Séries Populares" items={popularSeries} onFavorite={handleFavorite} favorites={favorites} />
            <ContentRow title="⭐ Filmes Mais Bem Avaliados" items={topRatedMovies} onFavorite={handleFavorite} favorites={favorites} />
            <ContentRow title="🏆 Séries Mais Bem Avaliadas" items={topRatedSeries} onFavorite={handleFavorite} favorites={favorites} />
          </div>
        </>
      )}
    </div>
  );
}