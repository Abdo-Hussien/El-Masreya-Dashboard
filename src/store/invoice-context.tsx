import { createContext, useMemo, useState } from "react"
import { useInvoiceDetails } from "@/components/hooks/useInvoiceDetails"
import { useInvoiceFields } from "@/components/hooks/useInvoiceFields"
import axios from "axios"
import { Toast } from "@/utils/toast"
import { InvoiceContextType } from "./types/invoice"

const InvoiceContext = createContext<InvoiceContextType>({} as InvoiceContextType)

export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {
    const { invoiceDetails, isDexieLoading, addRow, updateRow, deleteRow, resetForm, updateCell, getNumOfBooks, summaryFields, execute } = useInvoiceDetails()
    const { selectedCustomer, selectedStatus, setSelectedCustomer, setSelectedStatus } = useInvoiceFields()
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)

    const createInvoice = async () => {
        const amount_refunded =
            summaryFields.amountPaid > summaryFields.finalTotal
                ? summaryFields.amountPaid - summaryFields.finalTotal
                : 0

        const payload = {
            invoice: {
                customer_id: selectedCustomer?.value,
                amount_paid: summaryFields.amountPaid,
                amount_refunded,
                discount: summaryFields.sale,
                status_id: selectedStatus?.value,
                override_is_wholesale: undefined
            },
            inv_details: invoiceDetails.map((detail) => ({
                book_id: detail.book_id,
                quantity: detail.quantity,
                price: detail.unitPrice || undefined,
                discount: detail.sale
            }))
        }

        console.log("Creating invoice with payload:", payload)

        try {
            setIsCreatingInvoice(true)
            const res = await axios.post("/api/invoice", payload)
            console.log("Invoice created successfully:", res.data)

            resetForm() // Reset the form after creating the invoice
            setSelectedCustomer(undefined) // Clear selected customer
            setSelectedStatus({ label: "لم يتم التحاسب", value: 1 }) // Clear selected status

            await Toast.fire({ icon: "success", title: res.data.message })
        } catch (err: any) {
            console.error("Failed to create invoice:", err)
            const { message: title } = err.response?.data
            Toast.fire({ icon: "error", title })
        }
        setIsCreatingInvoice(false)
    }

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

        createInvoice,
        isCreatingInvoice,

        // Fields for the invoice form
        selectedCustomer,
        selectedStatus,
        setSelectedCustomer,
        setSelectedStatus
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [invoiceDetails, isDexieLoading, summaryFields, addRow, updateRow, deleteRow, updateCell, resetForm, getNumOfBooks, selectedCustomer, selectedStatus, setSelectedCustomer, setSelectedStatus, isCreatingInvoice, setIsCreatingInvoice])

    return (
        <InvoiceContext.Provider value={contextValue}>
            {children}
        </InvoiceContext.Provider>
    )
}

export { InvoiceContext }
