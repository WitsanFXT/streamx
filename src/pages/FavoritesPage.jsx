import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/streaming/Navbar";
import MovieCard from "@/components/streaming/MovieCard";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Favorite.list().then(f => {
      setFavorites(f || []);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (item, type) => {
    const exists = favorites.find(f => f.tmdb_id === item.id);
    if (exists) {
      await base44.entities.Favorite.delete(exists.id);
      setFavorites(prev => prev.filter(f => f.tmdb_id !== item.id));
      toast.success("Removido dos favoritos");
    }
  };

  // Convert favorite records to item format
  const items = favorites.map(f => ({
    id: f.tmdb_id,
    title: f.title,
    name: f.title,
    poster_path: f.poster_path,
    vote_average: f.vote_average,
    media_type: f.media_type,
  }));

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <h1 className="text-white font-extrabold text-3xl mb-8 flex items-center gap-3">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          Meus Favoritos
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Você ainda não tem favoritos</p>
            <p className="text-gray-600 text-sm mt-2">Clique no coração em um filme ou série para adicioná-lo aqui</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map(item => (
              <MovieCard
                key={item.id}
                item={item}
                onFavorite={handleRemove}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}