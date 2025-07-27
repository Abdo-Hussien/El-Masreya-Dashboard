"use client"

import { useState } from "react"
import { X, TicketPercent, Banknote } from "lucide-react"
import Button from "@/components/ui/button"
import CardItem from "@/components/ui/cards/card-item"
import Divider from "@/components/ui/divider"
import { useFormatter } from "@/utils/value-formatter"
import { cn } from "@/lib/utils"


type SaleFormat = 'percentage' | 'number'

const SummaryLine = ({ label, value, editable, action, labelStyle, valueStyle }: {
    label: string,
    value: any,
    editable?: boolean,
    labelStyle?: string,
    valueStyle?: string,
    action?: React.ReactNode,
}) => {
    return (
        <div className="flex gap-4 overflow-hidden items-center">
            <p className={cn("flex whitespace-nowrap", labelStyle)}>
                {label}
                &nbsp;
                {action}
            </p>
            <Divider />
            <p className={cn(valueStyle)}>
                {value}
            </p>
        </div>


    )
}

const SaleFormatIcon = () => {
    const [saleFormat, setSaleFormat] = useState<SaleFormat>('percentage')
    return (
        <div className="cursor-pointer">
            {saleFormat == 'percentage' ?
                <TicketPercent onClick={() => setSaleFormat('number')} className="text-red-700" /> :
                <Banknote onClick={() => setSaleFormat('percentage')} className="text-red-700" />
            }
        </div>
    )
}


export default function InvoiceSummary() {
    const { parsePrice, parseNumber } = useFormatter()
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

            <div data-component="overlay" className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100/40 transition-all duration-300 ease-in-out ${isSummaryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} >
                <div className={`relative flex flex-col mx-4 w-lg min-w-[300px] bg-white rounded-2xl border-4 border-gray-300/50 p-4 transition-all duration-300 ease-in-out ${isSummaryOpen ? 'scale-100' : 'scale-90'}`}>
                    <Button className="absolute w-6 h-6 top-1 left-1 rounded-lg p-2" variant="outline" onClick={closeSummary}><X /></Button>
                    <CardItem title="الإجماليات" subtitle="تفحص الإجماليات" />
                    <div className="flex py-4 flex-col gap-2">
                        <SummaryLine label="المجموع" value={parsePrice(350)} />
                        <SummaryLine editable label="الخصم" value={`%${parseNumber(2)}`} valueStyle="text-red-700" action={<SaleFormatIcon />} />
                        <SummaryLine label="صافي المجموع" value={`${parsePrice(312)}`} />
                        <SummaryLine editable label="قيمة المدفوع" value={`${parsePrice(126)}`} valueStyle="text-green-800" />
                        <SummaryLine label="المجموع النهائي" value={`${parsePrice(176)}`} valueStyle="font-bold" />
                    </div>
                    <Button className="block rounded-lg" >إنشاء فاتورة</Button>
                </div>
            </div>
        </>
    )
}
