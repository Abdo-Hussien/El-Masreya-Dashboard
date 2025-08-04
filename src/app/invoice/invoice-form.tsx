
"use client"
import { useFormatter } from "@/utils/value-formatter"
import Divider from "@/components/ui/divider"
import CardItem from "@/components/ui/cards/card-item"
import InvoiceActions from "./invoice-actions"
import InvoiceFields from "./invoice-fields"
import InvoiceDetailsDataTable from "@/components/ui/data-table/invoice-details-data-table"
import { useContext } from "react"
import { InvoiceContext } from "@/store/invoice-context"


export default function InvoiceForm() {

    const { parseDate, parseNumber } = useFormatter()
    const { getNumOfBooks } = useContext(InvoiceContext)


    const currentDate = parseDate(new Date())
    return (
        <div id="inv_form" className="flex flex-col grow bg-white rounded-xl border">

            <div className="flex flex-col grow basis-1/6 space-y-12 p-4">
                <div id="inv-title-actions" className="flex">
                    <CardItem id="inv-text" title="نموذج الفاتورة" subtitle={currentDate}>
                        <span className="font-bold text-sm">{`${parseNumber(getNumOfBooks())} كتب`}</span>
                    </CardItem>
                    <InvoiceActions />
                </div>
                <div id="inv_info" className="flex flex-col justify-end gap-4">
                    <InvoiceFields customers={[]} invoiceStatuses={[]} />
                </div>
            </div>

            <Divider />

            <div id="body" className="flex flex-col grow-[8] basis-5/6">
                <InvoiceDetailsDataTable />
            </div>
        </div>
    )
}
