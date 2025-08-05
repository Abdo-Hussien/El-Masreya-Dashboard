"use client"

import Button from "@/components/ui/button"
import { InvoiceContext } from "@/store/invoice-context"
import { useContext } from "react"

const InvoiceActions = () => {
    const { resetForm } = useContext(InvoiceContext)
    return (
        <div id="inv-main-actions">
            <div data-component="button-group" className="flex flex-wrap-reverse gap-4 align-top justify-end">
                <Button onClick={resetForm} variant="outline">ابدأ من جديد</Button>
                <Button>إنشاء فاتورة</Button>
            </div>
        </div>
    )
}

export default InvoiceActions