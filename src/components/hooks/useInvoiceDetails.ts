import { useState, useReducer, useEffect, useCallback } from "react"
import { Row, ColumnDef } from "@tanstack/react-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { SummaryFields, SummaryFieldsBuilder } from "@/types/summary-fields"
import { SummaryAction } from "@/types/summary-action"
import { db } from "@/lib/indexed-db"

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

export function useInvoiceDetails() {
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([])
    const [isDexieLoading, setIsDexieLoading] = useState(true)

    const initialSummaryFields = new SummaryFieldsBuilder()
        .setSubTotal(0)
        .setSale(0)
        .setAmountPaid(0)
        .build()

    const [summaryFields, execute] = useReducer(summaryReducer, initialSummaryFields)

    // Load invoices from IndexedDB when mounted
    useEffect(() => {
        const loadFromDexie = async () => {
            setIsDexieLoading(true)
            const all = await db.invoiceDetails.toArray();
            if (all.length > 0) {
                setInvoiceDetails(all);
            } else {
                const id = await db.invoiceDetails.add(new InvoiceDetail());
                const row = await db.invoiceDetails.get(id);
                setInvoiceDetails(row ? [row] : []);
            }
            setIsDexieLoading(false)
        };
        loadFromDexie()
    }, [])

    // Update totals when invoiceDetails change
    useEffect(() => {
        execute({ type: "recalculate totals", invoiceDetails })
    }, [invoiceDetails])

    const addRow = useCallback(async () => {
        const newRow = new InvoiceDetail()
        const id = await db.invoiceDetails.add(newRow)
        setInvoiceDetails((prev) => [...prev, { ...newRow, id }])
    }, [])

    const updateRow = useCallback(async (rowId: number, updatedRow: InvoiceDetail) => {
        await db.invoiceDetails.update(rowId, updatedRow)
        setInvoiceDetails((prev) =>
            prev.map((inv) => (inv.id === rowId ? { ...updatedRow, id: rowId } : inv))
        )
    }, [])

    const deleteRow = useCallback(async (rowId: number) => {
        await db.invoiceDetails.delete(rowId)
        setInvoiceDetails((prev) => prev.filter((inv) => inv.id !== rowId))
    }, [])

    const resetForm = useCallback(async () => {
        await db.invoiceDetails.clear();
        const id = await db.invoiceDetails.add(new InvoiceDetail());
        const row = await db.invoiceDetails.get(id);
        setInvoiceDetails(row ? [row] : []);
        execute({ type: "reset" });
    }, []);

    const updateCell = useCallback(
        async (newValue: any, row: Row<InvoiceDetail>, column: ColumnDef<InvoiceDetail>) => {
            const rowId = row.original.id
            if (!rowId) return

            const updatedRow = { ...row.original, [column.id as string]: newValue }
            await db.invoiceDetails.update(rowId, updatedRow)

            setInvoiceDetails((old) =>
                old.map((r, i) => (i === row.index ? { ...updatedRow, id: rowId } : r))
            )
        },
        []
    )

    const getNumOfBooks = useCallback(
        () =>
            invoiceDetails
                .filter((detail) => detail.barcode || detail.bookTitle)
                .map((detail) => Number(detail?.quantity) || 0)
                .reduce((acc, quantity) => acc + quantity, 0),
        [invoiceDetails]
    )

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
        isDexieLoading,
    }
}
