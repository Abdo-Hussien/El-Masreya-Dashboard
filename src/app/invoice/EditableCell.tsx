"use client"

import { Input } from "@/components/ui/input"
import {
    useEffect,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react"

export interface EditableCellHandle {
    focus: () => void
}

type EditableCellProps<T> = {
    id: string
    initialValue: T
    type?: string
    onChange: (value: T) => void
    formatter?: (value: T) => string
    validate?: (value: T) => boolean
    onAccept?: (value?: T) => void
}

const EditableCell = forwardRef<EditableCellHandle, EditableCellProps<any>>(
    function EditableCell(
        { id, initialValue, onChange, formatter, type = "text", validate, onAccept },
        ref
    ) {
        const [isEditing, setIsEditing] = useState(false)
        const [value, setValue] = useState(initialValue)
        const inputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({
            focus: () => setIsEditing(true),
        }))

        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        useEffect(() => {
            if (isEditing && inputRef.current) {
                inputRef.current.focus()
                inputRef.current.select()
            }
        }, [isEditing])

        const displayValue = formatter ? formatter(value) : value

        const handleSave = (inputValue: any) => {
            const isValid = validate?.(inputValue) ?? true
            if (!isValid) {
                setValue(initialValue)
                return
            }
            onChange(inputValue)
            onAccept?.(inputValue)
            console.log(inputValue)
            setIsEditing(false)
        }

        return isEditing ? (
            <div className="flex justify-center">
                <Input
                    id={id}
                    ref={inputRef}
                    variant="plain"
                    type={type}
                    value={value as unknown as string}
                    onChange={(e) =>
                        setValue(e.target.value as unknown as typeof value)
                    }
                    onBlur={() => handleSave(value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (!value) setValue(initialValue)
                            e.currentTarget.blur()
                        }
                        if (e.key === "Escape") {
                            setValue(initialValue)
                            setIsEditing(false)
                        }
                    }}
                />
            </div>
        ) : (
            <div
                className="cursor-text text-center"
                onDoubleClick={() => setIsEditing(true)}
            >
                {displayValue as string}
            </div>
        )
    }
)

export default EditableCell
