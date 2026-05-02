import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { IMG_BASE } from '@/lib/tmdb';

export default function MovieCard({ item }) {
  const isMovie = item.media_type === 'movie' || item.title;
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : '';
  const path = isMovie ? `/filme/${item.id}` : `/serie/${item.id}`;

  return (
    <Link to={path} className="group relative block">
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[2/3]">
        {item.poster_path ? (
          <img
            src={`${IMG_BASE}${item.poster_path}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Play className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-primary rounded-full p-3 shadow-lg shadow-primary/40">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <p className="text-white text-xs font-medium line-clamp-2">{title}</p>
        </div>

        {/* Rating badge */}
        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-semibold">{item.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-xs text-white font-semibold">{isMovie ? 'FILME' : 'SÉRIE'}</span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{title}</p>
        {year && <p className="text-xs text-muted-foreground mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}