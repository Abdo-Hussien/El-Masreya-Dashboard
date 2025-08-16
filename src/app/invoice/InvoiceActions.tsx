"use client"

import Button from "@/components/ui/button"
import { InvoiceContext } from "@/store/invoice-context"
import { Loader } from "@/components/ui/loader"
import { useContext } from "react"

const InvoiceActions = () => {
    const { createInvoice, isCreatingInvoice, resetForm } = useContext(InvoiceContext)
    return (
        <div id="inv-main-actions">
            <div data-component="button-group" className="flex flex-wrap-reverse gap-4 align-top justify-end">
                <Button onClick={resetForm} variant="outline">ابدأ من جديد</Button>
                <Button onClick={createInvoice} disabled={isCreatingInvoice}>
                    {isCreatingInvoice ? <><Loader size={16} color="white" /> &nbsp; جاري الإنشاء...</>
                        : <>إنشاء فاتورة</>
                    }
                </Button>
            </div>
        </div>
    )
}

export default InvoiceActions