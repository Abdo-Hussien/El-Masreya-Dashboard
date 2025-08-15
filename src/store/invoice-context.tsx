import { createContext, useMemo } from "react"
import { InvoiceDetail } from "@/classes/InvoiceDetail"
import { SummaryFields } from "@/types/SummaryFields"
import { SummaryAction } from "@/types/SummaryAction"
import { ColumnDef, Row } from "@tanstack/react-table"
import { useInvoiceDetails } from "@/components/hooks/useInvoiceDetails"
import { useInvoiceFields } from "@/components/hooks/useInvoiceFields"
import { ComboboxItem } from "@/components/ui/combobox"

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

    // Fields for the invoice form
    selectedCustomer: ComboboxItem | undefined
    selectedStatus: ComboboxItem | undefined
    setSelectedCustomer: React.Dispatch<React.SetStateAction<ComboboxItem | undefined>>
    setSelectedStatus: React.Dispatch<React.SetStateAction<ComboboxItem | undefined>>
}

const InvoiceContext = createContext<InvoiceContextType>({} as InvoiceContextType)

export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {
    const { invoiceDetails, isDexieLoading, addRow, updateRow, deleteRow, resetForm, updateCell, getNumOfBooks, summaryFields, execute } = useInvoiceDetails()
    const { selectedCustomer, selectedStatus, setSelectedCustomer, setSelectedStatus } = useInvoiceFields()
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

        // Fields for the invoice form
        selectedCustomer,
        selectedStatus,
        setSelectedCustomer,
        setSelectedStatus
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [invoiceDetails, isDexieLoading, summaryFields, addRow, updateRow, deleteRow, updateCell, resetForm, getNumOfBooks, selectedCustomer, selectedStatus, setSelectedCustomer, setSelectedStatus])

    return (
        <InvoiceContext.Provider value={contextValue}>
            {children}
        </InvoiceContext.Provider>
    )
}

export { InvoiceContext }
