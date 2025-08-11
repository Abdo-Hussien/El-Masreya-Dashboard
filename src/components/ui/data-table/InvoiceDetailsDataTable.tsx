
"use client"

import { ColumnDef, Getter, Row, Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./variants/EditableDataTable"
import { InvoiceDetail } from "@/classes/InvoiceDetail"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { parseNumber, parsePrice } from "@/utils/value-formatter"
import EditableInputCell from "@/components/ui/cells/EditableInputCell"
import { useContext, useRef } from "react"
import EditableComboboxCell from "@/components/ui/cells/EditableComboboxCell"
import { ComboboxItem } from "../combobox"
import { CellHandler } from "@/types/CellHandler"
import { InvoiceContext } from "@/store/invoice-context"
import { BooksContext } from "@/store/book-context"
import { Badge } from "../badge"
import { DataTableSkeletonRow } from "../loaders/DataTableSkeletonRow"

type CellRendererProps = {
    row: Row<InvoiceDetail>,
    column: ColumnDef<InvoiceDetail>,
    table: Table<InvoiceDetail>
    getValue: Getter<unknown>
}

/**
* A generic callback for updating cell values
*/
type UpdateCallback<T> = (newValue: T) => void

/**
* Formatter type for parsing/formatting values
* 
* For example, you would call `parseNumber()` or `parseDate()` 
*/
type FormatterFunction = (value: number | string) => string

export default function InvoiceDetailsDataTable() {
    const { books } = useContext(BooksContext)
    const { invoiceDetails, addRow, updateRow, deleteRow, updateCell, isDexieLoading } = useContext(InvoiceContext)
    const cellRefs = useRef<Map<string, CellHandler>>(new Map())

    if (isDexieLoading) {
        return (
            <div className="divide-y">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <DataTableSkeletonRow key={idx} />
                ))}
            </div>
        )
    }
    const setCellRef = (id: string, node: CellHandler | null) => {
        if (node) {
            cellRefs.current.set(id, node)
        }
        else {
            cellRefs.current.delete(id)
        }
    }

    const focusCell = (id: string) => {
        cellRefs.current.get(id)?.activateEditor()
    }

    // ---------- Input Cell Renderer ----------

    function inputCellRenderer(
        { row, column, getValue, table }: CellRendererProps,
        cellToFocusOn: string,
        formatter: FormatterFunction,
        maxInputSize: number,
        updateCallback?: UpdateCallback<number>
    ) {
        const id = `${column.id}-${row.id}`
        const value = Number(getValue())

        // Accept new value: either via callback or default update
        const onAccepted = (newValue: number) => {
            // console.log(id, typeof newValue)
            if (typeof updateCallback === "function") {
                updateCallback(newValue)
            } else {
                updateCell(newValue, row, column)
            }
            const isLastRowBarcode =
                cellToFocusOn.includes("barcode") &&
                cellToFocusOn.includes(`${table.getRowModel().rows.length}`)

            if (isLastRowBarcode) {
                addRow();
            }
            setTimeout(() => requestAnimationFrame(() => focusCell(cellToFocusOn)), 800)
        }

        const validate = (newValue: number): boolean => {
            const asNumber = newValue
            return Number.isFinite(asNumber) && asNumber >= 0 && asNumber <= maxInputSize
        }

        return (
            <EditableInputCell
                id={id}
                ref={(node: any) => setCellRef(id, node)}
                initialValue={value}
                onValueAccepted={onAccepted}
                validate={validate}
                formatter={formatter}
            />
        )
    }

    // ---------- Combobox Cell Renderer ----------

    function comboboxCellRenderer(
        { row, column, getValue, table }: CellRendererProps,
        items: ComboboxItem[],
        cellToFocusOn: string
    ) {
        const id = `${column.id}-${row.id}`
        const currentLabel = String(getValue())
        const selected = items.find((item) => item.label === currentLabel)

        const onAccepted = (newValue: ComboboxItem) => {
            const selectedBook = books.find(
                (b) => String(b.barcode) === String(newValue.value)
            )

            if (!selectedBook) return

            const { barcode: barcode, bookTitle, price } = selectedBook
            const invoiceDetail = new InvoiceDetail(barcode, bookTitle, price)

            updateRow(row.original.id!, invoiceDetail)

            const isLastRowBarcode =
                cellToFocusOn.includes("barcode") &&
                cellToFocusOn.includes(`${table.getRowModel().rows.length}`)

            if (isLastRowBarcode) {
                addRow();
            }
            // console.log(cellRefs, cellToFocusOn)
            setTimeout(() => requestAnimationFrame(() => focusCell(cellToFocusOn)), 800)
        }

        return (
            <EditableComboboxCell
                id={id}
                ref={(node: any) => setCellRef(id, node)}
                item={selected}
                items={items}
                onValueAccepted={onAccepted}
            />
        )
    }

    // ---------- Column Definitions ----------

    const columns: ColumnDef<InvoiceDetail>[] = [
        // select column

        {
            id: "select",
            enableSorting: false,
            enableHiding: false,
            header: ({ table }) => {
                const selectedRows = table.getSelectedRowModel().rows

                return (
                    <div className="flex items-center gap-2">
                        <CheckboxBox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                            }
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />

                        {selectedRows.length > 0 && (
                            <Badge
                                variant="destructive"
                                className="h-5 min-w-5 rounded-full px-1 tabular-nums"
                                onClick={() => {
                                    selectedRows.forEach((row) => deleteRow(row.original.id!))
                                    table.resetRowSelection()
                                }}>
                                <Trash2 className="h-3 w-3" />
                                <span>-&thinsp;{parseNumber(selectedRows.length)}</span>
                            </Badge>
                        )}
                    </div>
                )
            },
            cell: ({ row }) => (
                <CheckboxBox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
        },

        // barcode column
        {
            accessorKey: "barcode",
            header: "الباركود",
            cell: (props) => {
                const items: ComboboxItem[] = books.map((b) => ({
                    label: b.barcode,
                    value: b.barcode,
                }))
                return comboboxCellRenderer(props, items, `barcode-${Number(props.row.id) + 1}`)
            },
        },

        // book title column
        {
            accessorKey: "bookTitle",
            header: "اسم المنتج",
            cell: (props) => {
                const items: ComboboxItem[] = books.map((b) => ({
                    label: b.bookTitle,
                    value: b.barcode,
                }))
                return comboboxCellRenderer(props, items, `quantity-${props.row.id}`)
            },
        },

        // quantity column
        {
            accessorKey: "quantity",
            header: "العدد",
            cell: (props) => {
                const onUpdate: UpdateCallback<number> = (newValue) => {
                    const { sale, unitPrice } = props.row.original
                    const newTotal = newValue * unitPrice - sale
                    updateRow(props.row.original.id!, {
                        ...props.row.original,
                        quantity: newValue,
                        total: newTotal,
                    })
                }
                return inputCellRenderer(props, `barcode-${Number(props.row.id) + 1}`, parseNumber, 500, onUpdate)
            },
        },

        // unit price column
        {
            accessorKey: "unitPrice",
            header: "الفئة",
            cell: (props) => {
                const onUpdate: UpdateCallback<number> = (newValue) => {
                    const { sale, quantity } = props.row.original
                    const newTotal = quantity * newValue - sale
                    updateRow(props.row.original.id!, {
                        ...props.row.original,
                        unitPrice: newValue,
                        total: newTotal,
                    })
                }
                return inputCellRenderer(props, `sale-${props.row.id}`, parsePrice, 10000, onUpdate)
            },
        },

        // sale column
        {
            accessorKey: "sale",
            header: "الخصم",
            cell: (props) => {
                const onUpdate: UpdateCallback<number> = (newValue) => {
                    const { quantity, unitPrice } = props.row.original
                    const newTotal = quantity * unitPrice - newValue
                    updateRow(props.row.original.id!, {
                        ...props.row.original,
                        sale: newValue,
                        total: newTotal,
                    })
                }
                return inputCellRenderer(props, `total-${props.row.id}`, parsePrice, 500, onUpdate)
            },
        },

        // total column
        {
            accessorKey: "total",
            header: "المجموع",
            cell: (props) => inputCellRenderer(props, `none-${props.row.id}`, parsePrice, 500000),
        },

        // actions column
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button onClick={() => deleteRow(row.original.id!)} className="active:text-red-500 active:bg-red-50" variant="ghost">
                        <Trash2 />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <EditableDataTable data={invoiceDetails} columns={columns} />
        </>
    )
}
