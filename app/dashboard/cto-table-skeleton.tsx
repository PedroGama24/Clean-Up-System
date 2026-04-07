import { Skeleton } from "@/components/ui/skeleton";

export function CtoTableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: 8 }).map((_, c) => (
            <Skeleton key={c} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
