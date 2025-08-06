
"use client"
import { parseNumber } from "@/utils/value-formatter"
import Divider from "@/components/ui/divider"
import CardItem from "@/components/ui/cards/CardItem"
import InvoiceActions from "./InvoiceActions"
import InvoiceFields from "./InvoiceFields"
import InvoiceDetailsDataTable from "@/components/ui/data-table/InvoiceDetailsDataTable"
import { useContext, useEffect, useState } from "react"
import { InvoiceContext } from "@/store/invoice-context"
import { getDb } from "@/lib/DexieDb"
import axios from "axios"
import { ComboboxItem } from "@/components/ui/combobox"

const IndexedDBSync = ({ isSynced, setIsSynced }: { isSynced: boolean, setIsSynced: React.Dispatch<React.SetStateAction<boolean>> }) => {

    useEffect(() => {
        if (typeof window === "undefined") return

        let unsub: any

        getDb().then((db) => {
            unsub = (_changes: any) => {
                setIsSynced(false)
                setTimeout(() => setIsSynced(true), 50)
            }
            db?.on("changes", unsub)
        })

        return () => {
            if (unsub) {
                getDb().then((db) => db?.on("changes").unsubscribe(unsub))
            }
        }
    }, [])



    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSynced ? "bg-green-500" : "bg-gray-500"}`} />
            <span className="text-sm"> {isSynced ? "المعلومات محفوظة" : "جاري الحفظ..."} </span>
        </div>
    )
}

export default function InvoiceForm() {
    const [isSynced, setIsSynced] = useState(true)
    const { getNumOfBooks } = useContext(InvoiceContext)
    const [customers, setCustomers] = useState<ComboboxItem[]>([])

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("/api/customer")
                console.log(response.data)

                const mappedCustomers = (response.data.data as any[]).map((customer: any) => ({ label: customer.CustomerName, value: customer.CustomerID }))
                setCustomers(mappedCustomers || [])
            } catch (err) {
                console.error("Failed to fetch customers:", err)
            }
        }

        fetchCustomers()
    }, [])


    return (
        <div id="inv_form" className="flex flex-col grow bg-white rounded-xl border">

            <div className="flex flex-col grow basis-1/6 space-y-12 p-4">
                <div id="inv-title-actions" className="flex">
                    <CardItem id="inv-text" title="نموذج الفاتورة" subtitle={<IndexedDBSync isSynced={isSynced} setIsSynced={setIsSynced} />}>
                        <span className="font-bold text-sm">{`${parseNumber(getNumOfBooks())} كتب`}</span>
                    </CardItem>
                    <InvoiceActions />
                </div>
                <div id="inv_info" className="flex flex-col justify-end gap-4">
                    <InvoiceFields customers={customers} invoiceStatuses={[]} />
                </div>
            </div>

            <Divider />

            <div id="body" className="flex flex-col grow-[8] basis-5/6">
                <InvoiceDetailsDataTable />
            </div>
        </div>
    )
}
