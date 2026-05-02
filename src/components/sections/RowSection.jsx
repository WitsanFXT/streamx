import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import MovieCard from '@/components/ui/MovieCard';
import CardSkeleton from '@/components/ui/CardSkeleton';

export default function RowSection({ title, items = [], isLoading, viewAllLink, mediaType }) {
  const normalizedItems = items.map(item => ({
    ...item,
    media_type: item.media_type || mediaType,
  }));

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Ver mais <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="px-4 sm:px-6">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {isLoading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="shrink-0 w-32 sm:w-40">
                  <CardSkeleton />
                </div>
              ))
            : normalizedItems.map((item) => (
                <div key={item.id} className="shrink-0 w-32 sm:w-40">
                  <MovieCard item={item} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}