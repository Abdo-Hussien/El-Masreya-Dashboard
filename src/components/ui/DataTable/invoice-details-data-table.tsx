/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./editable-data-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import EditableInputCell from "@/app/invoice/editable-input-cell"
import { Checkbox } from "@radix-ui/react-checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Skeleton } from "../skeleton"
import { useFormatter } from "@/utils/value-formatter"

const data: InvoiceDetail[] = []


const defaultColumnHeader = (text: string) => {
    return (
        <div className="text-foreground text-center">
            {text}
        </div>
    )
}


export default function InvoiceDetailsDataTable() {

    const { parseNumber, parsePrice } = useFormatter()
    const columns: ColumnDef<InvoiceDetail>[] = [
        // select column
        {
            id: "select",
            enableSorting: false,
            enableHiding: false,
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
        },
        // barcode column
        {
            accessorKey: "barcode",
            header: () => defaultColumnHeader("الباركود"),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as string;
                return (
                    <EditableInputCell
                        id={`${column.id}-${row.id}`}
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                )
            },
        },
        // product name column
        {
            accessorKey: "bookTitle",
            header: () => defaultColumnHeader("اسم المنتج"),
            cell: ({ row, column }) => {
                // if (productsLoading) return (
                //     <div className="flex justify-center">
                //         <Skeleton className="h-6 w-24" />
                //     </div>
                // )
                // const setInvData = (newValue: string) => {
                //     const rowIndex = row.id
                //     const colKey = column.id as keyof InvoiceDetail
                //     const updateMethod = (rowData: any, idx: any) => idx === Number(rowIndex) ? { ...rowData, [colKey]: newValue } : rowData
                //     setInvoiceData((prevData) => prevData.map(updateMethod))
                // }
                return <p>Hello</p>
            },
        },
        // quantity column
        {
            accessorKey: "quantity",
            header: () => defaultColumnHeader("العدد"),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number
                return (
                    <>
                        <EditableInputCell
                            id={`${column.id}-${row.id}`}
                            type="number"
                            initialValue={value}
                            onChange={(newValue: number) => {
                                // const rowIndex = row.index;
                                // const colKey = column.id as keyof InvoiceDetail;

                                // setInvoiceData((prevData) =>
                                //     prevData.map((rowData, idx) =>
                                //         idx === rowIndex
                                //             ? {
                                //                 ...rowData,
                                //                 [colKey]: newValue,
                                //             }
                                //             : rowData
                                //     )
                                // )
                            }}
                            formatter={(val) => String(parseNumber(val))}
                            validate={(val) => true}
                        />
                    </>
                )
            },
        },
        // unit price column
        {
            accessorKey: "unitPrice",
            header: () => defaultColumnHeader("الفئة"),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableInputCell
                        id={`${column.id}-${row.id}`}
                        type="number"
                        initialValue={value}
                        onChange={(newValue: number) => {
                            // const rowIndex = row.index;
                            // const colKey = column.id as keyof InvoiceDetail;

                            // setInvoiceData((prevData) =>
                            //     prevData.map((rowData, idx) =>
                            //         idx === rowIndex
                            //             ? {
                            //                 ...rowData,
                            //                 [colKey]: newValue,
                            //             }
                            //             : rowData
                            //     )
                            // )
                        }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                    />
                );
            },
        },
        // sale column
        {
            accessorKey: "sale",
            header: () => defaultColumnHeader("الخصم"),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return (
                    <EditableInputCell
                        id={`${column.id}-${row.id}`}
                        type="number"
                        initialValue={value}
                        onChange={(newValue: string) => {
                            // const rowIndex = row.index;
                            // const colKey = column.id as keyof InvoiceDetail;

                            // setInvoiceData((prevData) =>
                            //     prevData.map((rowData, idx) =>
                            //         idx === rowIndex
                            //             ? {
                            //                 ...rowData,
                            //                 [colKey]: parseFloat(newValue),
                            //             }
                            //             : rowData
                            //     )
                            // )
                        }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                    />
                );
            },
        },
        // total column
        {
            accessorKey: "total",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        className="text-foreground font-medium"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        المجموع
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return <EditableInputCell
                    id={`${column.id}-${row.id}`}
                    type="number"
                    initialValue={value}
                    onChange={(newValue: string) => {
                        // const rowIndex = row.index;
                        // const colKey = column.id as keyof InvoiceDetail;

                        // setInvoiceData((prevData) =>
                        //     prevData.map((rowData, idx) =>
                        //         idx === rowIndex
                        //             ? {
                        //                 ...rowData,
                        //                 [colKey]: parseFloat(newValue),
                        //             }
                        //             : rowData
                        //     )
                        // );
                    }}
                    formatter={(val) => parsePrice(val)}
                ></EditableInputCell>
            },
        },
        // actions column
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(payment.bookTitle)}
                                >
                                    نسخ اسم المنتج
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    ازالة السطر
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ]
    return (
        <>
            <EditableDataTable data={data} columns={columns} />
        </>
    )
}
