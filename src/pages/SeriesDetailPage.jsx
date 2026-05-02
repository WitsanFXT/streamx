import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tmdb, IMG_BASE, IMG_BASE_ORIGINAL } from '@/lib/tmdb';
import { base44 } from '@/api/base44Client';
import { Play, Star, Heart, Calendar, ChevronLeft, ChevronDown } from 'lucide-react';
import RowSection from '@/components/sections/RowSection';

export default function SeriesDetailPage() {
  const { id } = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [playing, setPlaying] = useState(false);
  const queryClient = useQueryClient();

  const { data: series, isLoading } = useQuery({
    queryKey: ['series', id],
    queryFn: () => tmdb.getSeries(id),
  });

  const { data: seasonData, isLoading: loadingSeason } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => tmdb.getSeriesSeason(id, selectedSeason),
    enabled: !!id,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const isFav = favorites.some((f) => f.tmdb_id === series?.id && f.media_type === 'tv');

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (isFav) {
        const fav = favorites.find((f) => f.tmdb_id === series?.id && f.media_type === 'tv');
        await base44.entities.Favorite.delete(fav.id);
      } else {
        await base44.entities.Favorite.create({
          tmdb_id: series.id,
          media_type: 'tv',
          title: series.name,
          poster_path: series.poster_path,
          backdrop_path: series.backdrop_path,
          vote_average: series.vote_average,
          release_date: series.first_air_date,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const getPlayerSrc = () => {
    if (selectedEpisode) return `https://myembed.biz/serie/${id}/${selectedSeason}/${selectedEpisode}`;
    return `https://myembed.biz/serie/${id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-[50vh] bg-secondary animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
          <div className="h-8 bg-secondary rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-secondary rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!series) return null;

  const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : '';
  const seasons = series.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh]">
        {series.backdrop_path && (
          <img src={`${IMG_BASE_ORIGINAL}${series.backdrop_path}`} alt={series.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <Link to="/series" className="absolute top-4 left-4 sm:left-6 flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Séries
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="flex gap-6 items-start">
          <div className="hidden sm:block shrink-0 w-44 rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/40">
            {series.poster_path && <img src={`${IMG_BASE}${series.poster_path}`} alt={series.name} className="w-full" />}
          </div>
          <div className="flex-1 pt-8 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3 leading-tight">{series.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {series.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span className="text-sm font-bold">{series.vote_average.toFixed(1)}</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Calendar className="w-3.5 h-3.5" /> {year}
                </div>
              )}
              {seasons.length > 0 && (
                <span className="text-muted-foreground text-sm">{seasons.length} temporada{seasons.length > 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {series.genres?.map((g) => (
                <span key={g.id} className="bg-secondary text-xs px-3 py-1 rounded-full border border-border/50">{g.name}</span>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{series.overview}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setSelectedEpisode(null); setPlaying(true); }}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" /> Assistir
              </button>
              <button
                onClick={() => toggleFav.mutate()}
                className={`flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  isFav ? 'bg-primary/15 text-primary border-primary/40' : 'bg-secondary border-border hover:border-primary/40'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-primary' : ''}`} />
                {isFav ? 'Favoritado' : 'Favoritar'}
              </button>
            </div>
          </div>
        </div>

        {/* Season/Episode selector */}
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <h2 className="text-xl font-bold text-foreground">Episódios</h2>
            {seasons.length > 1 && (
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => { setSelectedSeason(Number(e.target.value)); setSelectedEpisode(null); }}
                  className="bg-secondary border border-border text-foreground text-sm rounded-lg px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {seasons.map((s) => (
                    <option key={s.season_number} value={s.season_number}>
                      Temporada {s.season_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            )}
          </div>

          {loadingSeason ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {seasonData?.episodes?.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => { setSelectedEpisode(ep.episode_number); setPlaying(true); }}
                  className={`text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                    selectedEpisode === ep.episode_number
                      ? 'bg-primary/15 border-primary/50 text-foreground'
                      : 'bg-secondary border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary bg-primary/15 rounded-lg px-2 py-1 shrink-0">
                      E{ep.episode_number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{ep.name}</p>
                      {ep.runtime && <p className="text-xs text-muted-foreground mt-0.5">{ep.runtime}min</p>}
                    </div>
                    <Play className="w-4 h-4 text-primary shrink-0 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Player */}
        {playing && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Reprodução {selectedEpisode ? `— T${selectedSeason}:E${selectedEpisode}` : ''}
              </h2>
              <button onClick={() => setPlaying(false)} className="text-muted-foreground hover:text-foreground text-sm transition-colors">Fechar player</button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={getPlayerSrc()}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Similar */}
        {series.similar?.results?.length > 0 && (
          <div className="mt-12">
            <RowSection title="Séries Similares" items={series.similar.results} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}