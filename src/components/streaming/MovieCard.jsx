import { Link } from "react-router-dom";
import { Star, Play, Heart } from "lucide-react";
import { tmdb } from "@/lib/tmdb";
import { useState } from "react";

export default function MovieCard({ item, onFavorite, isFavorite }) {
  const [hovered, setHovered] = useState(false);
  const type = item.media_type || (item.first_air_date ? "tv" : "movie");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const poster = tmdb.image(item.poster_path, "w342");
  const path = `/${type === "tv" ? "serie" : "filme"}/${item.id}`;

  return (
    <div
      className="relative group flex-shrink-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={path}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-900/40">
          {poster ? (
            <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">{title}</div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <p className="text-white font-semibold text-sm line-clamp-2">{title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs">{item.vote_average?.toFixed(1)}</span>
              {year && <span className="text-gray-400 text-xs ml-2">{year}</span>}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex-1 bg-purple-600 hover:bg-purple-500 rounded-lg py-1 flex items-center justify-center gap-1">
                <Play className="w-3 h-3 text-white fill-white" />
                <span className="text-white text-xs font-medium">Assistir</span>
              </div>
            </div>
          </div>
          {/* Rating badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs">{item.vote_average?.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>
      {/* Favorite button */}
      {onFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onFavorite(item, type); }}
          className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "text-red-500 fill-red-500" : "text-white"}`} />
        </button>
      )}
    </div>
  );
}