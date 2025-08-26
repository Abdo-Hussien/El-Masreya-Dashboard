"use client"

import { Book } from "@/types/Book"
import { ColumnDef } from "@tanstack/react-table"
import Button from "../button"
import { ChevronsUpDown } from "lucide-react"
import ReadonlyDataTable from "./variants/ReadonlyDataTable"
import { useContext } from "react"
import { BooksContext } from "@/store/book-context"
import { InvoiceDetail } from "@/classes/InvoiceDetail"
import { InvoiceContext } from "@/store/invoice-context"

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
            header: ({ column }) => (
                <Button variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    فئة
                    <ChevronsUpDown />
                </Button>
            ),
            cell: ({ getValue }) => {
                const unitPrice = getValue() as number
                return <div className="capitalize">{unitPrice}</div>
            },
            enableSorting: true,
        },
        {
            accessorKey: "price", // with discount
            header: ({ column }) => (
                <Button variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    السعر
                    <ChevronsUpDown />
                </Button>
            ),
            cell: ({ getValue }) => {
                const price = getValue() as number
                return <div className="lowercase">{price}</div>
            },
            enableSorting: true,
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
