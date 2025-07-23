/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import Combobox from "@/components/ui/combobox"

type EditableCellProps = {
    id: string
    selectedItem: string
    items: string[]
    onChange: (value: string) => void
}


const EditableComboboxCell = ({ id, items, selectedItem, onChange }: EditableCellProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [selectedValue, setSelectedValue] = useState(selectedItem)
    const [committedValue, setCommittedValue] = useState(selectedItem)

    const save = (next: typeof selectedValue, apply: boolean = true) => {
        if (!apply) setSelectedValue(committedValue)
        else {
            setCommittedValue(next)
            onChange(next)
        }

        setIsEditing(false)
    }

    return isEditing ? (
        <div className="flex justify-center">
            <Combobox variant="ghost" size="sm"
                id={id}
                items={items.map((item) => ({ label: item, value: item }))}
                onSelect={({ label }) => { save(label, true) }}
                placeholder="اختر منتج">
            </Combobox>
        </div>
    ) : (
        <div className="cursor-pointer text-center"
            onDoubleClick={(e) => {
                e.preventDefault()
                setIsEditing(true)
            }}>
            {committedValue}
        </div>
    )
}


export default EditableComboboxCell
