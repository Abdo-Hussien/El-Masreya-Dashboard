
"use client"

import { Dispatch, forwardRef, SetStateAction, useEffect, useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/Utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import Button from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { Mode } from "@/types/Mode"

export interface ComboboxItem<K = number> {
  label: string
  value: K
}

export type OnSelectEvent = Dispatch<SetStateAction<ComboboxItem | undefined>>

interface ComboboxProps {
  item: ComboboxItem | undefined
  items: ComboboxItem[]
  mode?: Mode
  onSelect: OnSelectEvent
  handleOnBlur?: () => void
  placeholder?: string
  variant?: VariantProps<typeof comboboxVariants>['variant']
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


export default forwardRef<HTMLButtonElement, Omit<React.ComponentProps<typeof CommandPrimitive.Item>, 'onSelect' | 'ref'> & ComboboxProps>(
  function Combobox({
    item,
    items,
    mode,
    id,
    onSelect,
    handleOnBlur,
    placeholder = "Select an item",
    variant = "default",
    className,
    ...props
  },
    ref) {

    const [open, setOpen] = useState<boolean>(false)

    function handleOnSelect(value: string) {
      setOpen(false)

      if (!onSelect) return
      const selectedItem = items.find((i) => i.value === Number(value))
      onSelect(selectedItem)
    }

    const onOpenChange = (open: boolean) => {
      setOpen(open)
      handleOnBlur?.()
    }


    useEffect(() => {
      if (mode == "read") setOpen(false)
      else if (mode == "write") setOpen(true)
    }, [mode, setOpen])

    const componentVariants = comboboxVariants({ variant, className }) as VariantProps<typeof comboboxVariants>
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button id={id} ref={ref} componentVariants={componentVariants} role="combobox" aria-expanded={open}>
            {item?.label || <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="h-2 w-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full lg:w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup className="overflow-y-auto max-h-52">
              {items.map((it) => {
                const value = it.value.toString()
                return (
                  <CommandItem key={value} value={value} onSelect={handleOnSelect} {...props}>
                    <Check className={cn('mr-2 h-4 w-4', item?.value === it.value ? 'opacity-100' : 'opacity-0')} />
                    {it.label}
                  </CommandItem>
                )
              }
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  })