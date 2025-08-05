
"use client"
import { parseNumber } from "@/utils/value-formatter"
import Divider from "@/components/ui/divider"
import CardItem from "@/components/ui/cards/CardItem"
import InvoiceActions from "./InvoiceActions"
import InvoiceFields from "./InvoiceFields"
import InvoiceDetailsDataTable from "@/components/ui/data-table/InvoiceDetailsDataTable"
import { useContext, useEffect, useState } from "react"
import { InvoiceContext } from "@/store/invoice-context"
import { db } from "@/lib/DexieDb"

const IndexedDBSync = ({ isSynced, setIsSynced }: { isSynced: boolean, setIsSynced: React.Dispatch<React.SetStateAction<boolean>> }) => {

    useEffect(() => {
        let unsub: any

        (async () => {
            if (typeof window === "undefined") {
                return
            }

            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                unsub = (_changes: any) => {
                    setIsSynced(false)
                    setTimeout(() => setIsSynced(true), 50)
                }

                db.on("changes", unsub)
            } catch (err) {
                console.error("[IndexedDBSync] Failed to load dexie-observable:", err)
            }
        })()
        return () => {
            if (unsub) {
                db.on("changes").unsubscribe(unsub)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
