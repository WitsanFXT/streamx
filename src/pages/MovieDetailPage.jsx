import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tmdb, IMG_BASE, IMG_BASE_ORIGINAL } from '@/lib/tmdb';
import { base44 } from '@/api/base44Client';
import { Play, Star, Heart, Clock, Calendar, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RowSection from '@/components/sections/RowSection';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [playing, setPlaying] = useState(false);
  const queryClient = useQueryClient();

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdb.getMovie(id),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const isFav = favorites.some((f) => f.tmdb_id === movie?.id && f.media_type === 'movie');

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (isFav) {
        const fav = favorites.find((f) => f.tmdb_id === movie?.id && f.media_type === 'movie');
        await base44.entities.Favorite.delete(fav.id);
      } else {
        await base44.entities.Favorite.create({
          tmdb_id: movie.id,
          media_type: 'movie',
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-[50vh] bg-secondary animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
          <div className="h-8 bg-secondary rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-secondary rounded w-full animate-pulse" />
          <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const genres = movie.genres?.map((g) => g.name).join(', ');

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[55vh]">
        {movie.backdrop_path && (
          <img src={`${IMG_BASE_ORIGINAL}${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        <Link to="/filmes" className="absolute top-4 left-4 sm:left-6 flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Filmes
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="flex gap-6 items-start">
          {/* Poster */}
          <div className="hidden sm:block shrink-0 w-44 rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/40">
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} className="w-full" />
          </div>

          {/* Info */}
          <div className="flex-1 pt-8 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3 leading-tight">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Calendar className="w-3.5 h-3.5" /> {year}
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Clock className="w-3.5 h-3.5" /> {runtime}
                </div>
              )}
            </div>

            {genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full border border-border/50">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" /> Assistir
              </button>
              <button
                onClick={() => toggleFav.mutate()}
                className={`flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  isFav
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-primary/40'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-primary' : ''}`} />
                {isFav ? 'Favoritado' : 'Favoritar'}
              </button>
            </div>
          </div>
        </div>

        {/* Player */}
        {playing && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Reprodução</h2>
              <button onClick={() => setPlaying(false)} className="text-muted-foreground hover:text-foreground text-sm transition-colors">Fechar player</button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`https://myembed.biz/filme/${id}`}
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
        {movie.similar?.results?.length > 0 && (
          <div className="mt-12">
            <RowSection
              title="Filmes Similares"
              items={movie.similar.results}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}