"use client"

import { useState, useEffect, useContext } from "react"
import { Label } from "@/components/ui/label"
import Button from "@/components/ui/button"
import Combobox from "@/components/ui/combobox"
import { X, Filter } from "lucide-react"
import Divider from "../divider"
import { BooksContext } from "@/store/book-context"
import { CategoriesContext } from "@/store/category-context"

interface FilterSidebarProps {
    open: boolean
    onClose: () => void
}

export default function FiltersSidebar({ open, onClose }: FilterSidebarProps) {
    const [show, setShow] = useState(open)
    const [animateIn, setAnimateIn] = useState(false)
    const { booksFilters, bookStatuses, comboBooksTitles, comboBooksBarcodes, originalBooks, applyFilters, setFilters, clearFilters, setBooks } = useContext(BooksContext)

    const { categories } = useContext(CategoriesContext)
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


    const saveFilters = () => {
        const result = applyFilters()
        setBooks(result)
        onClose()
    }

    const removeFilters = () => {
        clearFilters()
        setBooks(originalBooks)
        onClose()
    }

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
                        <Combobox
                            className="w-full"
                            items={comboBooksTitles}
                            placeholder="اختر اسم المنتج"
                            item={booksFilters?.item_name}
                            onSelect={(val) =>
                                setFilters({ ...booksFilters, item_name: val })
                            }
                        />
                    </section>
                    <section>
                        <Label className="mb-3 block">التصنيف</Label>
                        <Combobox
                            className="w-full"
                            items={categories}
                            placeholder="حدد التصنيف"
                            item={booksFilters?.category}
                            onSelect={(val) =>
                                setFilters({ ...booksFilters, category: val })
                            }
                        />
                    </section>
                    <section>
                        <Label className="mb-3 block">الباركود</Label>
                        <Combobox
                            className="w-full"
                            items={comboBooksBarcodes}
                            placeholder="ادخل الباركود"
                            item={booksFilters?.barcode}
                            onSelect={(val) =>
                                setFilters({ ...booksFilters, barcode: val })
                            }
                        />
                    </section>
                    <section>
                        <Label className="mb-3 block">الحالة</Label>
                        <Combobox
                            className="w-full"
                            items={bookStatuses}
                            placeholder="حالة المنتج"
                            item={booksFilters?.status}
                            onSelect={(val) =>
                                setFilters({ ...booksFilters, status: val })
                            }
                        />
                    </section>
                </main>

                {/* Footer */}
                <footer className="p-4 flex flex-col gap-2">
                    <Button className="w-full" variant="outline" onClick={removeFilters}>
                        الغاء الفلاتر
                    </Button>
                    <Button className="w-full" onClick={saveFilters}>
                        حفظ الفلاتر
                    </Button>
                </footer>
            </aside>
        </div>
    )
}
