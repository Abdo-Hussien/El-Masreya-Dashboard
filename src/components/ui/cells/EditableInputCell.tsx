
"use client"

import { Input } from "@/components/ui/input"
import { CellHandler } from "@/types/CellHandler"
import { NewEditableCellProps } from "@/types/EditableCellProps"
import { Mode } from "@/types/Mode"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export default forwardRef<CellHandler, Omit<React.ComponentProps<"input">, "ref"> & NewEditableCellProps>(
    function EditableInputCell({ initialValue, onValueAccepted, validate, formatter, ...props }, ref) {
        const [mode, setMode] = useState<Mode>("read")
        const [value, setValue] = useState(initialValue)
        const inputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({
            activateEditor: () => {
                setMode("write")
            }
        }))

        useEffect(() => {
            if (mode === "write") {
                inputRef.current?.focus()
                inputRef.current?.select()
            }
        }, [mode])

        const save = () => {
            if (!validate?.(value)) {
                setValue(initialValue)
                alert("Validation error...")
                return
            }
            onValueAccepted(value)

            setMode("read")
        }

        const onDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault()
            setMode("write")
        }

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))

        // Accept
        const handleOnEnter = save

        // Discard
        const handleOnEscape = () => {
            setValue(initialValue)
            setMode("read")
        }
        const handleOnBlur = handleOnEscape

        const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key == "Enter") handleOnEnter()
            else if (e.key == "Escape") handleOnEscape()
        }

        return mode == "write" ? (
            <div className="flex justify-start">
                <Input ref={inputRef} variant="plain" value={value} onBlur={handleOnBlur} onChange={handleOnChange} onKeyDown={handleOnKeyDown}
                    {...props}
                />
            </div>
        ) : (
            <p className="cursor-pointer" onDoubleClick={onDoubleClick}>
                {formatter?.(value) || value || 'لا يوجد'}
            </p>
        )
    })