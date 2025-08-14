"use client"

import { useState, useEffect, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Combobox, { ComboboxItem } from "@/components/ui/combobox"
import axios, { AxiosError } from "axios"
import { InvoiceStatus } from "@/interfaces/InvoiceStatus"
import { Customer } from "@/interfaces/Customer"

async function fetchData<T>(url: string, cancelToken: AbortSignal): Promise<T> {
    const response = await axios.get<T>(url, { signal: cancelToken })
    return response.data
}

// ----------------------
// Types
// ----------------------
type ComboboxItemMapper<T> = (data: T) => ComboboxItem<number>[]

function useFetchComboboxItems<T>(url: string, mapper: ComboboxItemMapper<T>) {
    const [items, setItems] = useState<ComboboxItem<number>[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true)
                setError(null)
                const rawData = await fetchData<T>(url, controller.signal)
                setItems(mapper(rawData))
            } catch (err) {
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    const message = err instanceof AxiosError ? err.message : "Unknown error"
                    setError(message)
                    console.error(`Failed to fetch from ${url}:`, err)
                }
            } finally {
                setLoading(false)
            }
        })()

        return () => controller.abort()
    }, [mapper, url])

    return { items, loading, error }
}

export default function InvoiceFields() {
    const comboWidth = "w-[calc(50%-0.5rem)] lg:w-[calc(33%-0.75rem)]"
    const [selectedCustomer, setSelectedCustomer] = useState<ComboboxItem<number>>()
    const [selectedStatus, setSelectedStatus] = useState<ComboboxItem<number>>()

    const mapCustomers = useCallback(
        (res: { data: Customer[] }) =>
            res.data.map((c) => ({
                label: c.name,
                value: c.id,
            })),
        []
    )

    const mapStatuses = useCallback(
        (res: { data: InvoiceStatus[] }) =>
            res.data.map((c) => ({
                label: c.alias,
                value: c.id,
            })),
        []
    )

    const {
        items: customers,
        loading: loadingCustomers,
        error: errorCustomers,
    } = useFetchComboboxItems("/api/customer", mapCustomers)

    const {
        items: statuses,
        loading: loadingStatuses,
        error: errorStatuses,
    } = useFetchComboboxItems("/api/statuses", mapStatuses)

    return (
        <>
            <Checkbox label="سعر جملة" />
            <div className="flex flex-wrap gap-4">
                <Combobox
                    className={comboWidth}
                    placeholder={loadingCustomers ? "جارٍ التحميل..." : "اختر العميل..."}
                    item={selectedCustomer}
                    onSelect={(value: string) => {
                        const selected = customers.find((v) => v.value == Number(value))
                        setSelectedCustomer(selected)
                    }}
                    items={customers}
                    disabled={loadingCustomers || !!errorCustomers}
                />
                <Combobox
                    className={comboWidth}
                    placeholder={loadingStatuses ? "جارٍ التحميل..." : "اختر حالة الفاتورة..."}
                    items={statuses}
                    item={selectedStatus}
                    onSelect={(value: string) => {
                        const selected = statuses.find((v) => v.value == Number(value))
                        setSelectedStatus(selected)
                    }}
                    disabled={loadingStatuses || !!errorStatuses}
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
