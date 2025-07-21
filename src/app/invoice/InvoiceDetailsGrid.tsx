"use client"

import { InvoiceDetail } from "@/classes/invoice-detail";
import { Button } from "@/components/ui/button";
import { EditableDataTable } from "@/components/ui/DataTable/editable-data-table";
import { EColumnDef } from "@/types/extended-column-defs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Plus, MoreHorizontal } from "lucide-react";
import EditableCell from "./EditableCell";
import { useEffect, useLayoutEffect, useState } from "react";

import { useRef } from "react";
import { EditableCellHandle } from "./EditableCell";

export default function InvoiceDetailsGrid() {
    const [invoiceData, setInvoiceData] = useState<InvoiceDetail[]>([
        new InvoiceDetail("1234567890123", "منتج 1", 2, 50, 100, 0.1),
        new InvoiceDetail("2345678901234", "منتج 2", 1, 75, 75, 0.2),
        new InvoiceDetail("3456789012345", "منتج 3", 3, 30, 90, 0.15),
    ])
    const cellRefs = useRef<Record<string, EditableCellHandle | null>>({});
    const pendingFocusRef = useRef<string | null>(null);
    const addNewRow = () => {
        setInvoiceData((prev) => {
            const updated = [...prev, new InvoiceDetail()];
            const lastIndex = updated.length;
            pendingFocusRef.current = `productName-${lastIndex - 1}`;
            return updated;
        });
    };

    useEffect(() => {
        const key = pendingFocusRef.current;
        console.log(key)
        if (key && cellRefs.current[key]) {
            cellRefs.current[key]?.focus();
            pendingFocusRef.current = null;
        }
    }, [invoiceData.length]);



    const removeRow = (index: number) => setInvoiceData((prev) => prev.filter((_, i) => { return i !== index }))


    const columns: EColumnDef<InvoiceDetail>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "barcode",
            header: () => <div className="text-center">البار كود</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as string;
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        ref={(el) => (cellRefs.current[row.index] = el)}
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                );
            },
        },
        {
            accessorKey: "productName",
            header: () => <div className="text-center">اسم المنتج</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as string;
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        initialValue={value}
                        ref={(el) => (cellRefs.current[row.index] = el)}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                )
            },
        },
        // For quantity column
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">العدد</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <>
                        <EditableCell
                            id={`${column.id}-${row.id}`}
                            initialValue={value}
                            onChange={(newValue: number) => {
                                (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                            }}
                            formatter={(val) => new Intl.NumberFormat("ar-EG").format(val)}
                        />
                    </>
                );
            },
        },

        // For currency column
        {
            accessorKey: "unitPrice",
            header: () => <div className="text-center">السعر</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        ref={(el) => (cellRefs.current[row.index] = el)}
                        initialValue={value}
                        onChange={(newValue: number) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                        }}
                        formatter={(val) => new Intl.NumberFormat("ar-EG", {
                            style: "currency",
                            currency: "EGP",
                        }).format(val)}
                    />
                );
            },
        },
        {
            accessorKey: "ratio",
            header: () => <div className="text-center">النسبة</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = parseFloat(newValue);
                        }}
                        formatter={(val) => {
                            const num = Number(val)
                            return new Intl.NumberFormat("ar-EG", {
                                style: "percent",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(num)
                        }}
                    />
                );
            },
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        المجموع
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total"));
                const formatted = new Intl.NumberFormat("ar-EG", {
                    style: "currency",
                    currency: "EGP",
                }).format(amount);
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => (
                <div className="text-right">
                    <Button className="rounded-sm" onClick={addNewRow}>
                        <Plus />
                    </Button>
                </div>
            ),
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
        <EditableDataTable
            columns={columns}
            data={invoiceData}
            filterColumnIds={["productName", "notes"]}
        />)
}