"use client"
import CardItem from "@/components/ui/cards/CardItem"
import Divider from "@/components/ui/divider"
import { SummaryLine, SaleSummaryLine, AmountPaidSummaryLine } from "@/components/ui/summary/SummaryLines"
import { InvoiceContext } from "@/store/invoice-context"
import { parsePrice } from "@/utils/value-formatter"
import { Checkbox } from "@/components/ui/checkbox"
import { useContext, useState, useEffect } from "react"

export default function InvoiceSummary() {

    const { summaryFields, execute } = useContext(InvoiceContext)
    const { setSelectedStatus } = useContext(InvoiceContext)
    const [isPaid, setIsPaid] = useState(false)

    const isPaidCheckbox = (value: boolean) => {
        setIsPaid(value)
    }

    // This `useEffect` callback activates two times in a row
    useEffect(() => {
        // console.log("From useEffect: ")
        if (isPaid) execute({ type: "set amount paid", newValue: summaryFields.total })
    },
        [execute, isPaid, summaryFields.total])


    return (
        <>
            <div className={`flex flex-col rounded-2xl p-4 transition-all duration-300 ease-in-out`}>
                <CardItem title="الإجماليات" subtitle="تفحص الإجماليات" className="items-center justify-center" />
                <div className="flex py-4 h-full justify-center flex-col items-center gap-2">

                    <SummaryLine label="المجموع" formatter={parsePrice} value={summaryFields.subTotal} />
                    <SaleSummaryLine />
                    <SummaryLine label="صافي المجموع" formatter={parsePrice} value={summaryFields.total} />
                    <AmountPaidSummaryLine />
                    <SummaryLine label="المجموع النهائي" formatter={parsePrice} value={summaryFields.finalTotal} valueStyle="font-bold" />

                </div>
                <div className="flex my-4 justify-center items-center gap-4 h-6">
                    <Checkbox className="font-medium" label="مدفوع" onCheckedChange={isPaidCheckbox} />
                    <Divider vertical />
                    <Checkbox className="font-medium" label="حساب جاري" onCheckedChange={(value) => {
                        if (value) setSelectedStatus({ label: "أضف إلي الرصيد", value: 3 })
                    }} />
                </div>
            </div>
        </>
    )
}