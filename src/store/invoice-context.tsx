import { createContext, useMemo } from "react"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { SummaryFields } from "@/types/summary-fields"
import { SummaryAction } from "@/types/summary-action"
import { ColumnDef, Row } from "@tanstack/react-table"
import { useInvoiceDetails } from "@/components/hooks/useInvoiceDetails"

type InvoiceContextType = {
    invoiceDetails: InvoiceDetail[],
    isDexieLoading: boolean
    updateCell: (newValue: any, row: Row<InvoiceDetail>, column: ColumnDef<InvoiceDetail>) => void
    addRow: () => void
    updateRow: (rowId: number, updatedRow: InvoiceDetail) => void
    deleteRow: (rowId: number) => void
    resetForm: () => void
    getNumOfBooks: () => number
    summaryFields: SummaryFields
    execute: React.Dispatch<SummaryAction>
}

const InvoiceContext = createContext<InvoiceContextType>({} as InvoiceContextType)

export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {
    const { invoiceDetails, isDexieLoading, addRow, updateRow, deleteRow, resetForm, updateCell, getNumOfBooks, summaryFields, execute } = useInvoiceDetails()

    const contextValue = useMemo(() => ({
        invoiceDetails,
        isDexieLoading,
        addRow,
        updateRow,
        deleteRow,
        updateCell,
        resetForm,
        getNumOfBooks,
        summaryFields,
        execute,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [invoiceDetails, isDexieLoading, summaryFields, addRow, updateRow, deleteRow, updateCell, resetForm, getNumOfBooks])

    return (
        <InvoiceContext.Provider value={contextValue}>
            {children}
        </InvoiceContext.Provider>
    )
}

export { InvoiceContext }
