"use client"

import { Book } from "@/types/Book"
import { ColumnDef } from "@tanstack/react-table"
import Button from "../button"
import ReadonlyDataTable from "./variants/ReadonlyDataTable"
import { useContext } from "react"
import { BooksContext } from "@/store/book-context"


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
            <ReadonlyDataTable data={books} columns={columns} quickFilters={<BooksQuickFilters />} />
        </>
    )
}



// SELECT Books.BookID, Books.UnitsInstock AS عدد, Books.QuantityPerPack AS القطع, Books.DisplayName AS السلعة, Round((1-[Books]![Discount1])*[Books]![UnitPrice],2) AS السعر, Books.UnitPrice AS الفئة, [ItemTypes]![SequenceNo] & "." & [Books]![OrderingCode] AS الكود, ItemTypes.SequenceNo, Books.OrderingCode, Nz([Books].[BarCode],0) AS باركود, Books.CategoryID
// FROM (ItemTypes RIGHT JOIN Books ON ItemTypes.ItemTypeId = Books.ItemType) LEFT JOIN CategoryProduct ON Books.BookID = CategoryProduct.ProductID
// WHERE (((Books.DisplayName) Like "*" & [Forms]![Invoice]![BookID2] & "*") AND ((Nz([Books].[BarCode],0))=Nz([Forms]![Invoice]![BarCode],Nz([Books].[BarCode],0))) AND ((ItemTypes.ItemType)=Nz([Forms]![Invoice]![ItemType],[ItemTypes]![ItemType])) AND ((ItemTypes.Active)=True) AND ((Books.State)=Nz([Forms]![Invoice]![BookStatus],1)))
// ORDER BY ItemTypes.SequenceNo, Books.OrderingCode;

