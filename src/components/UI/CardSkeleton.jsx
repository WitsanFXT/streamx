export default function CardSkeleton() {
  return (
    <div className="block">
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[2/3] animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-3 bg-secondary rounded animate-pulse w-4/5" />
        <div className="h-2.5 bg-secondary rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}