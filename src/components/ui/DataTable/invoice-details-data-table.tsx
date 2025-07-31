
"use client"

import { ColumnDef, Getter, Row } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import Button from "../button"
import EditableDataTable from "./editable-data-table"
import { InvoiceDetail } from "@/classes/invoice-detail"
import { CheckboxBox } from "@/components/ui/checkbox-box"
import { useFormatter } from "@/utils/value-formatter"
import NewEditableInputCell from "@/app/invoice/editable-input-cell-new"
import { useRef, useState } from "react"
import EditableComboboxCell from "@/app/invoice/editable-combobox-cell"
import { ComboboxItem } from "../combobox"
import { InputCellHandler } from "@/types/cell-handler"

const data: InvoiceDetail[] = [{
    barcode: "world",
    quantity: 1,
    bookTitle: "world",
    sale: 324,
    total: 23423,
    unitPrice: 234
}]

type CellRendererProps = {
    row: Row<InvoiceDetail>,
    column: ColumnDef<InvoiceDetail>,
    getValue: Getter<unknown>
}


export default function InvoiceDetailsDataTable() {

    const { parseNumber, parsePrice } = useFormatter()

    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>(data)

    const updateCell = (newValue: any, row: Row<InvoiceDetail>, column: ColumnDef<InvoiceDetail>) => {
        setInvoiceDetails((old) =>
            old.map((r, i) =>
                i === row.index
                    ? { ...r, [column.id as string]: newValue }
                    : r
            )
        )
    }

    const cellRefs = useRef<Map<string, InputCellHandler>>(new Map())

    const setCellRef = (id: string, node: InputCellHandler | null) => {
        if (node) {
            cellRefs.current.set(id, node)
        } else {
            cellRefs.current.delete(id)
        }
    }

    const focusCell = (id: string) => {
        cellRefs.current.get(id)?.activateEditor()
    }


    function inputCellRenderer({ row, column, getValue }: CellRendererProps, cellToFocusOn: string, formatter: (value: number | string) => string) {
        const id = `${column.id}-${row.id}`
        const value = getValue();

        const onAccepted = (newValue: any) => {
            updateCell(newValue, row, column);
            requestAnimationFrame(() => focusCell(cellToFocusOn));
        }

        const validate = (newValue: any): boolean => {
            if (typeof newValue === "string") return newValue.length > 0 && newValue.length <= 100;
            if (typeof newValue === "number") return newValue >= 0 && newValue <= 500;
            return true;
        }
        return (
            <NewEditableInputCell id={id} ref={(node: any) => setCellRef(id, node)} initialValue={value} onValueAccepted={onAccepted} validate={validate} formatter={formatter} />
        )
    }

    function comboboxCellRenderer({ row, column, getValue }: CellRendererProps, items: ComboboxItem[], cellToFocusOn: string) {

        const id = `${column.id}-${row.id}`
        const value = getValue() as string

        const selected = items.find((v) => v.value == value)
        const onAccepted = (newValue: ComboboxItem) => {
            updateCell(newValue.value, row, column)
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
        // quantity column
        {
            accessorKey: "quantity", header: "العدد", cell: (props) => inputCellRenderer(props, `unitPrice-${props.row.id}`, parseNumber),
        },
        // unit price column
        {
            accessorKey: "unitPrice", header: "الفئة", cell: (props) => inputCellRenderer(props, `sale-${props.row.id}`, parsePrice),
        },
        // sale column
        {
            accessorKey: "sale", header: "الخصم", cell: (props) => inputCellRenderer(props, `total-${props.row.id}`, parsePrice),
        },
        // total column
        {
            accessorKey: "total", header: "المجموع", cell: (props) => inputCellRenderer(props, `none-${props.row.id}`, parsePrice),
        },
        // actions column
        {
            id: "actions",
            enableHiding: false,
            cell: () => {
                return (
                    <div className="flex justify-end">
                        <Button variant="ghost"><Trash2 /></Button>
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
