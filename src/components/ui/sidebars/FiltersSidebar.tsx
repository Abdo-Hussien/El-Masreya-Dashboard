"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import Button from "@/components/ui/button"
import Combobox, { ComboboxItem } from "@/components/ui/combobox"
import { X, Filter } from "lucide-react"
import Divider from "../divider"

interface FilterSidebarProps {
    open: boolean
    onClose: () => void
}

export default function FiltersSidebar({ open, onClose }: FilterSidebarProps) {
    const [show, setShow] = useState(open)
    const [animateIn, setAnimateIn] = useState(false)
    // const { } = useContext(BooksContext)
    useEffect(() => {
        if (open) {
            setShow(true)
            // wait a tick so initial translate-x-full applies, then animate in
            requestAnimationFrame(() => setAnimateIn(true))
        } else {
            setAnimateIn(false)
            const timeout = setTimeout(() => setShow(false), 300)
            return () => clearTimeout(timeout)
        }
    }, [open])

    if (!show) return null
    const products: ComboboxItem[] = [
        { label: "المنتج 1", value: 0 },
        { label: "المنتج 2", value: 1 },
    ]

    const categories: ComboboxItem[] = [
        { label: "تصنيف 1", value: 0 },
        { label: "تصنيف 2", value: 1 },
    ]

    const barcodes: ComboboxItem[] = [
        { label: "12345", value: 0 },
        { label: "67890", value: 1 },
    ]

    const statuses: ComboboxItem[] = [
        { label: "متوفر", value: 0 },
        { label: "غير متوفر", value: 1 },
    ]

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className={`absolute inset-0  glass bg-gray-200/40 transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"}`} onClick={onClose} />

            {/* Sidebar */}
            <aside className={`relative h-full bg-white shadow-lg flex flex-col transform transition-transform duration-300  ${animateIn ? "translate-x-0" : "translate-x-full"}  w-full sm:w-80`}  >
                {/* Header */}
                <header className="flex items-center gap-2 p-4">
                    <Filter />
                    <h2 className="text-lg font-bold">الفلاتر</h2>
                    <Button className="absolute w-6 h-6 top-1 left-1 rounded-lg p-2" variant="outline" onClick={onClose}><X /></Button>
                </header>
                <Divider />

                {/* Filters */}
                <main className="flex-1 overflow-y-auto p-4 space-y-6">
                    <section>
                        <Label className="mb-3 block">اسم المنتج</Label>
                        <Combobox className="w-full" items={products} placeholder="اختر اسم المنتج" item={undefined} onSelect={function (value: React.SetStateAction<ComboboxItem | undefined>): void {
                            throw new Error("Function not implemented.")
                        }} />
                    </section>
                    <section>
                        <Label className="mb-3 block">التصنيف</Label>
                        <Combobox className="w-full" items={categories} placeholder="حدد التصنيف" item={undefined} onSelect={function (value: React.SetStateAction<ComboboxItem | undefined>): void {
                            throw new Error("Function not implemented.")
                        }} />
                    </section>
                    <section>
                        <Label className="mb-3 block">الباركود</Label>
                        <Combobox className="w-full" items={barcodes} placeholder="ادخل الباركود" item={undefined} onSelect={function (value: React.SetStateAction<ComboboxItem | undefined>): void {
                            throw new Error("Function not implemented.")
                        }} />
                    </section>
                    <section>
                        <Label className="mb-3 block">الحالة</Label>
                        <Combobox className="w-full" items={statuses} placeholder="حالة المنتج" item={undefined} onSelect={function (value: React.SetStateAction<ComboboxItem | undefined>): void {
                            throw new Error("Function not implemented.")
                        }} />
                    </section>
                </main>

                {/* Footer */}
                <footer className="p-4 flex flex-col gap-2">
                    <Button className="w-full" variant="outline">
                        الغاء الفلاتر
                    </Button>
                    <Button className="w-full">حفظ الفلاتر</Button>
                </footer>
            </aside>
        </div>
    )
}
