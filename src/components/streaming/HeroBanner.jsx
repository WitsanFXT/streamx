import { Link } from "react-router-dom";
import { Play, Info, Star } from "lucide-react";
import { tmdb } from "@/lib/tmdb";

export default function HeroBanner({ item }) {
  if (!item) return null;
  const type = item.media_type || (item.first_air_date ? "tv" : "movie");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const backdrop = tmdb.backdrop(item.backdrop_path);
  const path = `/${type === "tv" ? "serie" : "filme"}/${item.id}`;

  return (
    <div className="relative w-full h-[70vh] min-h-[420px] flex items-end overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />

      <div className="relative z-10 px-6 md:px-12 pb-14 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            {type === "tv" ? "SÉRIE" : "FILME"}
          </span>
          {year && <span className="text-gray-300 text-sm">{year}</span>}
          {item.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">{item.vote_average?.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-3 leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 max-w-xl">
          {item.overview || "Sem descrição disponível."}
        </p>
        <div className="flex gap-3">
          <Link
            to={path}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-purple-900/50"
          >
            <Play className="w-5 h-5 fill-white" />
            Assistir Agora
          </Link>
          <Link
            to={path}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Info className="w-5 h-5" />
            Mais Info
          </Link>
        </div>
      </div>
    </div>
  );
}