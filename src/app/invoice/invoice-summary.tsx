"use client"

import { useState } from "react"
import SummaryDialog from "@/components/ui/dialogs/summary-dialog"

export default function InvoiceSummary() {
    const [isSummaryOpen, setSummaryOpen] = useState<boolean>(false)


    const openSummary = () => setSummaryOpen(true)
    const closeSummary = () => setSummaryOpen(false)
    return (
        <>
            <div data-component="overlay" className="fixed inset-0 z-50 pointer-events-none">
                <div onClick={openSummary} className="absolute flex vertical-text px-6 py-1 transition-all duration-200 top-1/2 pointer-events-auto rounded-l-2xl right-0 transform -translate-y-1/2 cursor-pointer border border-gray-900 bg-[linear-gradient(to_top_right,_#111827,_#2C3444,_#111827,_#2C3444)]" >
                    <caption className="text-shadow-white text-muted/90 hover:text-white">الإجماليات</caption>
                </div>
            </div>

            <SummaryDialog isOpen={isSummaryOpen} onClose={closeSummary} />
        </>
    )
}
