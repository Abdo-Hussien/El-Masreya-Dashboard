import { InvoiceDetail } from "@/classes/invoice-detail"
import { SummaryAction } from "@/types/summary-action"
import { SummaryFields, SummaryFieldsBuilder } from "@/types/summary-fields"
import { ColumnDef, Row } from "@tanstack/react-table"
import { createContext, useReducer, useState } from "react"


type InvoiceContextType = {
    invoiceDetails: InvoiceDetail[],
    updateCell: (newValue: any, row: any, column: any) => void,
    addRow: () => void
    updateRow: (rowId: number, updatedRow: InvoiceDetail) => void
    deleteRow: (rowId: number) => void
    summaryFields: SummaryFields
    execute: React.Dispatch<SummaryAction>
}

const InvoiceContext = createContext<InvoiceContextType>({
    invoiceDetails: [],
    updateCell: () => { },
    addRow: () => { },
    updateRow: () => { },
    deleteRow: () => { },
    summaryFields: new SummaryFieldsBuilder().build(),
    execute: () => { }
})


export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {
    const initial = [new InvoiceDetail(), new InvoiceDetail(), new InvoiceDetail()]
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>(initial)
    const addRow = () => {
        setInvoiceDetails((prev) => [...prev, new InvoiceDetail()])
    }

    const updateRow = (rowId: number, updatedRow: InvoiceDetail) => {
        setInvoiceDetails((prev) =>
            prev.map((inv) => (inv.id === rowId ? updatedRow : inv))
        )
    }

    const deleteRow = (rowId: number) => {
        setInvoiceDetails((prev) => prev.filter((inv) => inv.id !== rowId))
    }

    const updateCell = (newValue: any, row: Row<InvoiceDetail>, column: ColumnDef<InvoiceDetail>) => {
        setInvoiceDetails((old) =>
            old.map((r, i) =>
                i === row.index
                    ? { ...r, [column.id as string]: newValue }
                    : r
            )
        )
    }

    const calculateSubTotal = (invoiceDetails: InvoiceDetail[]) =>
        invoiceDetails.map((detail) => detail.total).reduce((acc, total) => acc + total, 0)

    function reducer(state: SummaryFields, action: SummaryAction): SummaryFields {
        let newState: SummaryFields
        switch (action.type) {
            case "set sale":
                newState = { ...state, sale: action.newValue }
                break
            case "set amount paid":
                newState = { ...state, amountPaid: action.newValue }
                break
            case "recalculate totals":
                newState = { ...state }
                break
            default:
                return state
        }

        const total = action.saleFormat === "percentage"
            ? newState.subTotal * (1 - newState.sale / 100)
            : newState.subTotal - newState.sale

        const finalTotal = total - newState.amountPaid
        console.log("newState: ", newState)
        return { ...newState, total, finalTotal }
    }

    const initialFields = new SummaryFieldsBuilder()
        .setSubTotal(calculateSubTotal(invoiceDetails))
        .build()

    const [summaryFields, execute] = useReducer(reducer, initialFields)

    return (
        <InvoiceContext.Provider value={{ invoiceDetails, addRow, updateRow, deleteRow, updateCell, summaryFields, execute }}>
            {children}
        </InvoiceContext.Provider>
    )
}


export { InvoiceContext }