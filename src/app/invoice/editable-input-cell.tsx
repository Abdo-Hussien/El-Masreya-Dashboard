/* eslint-disable react/display-name */
"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react"
import { InputCellHandler } from "@/types/cell-handler"

type EditableCellProps<T> = {
    id: string
    initialValue: T
    type?: string
    onChange: (value: T) => void
    formatter?: (value: T) => string
    validate?: (value: T) => boolean
    onAccept?: (value: T) => void
}

const EditableInputCell = forwardRef<InputCellHandler, EditableCellProps<any>>(
    ({ id, initialValue, type = "text", onChange, formatter, validate, onAccept }, ref) => {
        const [isEditing, setIsEditing] = useState(false)
        const [value, setValue] = useState(initialValue)
        const [committedValue, setCommittedValue] = useState(initialValue)

        const inputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({
            activateEditor: () => {
                setIsEditing(true)
                setTimeout(() => {
                    inputRef.current?.focus()
                    inputRef.current?.select()
                }, 0)
            },
        }))



        useEffect(() => {
            setValue(initialValue)
            setCommittedValue(initialValue)
        }, [initialValue])

        useEffect(() => {
            if (isEditing && inputRef.current) {
                inputRef.current.focus()
                inputRef.current.select()
            }
        }, [isEditing])

        const save = (next: typeof value, apply: boolean) => {
            const isValid = validate?.(next) ?? true

            if (!apply || !isValid) {
                setValue(committedValue)
            } else {
                setCommittedValue(next)
                onChange(next)
                onAccept?.(next)
            }

            setIsEditing(false)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault()
                save(value, true)
            } else if (e.key === "Escape") {
                e.preventDefault()
                save(value, false)
            }
        }

        return isEditing ? (
            <div className="flex justify-start">
                <Input
                    id={id}
                    ref={inputRef}
                    variant="plain"
                    type={type}
                    value={String(value)}
                    onChange={(e) =>
                        setValue(e.target.value as unknown as typeof value)
                    }
                    onKeyDown={handleKeyDown}
                    onBlur={() => save(value, false)}
                />
            </div>
        ) : (
            <div
                className="cursor-pointer text-right"
                onDoubleClick={(e) => {
                    e.preventDefault()
                    setIsEditing(true)
                }}
            >
                {formatter?.(committedValue) ?? String(committedValue)}
            </div>
        )
    }
)

export default EditableInputCell
