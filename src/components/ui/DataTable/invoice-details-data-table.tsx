/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./editable-data-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import EditableInputCell from "@/app/invoice/editable-input-cell"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
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
                <CheckboxBox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <CheckboxBox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
        },
        // barcode column
        {
            accessorKey: "barcode",
            header: "الباركود",
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
            header: "اسم المنتج",
            cell: ({ row, column }) => {
                return <p>Hello</p>
            },
        },
        // quantity column
        {
            accessorKey: "quantity",
            header: "العدد",
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number
                return (
                    <>
                        <EditableInputCell
                            id={`${column.id}-${row.id}`}
                            type="number"
                            initialValue={value}
                            onChange={(newValue: number) => { }}
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
            header: "الفئة",
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableInputCell
                        id={`${column.id}-${row.id}`}
                        type="number"
                        initialValue={value}
                        onChange={(newValue: number) => { }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                    />
                );
            },
        },
        // sale column
        {
            accessorKey: "sale",
            header: "الخصم",
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return (
                    <EditableInputCell
                        id={`${column.id}-${row.id}`}
                        type="number"
                        initialValue={value}
                        onChange={(newValue: string) => { }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                    />
                );
            },
        },
        // total column
        {
            accessorKey: "total",
            header: "المجموع",
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return <EditableInputCell
                    id={`${column.id}-${row.id}`}
                    type="number"
                    initialValue={value}
                    onChange={(newValue: string) => { }}
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
