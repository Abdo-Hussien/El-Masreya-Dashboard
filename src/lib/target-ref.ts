import { InputCellHandler } from "@/types/cell-handler"
import { RefObject } from "react"

export const targetRef = (cellRefs: RefObject<Record<string, InputCellHandler | null>>) => {

    const focusOnCellRef = (columnId: string, rowId: string) => {
        const key = `${columnId}-${rowId}`
        if (!cellRefs.current[key]) {
            console.warn(`Cell ref not found for ${key}`)
            return
        }
        cellRefs.current[key].activateEditor()
    }

    const setCellRefs = (columnId: string, rowId: string) => (el: InputCellHandler | null) => {
        const key = `${columnId}-${rowId}`
        cellRefs.current[key] = el
    }

    return {
        focusOnCellRef,
        setCellRefs
    }
}