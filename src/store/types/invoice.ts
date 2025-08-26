import { InvoiceDetail } from "@/classes/InvoiceDetail"
import { ComboboxItem } from "@/components/ui/combobox"
import { SummaryAction } from "@/types/SummaryAction"
import { SummaryFields } from "@/types/SummaryFields"
import { Row, ColumnDef } from "@tanstack/react-table"

export interface InvoiceContextType {
    invoiceDetails: InvoiceDetail[],
    isDexieLoading: boolean
    updateCell: (newValue: any, row: Row<InvoiceDetail>, column: ColumnDef<InvoiceDetail>) => void
    addRow: () => Promise<number>
    updateRow: (rowId: number, updatedRow: InvoiceDetail) => void
    deleteRow: (rowId: number) => void
    resetForm: () => void
    getNumOfBooks: () => number
    summaryFields: SummaryFields
    execute: React.Dispatch<SummaryAction>

    // Creates invoice with the current state
    createInvoice: () => any
    isCreatingInvoice: boolean

    // Fields for the invoice form
    selectedCustomer: ComboboxItem | undefined
    selectedStatus: ComboboxItem | undefined
    setSelectedCustomer: React.Dispatch<React.SetStateAction<ComboboxItem | undefined>>
    setSelectedStatus: React.Dispatch<React.SetStateAction<ComboboxItem | undefined>>
}