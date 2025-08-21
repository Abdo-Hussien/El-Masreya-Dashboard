"use client"
import CardItem from "@/components/ui/cards/CardItem"
import Divider from "@/components/ui/divider"
import { SummaryLine, SaleSummaryLine, AmountPaidSummaryLine } from "@/components/ui/summary/SummaryLines"
import { InvoiceContext } from "@/store/invoice-context"
import { parsePrice } from "@/utils/value-formatter"
import { Checkbox } from "@/components/ui/checkbox"
import { useContext, useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


type PaymentChoice = "paid" | "ongoing" | ""

export default function InvoiceSummary() {

    const { summaryFields, execute } = useContext(InvoiceContext)
    const { setSelectedStatus } = useContext(InvoiceContext)
    const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("")

    const onRadioChange = (value: PaymentChoice) => {
        setPaymentChoice(value)

        if (value === "paid") {
            execute({ type: "set amount paid", newValue: summaryFields.total })
            setSelectedStatus({ label: "خالص مكتب", value: 4 })
            // amount paid is synced in the effect below to track future total changes
        } else if (value === "ongoing") {
            execute({ type: "set amount paid", newValue: 0 })
            setSelectedStatus({ label: "أضف إلي الرصيد", value: 3 })
            // Optional: if you want to clear amount paid when switching to ongoing, uncomment:
            // execute({ type: "set amount paid", newValue: 0 })
        }
    }

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
                <RadioGroup className="flex my-4 justify-center items-center gap-4" value={paymentChoice} onValueChange={onRadioChange}>
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid">مدفوع</Label>

                    <Divider vertical />

                    <RadioGroupItem value="ongoing" id="ongoing" />
                    <Label htmlFor="ongoing">حساب جاري</Label>
                </RadioGroup>
            </div>
        </>
    )
}