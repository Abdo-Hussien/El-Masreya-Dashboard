"use client"

// import useGrid from "@/components/hooks/useGrid"

import InvoiceForm from "./invoice-form"
import ExtendedItemSearch from "./extended-item-search";
import InvoiceContextProvider from "@/store/invoice-context";
import InvoiceSummary from "./invoice-summary";

export default function InvoicePage() {
    // const { createInvoice, gridError, handleStateChange, tableState } = useGrid()

    // Create custom hook to calculate sub total of all items

    return (
        <InvoiceContextProvider>
            <div className="p-4 flex flex-col gap-2 min-h-screen bg-gradient-to-b from-white to-gray-50 bg-no-repeat antialiased">
                <InvoiceForm />
                <InvoiceSummary />
            </div>
            <ExtendedItemSearch />
        </InvoiceContextProvider>
    );
}
