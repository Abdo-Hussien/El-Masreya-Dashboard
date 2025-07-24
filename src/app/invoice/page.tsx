"use client"

// import useGrid from "@/components/hooks/useGrid"
// import CustomersSelect from "./customers-select"
import InvoiceForm from "./invoice-form"

export default function InvoicePage() {
    // const { createInvoice, gridError, handleStateChange, tableState } = useGrid()
    return (
        <div className="p-4 flex flex-col gap-2 min-h-screen bg-gradient-to-b from-white to-gray-50 bg-no-repeat antialiased">
            <InvoiceForm />
        </div>
    );
}
