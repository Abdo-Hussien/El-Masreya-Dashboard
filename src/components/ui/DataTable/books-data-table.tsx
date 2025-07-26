"use client"

import { Book } from "@/types/book"
import { ColumnDef } from "@tanstack/react-table"
import Button from "../button"
import ReadonlyDataTable from "./readonly-data-table"

const data: Book[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
]


const BooksQuickFilters = () => {
    return (
        <>
            <Button variant="link">
                مسح الفلاتر
            </Button>
            <Button variant="outline">
                فلاتر أخرى
            </Button>
        </>
    )
}

export default function BooksDataTable() {

    const columns: ColumnDef<Book>[] = [
        {
            accessorKey: "bookTitle",
            header: () => "السلعة",
            cell: ({ row }) => {
                const bookTitle = Number(row.getValue("bookTitle"))
                return <div className="text-right font-medium">{bookTitle}</div>
            },
        },
        {
            accessorKey: "unitPrice",
            header: "فئة",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("unitPrice")}</div>
            ),
        },
        {
            accessorKey: "price", //with discount

            header: 'السعر',
            cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
        },
        {
            accessorKey: "unitsInStock",
            header: () => "العدد في المخزن",
            cell: ({ row }) => {
                const quantityInStock = Number(row.getValue("unitsInStock"))

                return <div className="text-right font-medium">{quantityInStock}</div>
            },
        },
        {
            accessorKey: "quantityPerPack",
            header: () => "القطع",
            cell: ({ row }) => {
                const quantityPerPack = Number(row.getValue("quantityPerPack"))
                return <div className="text-right font-medium">{quantityPerPack}</div>
            },
        }
    ]
    return (
        <>
            <ReadonlyDataTable data={data} columns={columns} quickFilters={<BooksQuickFilters />} />
        </>
    )
}



// SELECT Books.BookID, Books.UnitsInstock AS عدد, Books.QuantityPerPack AS القطع, Books.DisplayName AS السلعة, Round((1-[Books]![Discount1])*[Books]![UnitPrice],2) AS السعر, Books.UnitPrice AS الفئة, [ItemTypes]![SequenceNo] & "." & [Books]![OrderingCode] AS الكود, ItemTypes.SequenceNo, Books.OrderingCode, Nz([Books].[BarCode],0) AS باركود, Books.CategoryID
// FROM (ItemTypes RIGHT JOIN Books ON ItemTypes.ItemTypeId = Books.ItemType) LEFT JOIN CategoryProduct ON Books.BookID = CategoryProduct.ProductID
// WHERE (((Books.DisplayName) Like "*" & [Forms]![Invoice]![BookID2] & "*") AND ((Nz([Books].[BarCode],0))=Nz([Forms]![Invoice]![BarCode],Nz([Books].[BarCode],0))) AND ((ItemTypes.ItemType)=Nz([Forms]![Invoice]![ItemType],[ItemTypes]![ItemType])) AND ((ItemTypes.Active)=True) AND ((Books.State)=Nz([Forms]![Invoice]![BookStatus],1)))
// ORDER BY ItemTypes.SequenceNo, Books.OrderingCode;

