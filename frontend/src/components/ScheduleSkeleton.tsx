import { Skeleton } from "@/components/ui/skeleton";

const ScheduleSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-3 md:px-4 animate-fade-in">
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 pointer-events-none" />
        
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Events Skeleton */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-4 flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSkeleton; 