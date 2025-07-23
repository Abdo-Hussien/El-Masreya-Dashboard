/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useRef } from "react"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { InvoiceDetail } from "@/classes/invoice-detail"
import { InputCellHandler } from "@/types/cell-handler"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EditableDataTable } from "@/components/ui/DataTable/editable-data-table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import EditableInputCell from "./editable-input-cell"

import { useFormatter } from "@/utils/value-formatter"
import { ColumnDef } from "@tanstack/react-table"
import { targetRef } from "@/lib/target-ref"
import ProductsComboboxCell from "./products-combobox-cell"
import { useProducts } from "@/components/hooks/useProducts"
import { Skeleton } from "@/components/ui/skeleton"


const defaultColumnHeader = (text: string) => {
    return (
        <div className="text-foreground text-center">
            {text}
        </div>
    )
}

export default function InvoiceDetailsGrid() {
    const { parseNumber, parsePrice } = useFormatter()

    const [invoiceData, setInvoiceData] = useState<InvoiceDetail[]>([])

    const cellRefs = useRef<Record<string, InputCellHandler | null>>({})

    const { focusOnCellRef, setCellRefs } = targetRef(cellRefs)

    const addNewRow = () => {
        setInvoiceData((prev) => {
            const updated = [...prev, new InvoiceDetail()]
            const lastIndex = updated.length - 1
            focusOnCellRef("productName", lastIndex.toString())
            return updated
        })
    }
    const removeRow = (index: number) => setInvoiceData((prev) => prev.filter((_, i) => { return i !== index }))

    const updateRow = (rowId: number, columnId: keyof InvoiceDetail, newValue: string | number) => { }

    const { products, loading: productsLoading } = useProducts()


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
                        ref={setCellRefs(column.id, row.id)}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                )
            },
        },
        // product name column
        {
            accessorKey: "productName",
            header: () => defaultColumnHeader("اسم المنتج"),
            cell: ({ row, column }) => {
                if (productsLoading) return (
                    <div className="flex justify-center">
                        <Skeleton className="h-6 w-24" />
                    </div>
                )
                const setInvData = (newValue: string) => {
                    const rowIndex = row.id
                    const colKey = column.id as keyof InvoiceDetail
                    const updateMethod = (rowData: any, idx: any) => idx === Number(rowIndex) ? { ...rowData, [colKey]: newValue } : rowData
                    setInvoiceData((prevData) => prevData.map(updateMethod))
                }
                return <ProductsComboboxCell row={row} column={column} cellRefs={cellRefs} products={products} setInvoiceData={setInvData} />
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
                            ref={setCellRefs(column.id, row.id)}
                            onChange={(newValue: number) => {
                                const rowIndex = row.index;
                                const colKey = column.id as keyof InvoiceDetail;

                                setInvoiceData((prevData) =>
                                    prevData.map((rowData, idx) =>
                                        idx === rowIndex
                                            ? {
                                                ...rowData,
                                                [colKey]: newValue,
                                            }
                                            : rowData
                                    )
                                )
                            }}
                            formatter={(val) => String(parseNumber(val))}
                            validate={(val) => true}
                            onAccept={() => focusOnCellRef("unitPrice", row.id)}
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
                        ref={setCellRefs(column.id, row.id)}
                        onChange={(newValue: number) => {
                            const rowIndex = row.index;
                            const colKey = column.id as keyof InvoiceDetail;

                            setInvoiceData((prevData) =>
                                prevData.map((rowData, idx) =>
                                    idx === rowIndex
                                        ? {
                                            ...rowData,
                                            [colKey]: newValue,
                                        }
                                        : rowData
                                )
                            )
                        }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                        onAccept={() => focusOnCellRef("sale", row.id)}
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
                        ref={setCellRefs(column.id, row.id)}
                        initialValue={value}
                        onChange={(newValue: string) => {
                            const rowIndex = row.index;
                            const colKey = column.id as keyof InvoiceDetail;

                            setInvoiceData((prevData) =>
                                prevData.map((rowData, idx) =>
                                    idx === rowIndex
                                        ? {
                                            ...rowData,
                                            [colKey]: parseFloat(newValue),
                                        }
                                        : rowData
                                )
                            )
                        }}
                        formatter={(val) => parsePrice(val)}
                        validate={(val) => true}
                        onAccept={() => focusOnCellRef("total", row.id)}
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
                    ref={setCellRefs(column.id, row.id)}
                    onChange={(newValue: string) => {
                        const rowIndex = row.index;
                        const colKey = column.id as keyof InvoiceDetail;

                        setInvoiceData((prevData) =>
                            prevData.map((rowData, idx) =>
                                idx === rowIndex
                                    ? {
                                        ...rowData,
                                        [colKey]: parseFloat(newValue),
                                    }
                                    : rowData
                            )
                        );
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
                                    onClick={() => navigator.clipboard.writeText(payment.productName)}
                                >
                                    نسخ اسم المنتج
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => removeRow(row.index)}
                                >
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
            <EditableDataTable
                columns={columns}
                data={invoiceData}
                addRow={addNewRow}
                filterColumnIds={["productName", "notes"]}
            />
        </>
    )
}
