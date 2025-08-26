"use client"

import { useCallback, useContext } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Combobox, { ComboboxItem } from "@/components/ui/combobox"
import { InvoiceStatus } from "@/interfaces/InvoiceStatus"
import { Customer } from "@/interfaces/Customer"
import { useFetch } from "@/components/hooks/useFetch"
import { InvoiceContext } from "@/store/invoice-context"

type ComboboxItemMapper<T> = (data: T) => ComboboxItem<number>[]

function useFetchComboboxItems<T>(url: string, mapper: ComboboxItemMapper<T>) {
    const { data, loading, error } = useFetch<T>(url)
    const items = data ? mapper(data) : []
    return { items, loading, error }
}


export default function InvoiceFields() {
    const comboWidth = "w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.75rem)]"
    const { selectedCustomer, selectedStatus, setSelectedCustomer, setSelectedStatus } = useContext(InvoiceContext)
    const mapCustomers = useCallback(
        (res: { data: Customer[] }) => {
            return res.data.map((c) => ({ label: c.name, value: c.id, }))
        }, []
    )

    const mapStatuses = useCallback(
        (res: { data: InvoiceStatus[] }) => {
            return res.data.map((c) => ({ label: c.alias, value: Number(c.id), }))
        }, []
    )

    const {
        items: customers,
        loading: loadingCustomers,
        error: errorCustomers,
    } = useFetchComboboxItems<{ data: Customer[] }>("/api/customer", mapCustomers)

    const {
        items: statuses,
        loading: loadingStatuses,
        error: errorStatuses,
    } = useFetchComboboxItems<{ data: InvoiceStatus[] }>("/api/invoice/status", mapStatuses)
    return (
        <>
            <Checkbox label="سعر جملة" />
            <div className="flex flex-wrap gap-4">
                <Combobox
                    item={selectedCustomer}
                    items={customers}
                    onSelect={setSelectedCustomer}
                    className={comboWidth}
                    placeholder={loadingCustomers ? "جارٍ التحميل..." : "اختر العميل"}
                />
                <Combobox
                    item={selectedStatus}
                    items={statuses}
                    onSelect={() => setSelectedStatus}
                    className={comboWidth}
                    placeholder={loadingStatuses ? "جارٍ التحميل..." : "اختر حالة الفاتورة"}
                />
            </div>

            {(errorCustomers || errorStatuses) && (
                <div className="text-red-500 text-sm">
                    {errorCustomers && <p>خطأ في تحميل العملاء: {errorCustomers}</p>}
                    {errorStatuses && <p>خطأ في تحميل الحالات: {errorStatuses}</p>}
                </div>
            )}
        </>
    )
}
