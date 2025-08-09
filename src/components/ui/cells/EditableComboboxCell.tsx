
"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Command as CommandPrimitive } from "cmdk"
import Combobox, { ComboboxItem } from "@/components/ui/combobox"
import { Mode } from "@/types/Mode"
import { NewEditableCellProps } from "@/types/EditableCellProps"
import { CellHandler } from "@/types/CellHandler"

type EditableComboboxCellProps = NewEditableCellProps & {
    item?: ComboboxItem
    items: ComboboxItem[]
}



export default forwardRef<CellHandler, Omit<React.ComponentProps<typeof CommandPrimitive.Item>, "ref"> & EditableComboboxCellProps>(
    function EditableComboboxCell({ id, item, items, onValueAccepted, ...props }, ref) {
        const [mode, setMode] = useState<Mode>("read")
        const [selectedItem, setSelectedItem] = useState(item)
        const buttonRef = useRef<HTMLButtonElement>(null)

        useImperativeHandle(ref, () => ({
            activateEditor: () => setMode("write")
        }))

        useEffect(() => {
            if (mode === "write") {
                buttonRef.current?.focus()
            }
        }, [mode])

        const onDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault()
            setMode("write")
        }

        // Discard
        const handleOnBlur = () => {
            setSelectedItem(item)
            setMode("read")
        }

        // Accept
        const handleOnSelect = (value: string) => {
            const selected = items.find((v) => v.value == value)
            if (!selected) {
                alert("Internal Error..")
                return
            }

            setSelectedItem(selected)
            onValueAccepted(selected)

            setMode("read")
        }

        return mode == "write" ? (
            <div className="flex justify-start">
                <Combobox id={id} ref={buttonRef} item={selectedItem} items={items} variant="ghost" placeholder="اختر منتج"
                    mode={mode} onSelect={handleOnSelect} handleOnBlur={handleOnBlur} className="w-full"
                    {...props}
                />
            </div>
        ) : (
            <p className="cursor-pointer" onDoubleClick={onDoubleClick}>
                {selectedItem?.label || 'لا يوجد'}
            </p>
        )
    })