import * as React from "react";
import { cn } from "@/lib/Utils";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "plain";
}

function Input({ className, variant = "default", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(
        variant === "default" && [
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/5 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        ],
        variant === "plain" && [
          "bg-muted/50 text-inherit rounded-md outline-none shadow-none",
          "h-8 text-center disabled:opacity-50"
        ],
        className
      )}
      {...props}
    />
  );
}

export { Input };
