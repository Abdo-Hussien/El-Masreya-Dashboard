
"use client"

import { ColumnDef, Getter, Row } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./variants/editable-data-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { useFormatter } from "@/utils/value-formatter"
import EditableInputCell from "@/components/ui/cells/editable-input-cell"
import { useContext, useRef } from "react"
import EditableComboboxCell from "@/components/ui/cells/editable-combobox-cell"
import { ComboboxItem } from "../combobox"
import { CellHandler } from "@/types/cell-handler"
import { InvoiceContext } from "@/store/invoice-context"
import { Book } from "@/types/book"

type CellRendererProps = {
    row: Row<InvoiceDetail>,
    column: ColumnDef<InvoiceDetail>,
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


    const globalBooks: Book[] = [
        {
            bookTitle: "Book1",
            id: "224253579345",
            price: 400,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        },
        {
            bookTitle: "Book2",
            id: "953579657",
            price: 500,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        },
        {
            bookTitle: "Book3",
            id: "3524253572342",
            price: 237,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        }

    ]
    const { invoiceDetails, updateRow, deleteRow, updateCell } = useContext(InvoiceContext)
    const { parseNumber, parsePrice } = useFormatter()
    const cellRefs = useRef<Map<string, CellHandler>>(new Map())

    const setCellRef = (id: string, node: CellHandler | null) => {
        if (node) {
            cellRefs.current.set(id, node)
        } else {
            cellRefs.current.delete(id)
        }
    }

    const focusCell = (id: string) => {
        cellRefs.current.get(id)?.activateEditor()
    }

    // ---------- Input Cell Renderer ----------

    function inputCellRenderer<T = number>(
        { row, column, getValue }: CellRendererProps,
        cellToFocusOn: string,
        formatter: FormatterFunction,
        maxInputSize: number,
        updateCallback?: UpdateCallback<T>
    ) {
        const id = `${column.id}-${row.id}`
        const value = getValue()

        // Accept new value: either via callback or default update
        const onAccepted = (newValue: T) => {
            if (typeof updateCallback === "function") {
                updateCallback(newValue)
            } else {
                updateCell(newValue, row, column)
            }
            requestAnimationFrame(() => focusCell(cellToFocusOn))
        }

        const validate = (newValue: unknown): boolean => {
            const asNumber = Number(newValue)
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
        { row, column, getValue }: CellRendererProps,
        items: ComboboxItem[],
        cellToFocusOn: string
    ) {
        const id = `${column.id}-${row.id}`
        const currentLabel = getValue()
        const selected = items.find((item) => item.label === currentLabel)

        const onAccepted = (newValue: ComboboxItem) => {
            const selectedBook = globalBooks.find(
                (b) => String(b.id) === String(newValue.value)
            )

            if (!selectedBook) return

            const { id: barcode, bookTitle, price } = selectedBook
            const invoiceDetail = new InvoiceDetail(barcode, bookTitle, price)

            updateRow(row.original.id, invoiceDetail)

            requestAnimationFrame(() => focusCell(cellToFocusOn))
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
            header: ({ table }) => (
                <CheckboxBox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
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
                const items: ComboboxItem[] = globalBooks.map((b) => ({
                    label: b.id,
                    value: b.id,
                }))
                return comboboxCellRenderer(props, items, `quantity-${props.row.id}`)
            },
        },

        // book title column
        {
            accessorKey: "bookTitle",
            header: "اسم المنتج",
            cell: (props) => {
                const items: ComboboxItem[] = globalBooks.map((b) => ({
                    label: b.bookTitle,
                    value: b.id,
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
                    const newTotal = newValue * props.row.original.unitPrice
                    updateRow(props.row.original.id, {
                        ...props.row.original,
                        quantity: newValue,
                        total: newTotal,
                    })
                }
                return inputCellRenderer(props, `unitPrice-${props.row.id}`, parseNumber, 500, onUpdate)
            },
        },

        // unit price column
        {
            accessorKey: "unitPrice",
            header: "الفئة",
            cell: (props) => {
                const onUpdate: UpdateCallback<number> = (newValue) => {
                    const newTotal = props.row.original.quantity * newValue
                    updateRow(props.row.original.id, {
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
                    updateRow(props.row.original.id, {
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
                    <Button
                        onClick={() => deleteRow(row.original.id)}
                        className="active:text-red-500 active:bg-red-50"
                        variant="ghost"
                    >
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
