"use client"

import { Checkbox } from "@/components/ui/checkbox";
import Combobox from "@/components/ui/combobox";



export default function InvoiceFields({ customers, invoiceStatuses }:
    { customers: any[], invoiceStatuses: any[] }) {
    const comboWidth = "w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.75rem)]"
    return (
        <>
            <Checkbox label="سعر جملة" />
            <div className="flex flex-wrap gap-4">
                <Combobox className={comboWidth} placeholder="اختر العميل..." items={customers} />
                <Combobox className={comboWidth} placeholder="اختر حالة الفاتورة..." items={invoiceStatuses} />
            </div>
        </>
    )
}