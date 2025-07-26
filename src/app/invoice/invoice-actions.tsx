"use client"

import Button from "@/components/ui/button"

const InvoiceActions = () => {
    return (
        <div id="inv-main-actions">
            <div data-component="button-group" className="flex flex-wrap-reverse gap-4 align-top justify-end">
                <Button variant="outline">ابدأ من جديد</Button>
                <Button>إنشاء فاتورة</Button>
            </div>
        </div>
    )
}

export default InvoiceActions