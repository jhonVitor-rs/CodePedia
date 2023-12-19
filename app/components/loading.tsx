import { Skeleton } from "./ui/skeleton";

export function Loading() {
  return (
    <div className="flex flex-col w-full gap-4 p-2 items-center">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="flex flex-col w-full p-2 gap-2 bg-primary/70 rounded-md">
          <div className="flex flex-col w-full p-2 gap-2 bg-primary-foreground/70 rounded-md">
            <Skeleton className="w-full h-10 rounded-full bg-primary-foreground/90"/>
            <Skeleton className="w-40 h-8 rounded-full bg-primary-foreground/90"/>
          </div>
          <Skeleton className="w-full h-12 rounded-full bg-primary"/>
        </div>
      ))}
    </div>
  );
}