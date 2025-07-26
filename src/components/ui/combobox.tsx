
'use client'

import { useState } from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import Button from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'

export interface ComboboxItem<K = string> {
  label: string
  value: K
}

interface ComboboxProps<T = ComboboxItem<string>> {
  id?: string
  items: T[]
  onSelect?: (value: T) => void
  // onBlur?: () => void
  placeholder?: string
  variant?: VariantProps<typeof comboboxVariants>['variant']
  className?: string
}

const comboboxVariants = cva(
  "flex h-9 px-4 py-2 has-[>svg]:px-3 w-fit justify-between cursor-pointer whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "border bg-background shadow-xs text-muted-foreground hover:border-ring hover:ring-ring/5 hover:ring-[3px] dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        tonal: "bg-primary-foreground/60 text-primary hover:bg-primary-foreground/80",
        ghost: [
          "bg-muted/50 text-inherit hover:bg-muted/100 shadow-none",
          "text-center disabled:opacity-50"
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Combobox = (props: ComboboxProps<ComboboxItem>) => {

  const { id, items, onSelect } = props
  const { placeholder = "Select an item", variant = "default", className } = props

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
        <Button id={id} componentVariants={comboboxVariants({ variant, className }) as VariantProps<typeof comboboxVariants>} variant={variant} role="combobox" aria-expanded={open}>
          {selectedItem?.label || placeholder}
          <ChevronsUpDown className="h-2 w-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
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