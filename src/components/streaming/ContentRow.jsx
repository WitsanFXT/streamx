import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function ContentRow({ title, items, onFavorite, favorites }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-white font-bold text-xl mb-4 px-4">{title}</h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg -ml-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => (
            <div key={item.id} className="w-36 md:w-44 flex-shrink-0">
              <MovieCard
                item={item}
                onFavorite={onFavorite}
                isFavorite={favorites?.some(f => f.tmdb_id === item.id)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg -mr-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}