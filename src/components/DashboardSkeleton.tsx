"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function DashboardSkeleton() {
  return (
    <div className="my-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <Skeleton className="h-10 w-64 mb-8 rounded-md" />

      {/* PROFILE LINK CARD */}
      <Skeleton className="h-28 w-full rounded-xl mb-6" />

      {/* SWITCH */}
      <Skeleton className="h-14 w-60 rounded-xl mb-6" />

      <Separator className="mb-6" />

      {/* REFRESH BUTTON */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* MESSAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 w-full rounded-xl shadow-sm" />
        ))}
      </div>
    </div>
  );
}
