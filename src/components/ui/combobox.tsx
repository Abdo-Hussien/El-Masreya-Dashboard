'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'

interface ComboboxItem<K = string> {
  label: string
  value: K
}

interface ComboboxProps<T extends ComboboxItem<K>, K = string> {
  items: T[]
  defaultValue?: K
  onSelect?: (value: T) => void
  placeholder?: string
  variant?: VariantProps<typeof comboboxVariants>['variant']
  size?: VariantProps<typeof comboboxVariants>['size']
  className?: string
}

const comboboxVariants = cva(
  "inline-flex items-center max-w-sm cursor-pointer justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 shadow-2xl",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        tonal:
          "bg-primary-foreground/60 text-primary hover:bg-primary-foreground/80",

        ghost: [
          "bg-muted/50 text-inherit hover:bg-muted/100 rounded-xl outline-none shadow-none p-0 px-3",
          "flex text-center disabled:opacity-50"
        ],
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
export function Combobox<T extends ComboboxItem<K>, K = string>({ items, defaultValue, onSelect, placeholder = 'Select item...', variant, size, className }: ComboboxProps<T, K> & VariantProps<typeof comboboxVariants>) {


  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  const selectedItem = items.find((item) => item.value === selectedValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(comboboxVariants({ variant, size, className }), "justify-between")}
          variant={variant}
          role="combobox"
          aria-expanded={open}
        >
          {selectedItem?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={String(item.value)}
                value={String(item.value)}
                onSelect={(currentValue) => {
                  const selected = items.find((i) => i.value === currentValue)
                  if (selected) {
                    setSelectedValue(selected.value)
                    onSelect?.(selected)
                  }
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValue === item.value
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
