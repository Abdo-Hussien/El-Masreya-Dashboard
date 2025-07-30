"use client"
import { X } from "lucide-react"
import Button from "../button"
import CardItem from "../cards/card-item"
import { useContext, useEffect, useState } from "react"
import { useFormatter } from "@/utils/value-formatter"
import { SaleFormat } from "@/types/sale-format"
import { SummaryLine, SaleSummaryLine, AmountPaidSummaryLine } from "../summary/summary-lines"
import { InvoiceContext } from "@/store/invoice-context"
import { Checkbox } from "@/components/ui/checkbox"
import Divider from "../divider"


export default function SummaryDialog({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: () => void
}) {
    const { summaryFields, execute } = useContext(InvoiceContext)
    const { parsePrice } = useFormatter()
    const [saleFormat, setSaleFormat] = useState<SaleFormat>('percentage')

    const [isPaid, setIsPaid] = useState(false)

    const isPaidCheckbox = (value: boolean) => {
        setIsPaid(value)
    }

    // This `useEffect` callback activates two times in a row
    useEffect(() => {
        console.log("From useEffect: ")
        if (isPaid) execute({ type: "set amount paid", newValue: summaryFields.total, saleFormat, })
    },
        [execute, isPaid, saleFormat, summaryFields.total])


    return (
        <div data-component="overlay" className={`fixed inset-0 z-50 flex justify-center items-center glass bg-gray-200/40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} >
            <div className={`relative flex flex-col mx-4 w-lg min-w-[300px] bg-white rounded-2xl border-4 border-gray-300/50 p-4 transition-all duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-90'}`}>
                <Button className="absolute w-6 h-6 top-1 left-1 rounded-lg p-2" variant="outline" onClick={onClose}><X /></Button>
                <CardItem title="الإجماليات" subtitle="تفحص الإجماليات" />
                <div className="flex py-4 flex-col gap-2">

                    <SummaryLine label="المجموع" formatter={parsePrice} value={summaryFields.subTotal} />
                    <SaleSummaryLine format={saleFormat} setFormat={setSaleFormat} value={summaryFields.sale} onChange={execute} />
                    <SummaryLine label="صافي المجموع" formatter={parsePrice} value={summaryFields.total} />
                    <AmountPaidSummaryLine format={saleFormat} value={summaryFields.amountPaid} onChange={execute} />
                    <SummaryLine label="المجموع النهائي" formatter={parsePrice} value={summaryFields.finalTotal} valueStyle="font-bold" />

                </div>
                <div className="flex my-4 justify-center items-center gap-4 h-6">
                    <Checkbox className="font-medium" label="مدفوع" onCheckedChange={isPaidCheckbox} />
                    <Divider vertical />
                    <Checkbox className="font-medium" label="صافي المجموع" />
                </div>
                <Button className="block rounded-lg" >إنشاء فاتورة</Button>
            </div>
        </div>
    )
}