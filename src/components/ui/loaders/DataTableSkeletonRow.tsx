import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeletonRow() {
    return (
        <div className="flex gap-6 p-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-full" />
        </div>
    )
}
