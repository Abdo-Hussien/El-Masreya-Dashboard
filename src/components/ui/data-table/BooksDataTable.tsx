"use client"

import { Book } from "@/types/Book"
import { ColumnDef } from "@tanstack/react-table"
import Button from "../button"
import ReadonlyDataTable from "./variants/ReadonlyDataTable"
import { useContext } from "react"
import { BooksContext } from "@/store/book-context"
import { InvoiceDetail } from "@/classes/InvoiceDetail"
import { InvoiceContext } from "@/store/invoice-context"


const BooksQuickFilters = () => {
    const { setFilterSidebarOpen } = useContext(BooksContext)
    const openSideFilters = () => setFilterSidebarOpen(true)
    return (
        <>
            <Button variant="link">
                مسح الفلاتر
            </Button>
            <Button onClick={openSideFilters} variant="outline">
                فلاتر أخرى
            </Button>
        </>
    )
}

export default function BooksDataTable() {
    const { books } = useContext(BooksContext)
    const { addRow, updateRow } = useContext(InvoiceContext)
    const SelectBook = async (selectedBookId: number) => {
        // get the book id and search for the book 
        const selectedBook = books.find((b) => b.id === selectedBookId)

        if (!selectedBook) return

        const { id, barcode: barcode, bookTitle, price } = selectedBook
        const invoiceDetail = new InvoiceDetail(id, barcode, bookTitle, price)

        const newRowId = await addRow()
        updateRow(newRowId, invoiceDetail)
        // Notify the user with a toast that the row has been added
    }
    const columns: ColumnDef<Book>[] = [
        {
            accessorKey: "bookTitle",
            header: () => "السلعة",
            cell: ({ getValue }) => {
                const bookTitle = getValue() as string
                return <div className="text-right">{bookTitle}</div>
            },
        },
        {
            accessorKey: "wholesalePrice",
            header: "فئة",
            cell: ({ getValue }) => {
                const unitPrice = getValue() as number
                return <div className="capitalize">{unitPrice}</div>
            },
        },
        {
            accessorKey: "price", //with discount
            header: 'السعر',
            cell: ({ getValue }) => {
                const price = getValue() as number
                return <div className="lowercase">{price}</div>
            },
        },
        {
            accessorKey: "unitsAvailable",
            header: () => "العدد في المخزن",
            cell: ({ getValue }) => {
                const quantityInStock = getValue() as number

                return <div className="text-right">{quantityInStock}</div>
            },
        },
        {
            accessorKey: "packSize",
            header: () => "القطع",
            cell: ({ getValue }) => {
                const quantityPerPack = getValue() as number
                return <div className="text-right">{quantityPerPack}</div>
            },
        }
    ]
    return (
        <>
            <ReadonlyDataTable onRowDoubleClick={SelectBook} data={books} columns={columns} quickFilters={<BooksQuickFilters />} />
        </>
    )
}
