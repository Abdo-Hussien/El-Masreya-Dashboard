
"use client"

import { ColumnDef, Getter, Row } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./variants/editable-data-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { useFormatter } from "@/utils/value-formatter"
import EditableInputCell from "@/app/invoice/editable-input-cell"
import { useContext, useRef } from "react"
import EditableComboboxCell from "@/app/invoice/editable-combobox-cell"
import { ComboboxItem } from "../combobox"
import { CellHandler } from "@/types/cell-handler"
import { InvoiceContext } from "@/store/invoice-context"

type CellRendererProps = {
    row: Row<InvoiceDetail>,
    column: ColumnDef<InvoiceDetail>,
    getValue: Getter<unknown>
}


export default function InvoiceDetailsDataTable() {

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

    function inputCellRenderer<T = number>({ row, column, getValue }: CellRendererProps, cellToFocusOn: string, formatter: (value: number | string) => string) {
        const id = `${column.id}-${row.id}`
        const value = getValue() as T

        const onAccepted = (newValue: any) => {
            updateCell(newValue, row, column)
            requestAnimationFrame(() => focusCell(cellToFocusOn))
        }

        const validate = (newValue: unknown): boolean => {
            const asNumber = Number(newValue)
            if (Number.isFinite(asNumber)) return asNumber > 0 && asNumber <= 500
            return false
        }
        return (
            <EditableInputCell id={id} ref={(node: any) => setCellRef(id, node)} initialValue={value} onValueAccepted={onAccepted} validate={validate} formatter={formatter} />
        )
    }

    function comboboxCellRenderer({ row, column, getValue }: CellRendererProps, items: ComboboxItem[], cellToFocusOn: string) {

        const id = `${column.id}-${row.id}`
        const value = getValue() as string

        const selected = items.find((v) => v.value == value)
        const onAccepted = (newValue: ComboboxItem) => {
            // updateCell(newValue.value, row, column)
            updateRow(row.original.id, new InvoiceDetail())
            requestAnimationFrame(() => {
                focusCell(cellToFocusOn)
            })
        }

        return (
            <EditableComboboxCell id={id} ref={(node: any) => setCellRef(id, node)} item={selected} items={items} onValueAccepted={onAccepted} />
        )
    }


    const columns: ColumnDef<InvoiceDetail>[] = [
        // select column
        {
            id: "select", enableSorting: false, enableHiding: false,
            header: ({ table }) => <CheckboxBox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
            cell: ({ row }) => <CheckboxBox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        },
        // barcode column
        {
            accessorKey: "barcode", header: "الباركود", cell: (props) => {

                const items = [{ label: "hello", value: "world" }]
                return comboboxCellRenderer(props, items, `quantity-${props.row.id}`)
            },
        },
        // book title column
        {
            accessorKey: "bookTitle", header: "اسم المنتج", cell: (props) => {
                const items = [{ label: "hello", value: "world" }, { label: "hello2", value: "world2" }]
                return comboboxCellRenderer(props, items, `quantity-${props.row.id}`)
            },
        },
        { accessorKey: "quantity", header: "العدد", cell: (props) => inputCellRenderer(props, `unitPrice-${props.row.id}`, parseNumber), },
        { accessorKey: "unitPrice", header: "الفئة", cell: (props) => inputCellRenderer(props, `sale-${props.row.id}`, parsePrice), },
        { accessorKey: "sale", header: "الخصم", cell: (props) => inputCellRenderer(props, `total-${props.row.id}`, parsePrice), },
        { accessorKey: "total", header: "المجموع", cell: (props) => inputCellRenderer(props, `none-${props.row.id}`, parsePrice), },
        // actions column
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end">
                        <Button onClick={() => deleteRow(row.original.id)} className="active:text-red-500 active:bg-red-50" variant="ghost"><Trash2 /></Button>
                    </div>
                )
            },
        },
    ]
    return (
        <>
            <EditableDataTable data={invoiceDetails} columns={columns} />
        </>
    )
}
