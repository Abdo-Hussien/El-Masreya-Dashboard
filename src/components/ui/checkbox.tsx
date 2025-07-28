"use client"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

export function Checkbox({ label, id, className, ...props }: { label?: string } & React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <div className="flex items-center space-x-2">
            <CheckboxBox id={id} {...props} />
            <Label className={cn(className, "font-normal")} htmlFor={id}>{label}</Label>
        </div>
    )
}