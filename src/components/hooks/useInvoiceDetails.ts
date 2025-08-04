import { useState, useReducer, useEffect, useCallback } from "react"
import { Row, ColumnDef } from "@tanstack/react-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { SummaryFields, SummaryFieldsBuilder } from "@/types/summary-fields"
import { SummaryAction } from "@/types/summary-action"

// Reducer for summary calculations
function summaryReducer(state: SummaryFields, action: SummaryAction): SummaryFields {
    const newState = { ...state }

    switch (action.type) {
        case "set sale":
            newState.sale = action.newValue
            break
        case "set amount paid":
            newState.amountPaid = action.newValue
            break
        case "recalculate totals":
            if (action.invoiceDetails) {
                newState.subTotal = action.invoiceDetails
                    .filter((detail) => detail.barcode || detail.bookTitle)
                    .map((detail) => detail.total)
                    .reduce((acc, total) => acc + total, 0)
            }
            break
        case "reset":
            return new SummaryFieldsBuilder()
                .setSubTotal(0)
                .setSale(0)
                .setAmountPaid(0)
                .build()
        default:
            return state
    }

    const total = newState.subTotal - newState.sale
    const finalTotal = total - newState.amountPaid

    return { ...newState, total, finalTotal }
}

// Custom hook for invoice logic
export function useInvoiceDetails() {
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([
        new InvoiceDetail(),
        new InvoiceDetail(),
        new InvoiceDetail()
    ])

    const initialSummaryFields = new SummaryFieldsBuilder()
        .setSubTotal(0)
        .setSale(0)
        .setAmountPaid(0)
        .build()

    const [summaryFields, execute] = useReducer(summaryReducer, initialSummaryFields)

    useEffect(() => {
        execute({ type: "recalculate totals", invoiceDetails })
    }, [invoiceDetails])

    const addRow = useCallback(() => {
        setInvoiceDetails((prev) => [...prev, new InvoiceDetail()])
    }, [])

    const updateRow = useCallback((rowId: number, updatedRow: InvoiceDetail) => {
        setInvoiceDetails((prev) =>
            prev.map((inv) => (inv.id === rowId ? updatedRow : inv))
        )
    }, [])

    const deleteRow = useCallback((rowId: number) => {
        setInvoiceDetails((prev) => prev.filter((inv) => inv.id !== rowId))
    }, [])

    const resetForm = useCallback(() => {
        setInvoiceDetails([])
        execute({ type: "reset" })
    }, [])

    const updateCell = useCallback((
        newValue: any,
        row: Row<InvoiceDetail>,
        column: ColumnDef<InvoiceDetail>
    ) => {
        setInvoiceDetails((old) =>
            old.map((r, i) =>
                i === row.index ? { ...r, [column.id as string]: newValue } : r
            )
        )
    }, [])

    const getNumOfBooks = useCallback(() =>
        invoiceDetails
            .filter((detail) => detail.barcode || detail.bookTitle)
            .map((detail) => Number(detail?.quantity) || 0)
            .reduce((acc, quantity) => acc + quantity, 0)
        , [invoiceDetails])

    return {
        invoiceDetails,
        addRow,
        updateRow,
        deleteRow,
        resetForm,
        updateCell,
        getNumOfBooks,
        summaryFields,
        execute,
    }
}
