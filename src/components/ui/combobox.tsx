
'use client'

import { useState } from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'

export interface ComboboxItem<K = string> {
  label: string
  value: K
}

interface ComboboxProps<T = ComboboxItem<string>> {
  id: string
  items: T[]
  onSelect?: (value: T) => void
  // onBlur?: () => void
  placeholder?: string
  variant?: VariantProps<typeof comboboxVariants>['variant']
  size?: VariantProps<typeof comboboxVariants>['size']
  className?: string
}

const comboboxVariants = cva(
  "inline-flex items-center max-w-sm cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
          "bg-muted/50 text-inherit hover:bg-muted/100 rounded-md outline-none shadow-none p-0 px-3",
          "flex text-center disabled:opacity-50"
        ],
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Combobox = (props: ComboboxProps<ComboboxItem>) => {

  const { id, items, onSelect } = props
  const { placeholder = "Select an item", variant = "default", size = "default", className } = props

  const [open, setOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedValue] = useState<ComboboxItem>({ label: "", value: "" })

  const applyOnSelect = (selectedValue: string) => {
    const selected = items.find((i) => i.value === selectedValue)
    if (selected) {
      setSelectedValue(selected)
      onSelect?.(selected)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} className={cn(comboboxVariants({ variant, size, className }))} variant={variant} role="combobox" aria-expanded={open}>
          {selectedItem?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-2 w-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <CommandItem key={String(item.value)} value={`${item.value}`} onSelect={applyOnSelect}>
                <Check className={cn('mr-2 h-4 w-4', selectedItem.value === item.value ? 'opacity-100' : 'opacity-0')} />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox