"use client"
import { useContext } from "react"
import { BooksContext } from "@/store/book-context"
import { InvoiceContext } from "@/store/invoice-context"
import { InvoiceDetail } from "@/classes/InvoiceDetail"
import ReadonlyDataTable from "./variants/ReadonlyDataTable"
import { bookColumns } from "./columns/BookColumns"
import Button from "../button"

const BooksQuickFilters = () => {

    const { booksFilters, originalBooks, clearFilters, setBooks, setFilterSidebarOpen } = useContext(BooksContext)
    const removeFilters = () => {
        clearFilters()
        setBooks(originalBooks)
        setFilterSidebarOpen(false)
    }
    const hasFilters = Object.keys(booksFilters).length > 0
    return (
        <>
            <Button onClick={removeFilters} className="relative" variant="link">
                مسح الفلاتر
                {hasFilters && (
                    <div className="absolute top-[-2px] right-[-2px] rounded-4xl w-2 h-2 bg-amber-500" />
                )}
            </Button>

            <Button onClick={() => setFilterSidebarOpen(true)} variant="outline">
                فلاتر أخرى
            </Button>
        </>
    )
}

export default function BooksDataTable() {
    const { books } = useContext(BooksContext)
    const { addRow, updateRow } = useContext(InvoiceContext)

    const SelectBook = async (selectedBookId: number) => {
        const selectedBook = books.find((b) => b.id === selectedBookId)
        if (!selectedBook) return

        const { id, barcode, bookTitle, price } = selectedBook
        const invoiceDetail = new InvoiceDetail(id, barcode, bookTitle, price)

        const newRowId = await addRow()
        updateRow(newRowId, invoiceDetail)
    }

    return (
        <ReadonlyDataTable
            onRowDoubleClick={SelectBook}
            data={books}
            columns={bookColumns}
            quickFilters={<BooksQuickFilters />}
        />
    )
}
