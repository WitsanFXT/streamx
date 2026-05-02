import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { IMG_BASE_ORIGINAL } from '@/lib/tmdb';

export default function HeroBanner({ items = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(items.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) {
    return <div className="h-[60vh] bg-secondary animate-pulse" />;
  }

  const item = items[current];
  const isMovie = item.media_type === 'movie' || item.title;
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : '';
  const path = isMovie ? `/filme/${item.id}` : `/serie/${item.id}`;

  return (
    <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {item.backdrop_path ? (
          <img
            src={`${IMG_BASE_ORIGINAL}${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-6 sm:px-12 max-w-2xl">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {isMovie ? 'Filme' : 'Série'}
            </span>
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white font-semibold">{item.vote_average.toFixed(1)}</span>
              </div>
            )}
            {year && <span className="text-sm text-muted-foreground">{year}</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight drop-shadow-2xl">
            {title}
          </h1>

          {item.overview && (
            <p className="text-sm sm:text-base text-muted-foreground mb-6 line-clamp-3 max-w-lg leading-relaxed">
              {item.overview}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Link
              to={path}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              Assistir agora
            </Link>
            <Link
              to={path}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-xl backdrop-blur-sm transition-all border border-white/10"
            >
              <Info className="w-4 h-4" />
              Detalhes
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 z-10 flex items-center gap-1.5">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${
              i === current ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}