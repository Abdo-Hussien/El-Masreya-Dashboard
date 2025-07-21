"use client"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { Button } from "@/components/ui/button"
import { EditableDataTable } from "@/components/ui/DataTable/editable-data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Plus, MoreHorizontal } from "lucide-react"
import EditableCell from "./EditableCell"
import { EditableCellHandle } from "./EditableCell"
import { useState, useRef } from "react"
import { Combobox } from "@/components/ui/combobox"
import { ColumnDef } from "@tanstack/react-table"

export default function InvoiceDetailsGrid() {
    const [invoiceData, setInvoiceData] = useState<InvoiceDetail[]>([])
    const cellRefs = useRef<Record<string, EditableCellHandle | null>>({})
    const addNewRow = () => {
        setInvoiceData((prev) => {
            const updated = [...prev, new InvoiceDetail()]
            const lastIndex = updated.length - 1
            setTimeout(() => {
                focusOnCellRef("productName", lastIndex.toString())
            }, 0)
            return updated
        })
    }
    const focusOnCellRef = (columnId: string, rowId: string) => {
        const key = `${columnId}-${rowId}`
        cellRefs.current[key]?.focus()
    }

    const setCellRefs = (columnId: string, rowId: string) => (el: EditableCellHandle | null) => {
        const key = `${columnId}-${rowId}`
        // console.log("setting ref of ", key)
        cellRefs.current[key] = el
    }
    const removeRow = (index: number) => setInvoiceData((prev) => prev.filter((_, i) => { return i !== index }))

    const columns: ColumnDef<InvoiceDetail>[] = [
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
                        initialValue={value}
                        ref={setCellRefs(column.id, row.id)}
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
                        ref={setCellRefs(column.id, row.id)}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                        validate={(val) => true}
                        onAccept={() => focusOnCellRef("quantity", row.id)}
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
                            ref={setCellRefs(column.id, row.id)}
                            onChange={(newValue: number) => {
                                (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                            }}
                            formatter={(val) => new Intl.NumberFormat("ar-EG").format(val)}
                            type="number"
                            validate={(val) => true}
                            onAccept={() => focusOnCellRef("unitPrice", row.id)}
                        />
                    </>
                )
            },
        },
        // For currency column
        {
            accessorKey: "unitPrice",
            header: () => <div className="text-center">الفئة</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        ref={setCellRefs(column.id, row.id)}
                        initialValue={value}
                        onChange={(newValue: number) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                        }}
                        formatter={(val) => new Intl.NumberFormat("ar-EG", {
                            style: "currency",
                            currency: "EGP",
                        }).format(val)}
                        type="number"
                        validate={(val) => true}
                        onAccept={() => {
                            console.log("cellsRef: ", cellRefs)
                            focusOnCellRef("sale", row.id)
                        }}
                    />
                );
            },
        },
        {
            accessorKey: "sale",
            header: () => <div className="text-center">الخصم</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return (
                    <EditableCell
                        id={`${column.id}-${row.id}`}
                        initialValue={value}
                        ref={setCellRefs(column.id, row.id)}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = parseFloat(newValue);
                        }}
                        formatter={(val) => {
                            const num = Number(val)
                            return new Intl.NumberFormat("ar-EG", {
                                style: "currency",
                                currency: "EGP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(num)
                        }}
                        type="number"
                        validate={(val) => true}
                        onAccept={() => focusOnCellRef("total", row.id)}
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
                        className="font-medium"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        المجموع
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return <EditableCell
                    id={`${column.id}-${row.id}`}
                    initialValue={value}
                    ref={setCellRefs(column.id, row.id)}
                    onChange={(newValue: string) => {
                        (row.original[column.id as keyof InvoiceDetail] as number) = parseFloat(newValue);
                    }}
                    formatter={(val) => {
                        const num = Number(val)
                        return new Intl.NumberFormat("ar-EG", {
                            style: "currency",
                            currency: "EGP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(num)
                    }}
                ></EditableCell>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => (
                <div className="text-right">
                    <Button onClick={addNewRow}>
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
    const testItems = [{ value: 'react', label: 'React', }, { value: 'vue', label: 'Vue', }]
    return (
        <>
            <Combobox variant="ghost" size="sm" items={testItems} onSelect={(v) => console.log(v)} placeholder="اختر منتج" />
            <EditableDataTable
                columns={columns}
                data={invoiceData}
                filterColumnIds={["productName", "notes"]}
            />
        </>
    )
}