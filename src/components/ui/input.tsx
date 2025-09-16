"use client"
import * as React from "react"
import { cn } from "@/lib/Utils"
import { CircleX } from "lucide-react"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "plain"
  prependIcon?: React.ReactNode
  appendIcon?: React.ReactNode
  clearable?: boolean
}

function Input({
  className,
  variant = "default",
  prependIcon,
  appendIcon,
  clearable = false,
  value,
  onChange,
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClear = () => {
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const showClear =
    clearable && typeof value === "string" && value.length > 0

  return (
    <div className="relative flex items-center">
      {prependIcon && !clearable && (
        <span className="absolute left-3 text-muted-foreground">
          {prependIcon}
        </span>
      )}

      {clearable && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute left-3 text-muted-foreground/60 hover:text-foreground transition-opacity duration-300",
            showClear ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <CircleX size={16} />
        </button>
      )}

      <input
        ref={inputRef}
        value={value}
        data-slot="input"
        className={cn(
          variant === "default" && [
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
            "dark:bg-input/30 border-input w-full h-9 min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/3 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            prependIcon ? "pl-3" : "px-3",
            (appendIcon || clearable) ? "pr-3" : "px-3",
          ],
          variant === "plain" && [
            "bg-muted/50 text-inherit rounded-md outline-none shadow-none",
            "h-8 text-center disabled:opacity-50",
          ],
          className
        )}
        onChange={onChange}
        {...props}
      />

      {appendIcon && (
        <span className="absolute right-3 text-muted-foreground">
          {appendIcon}
        </span>
      )}
    </div>
  )
}

export { Input }
