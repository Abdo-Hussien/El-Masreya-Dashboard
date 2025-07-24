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
import { Input } from "@/components/ui/input"
import Combobox from "@/components/ui/combobox"


const defaultColumnHeader = (text: string) => {
    return (
        <div className="text-foreground text-center">
            {text}
        </div>
    )
}

export default function InvoiceForm() {
    // const { parseNumber, parsePrice } = useFormatter()

    // const [invoiceData, setInvoiceData] = useState<InvoiceDetail[]>([])

    // const cellRefs = useRef<Record<string, InputCellHandler | null>>({})

    // const { focusOnCellRef, setCellRefs } = targetRef(cellRefs)

    // const addNewRow = () => {
    //     setInvoiceData((prev) => {
    //         const updated = [...prev, new InvoiceDetail()]
    //         const lastIndex = updated.length - 1
    //         focusOnCellRef("productName", lastIndex.toString())
    //         return updated
    //     })
    // }
    // const removeRow = (index: number) => setInvoiceData((prev) => prev.filter((_, i) => { return i !== index }))

    // const updateRow = (rowId: number, columnId: keyof InvoiceDetail, newValue: string | number) => { }

    // const { products, loading: productsLoading } = useProducts()


    // const columns: ColumnDef<InvoiceDetail>[] = [
    //     // select column
    //     {
    //         id: "select",
    //         enableSorting: false,
    //         enableHiding: false,
    //         header: ({ table }) => (
    //             <Checkbox
    //                 checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
    //                 onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //                 aria-label="Select all"
    //             />
    //         ),
    //         cell: ({ row }) => (
    //             <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    //         ),
    //     },
    //     // barcode column
    //     {
    //         accessorKey: "barcode",
    //         header: () => defaultColumnHeader("الباركود"),
    //         cell: ({ row, column }) => {
    //             const value = row.getValue(column.id) as string;
    //             return (
    //                 <EditableInputCell
    //                     id={`${column.id}-${row.id}`}
    //                     initialValue={value}
    //                     ref={setCellRefs(column.id, row.id)}
    //                     onChange={(newValue: string) => {
    //                         (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
    //                     }}
    //                 />
    //             )
    //         },
    //     },
    //     // product name column
    //     {
    //         accessorKey: "productName",
    //         header: () => defaultColumnHeader("اسم المنتج"),
    //         cell: ({ row, column }) => {
    //             if (productsLoading) return (
    //                 <div className="flex justify-center">
    //                     <Skeleton className="h-6 w-24" />
    //                 </div>
    //             )
    //             const setInvData = (newValue: string) => {
    //                 const rowIndex = row.id
    //                 const colKey = column.id as keyof InvoiceDetail
    //                 const updateMethod = (rowData: any, idx: any) => idx === Number(rowIndex) ? { ...rowData, [colKey]: newValue } : rowData
    //                 setInvoiceData((prevData) => prevData.map(updateMethod))
    //             }
    //             return <ProductsComboboxCell row={row} column={column} cellRefs={cellRefs} products={products} setInvoiceData={setInvData} />
    //         },
    //     },
    //     // quantity column
    //     {
    //         accessorKey: "quantity",
    //         header: () => defaultColumnHeader("العدد"),
    //         cell: ({ row, column }) => {
    //             const value = row.getValue(column.id) as number
    //             return (
    //                 <>
    //                     <EditableInputCell
    //                         id={`${column.id}-${row.id}`}
    //                         type="number"
    //                         initialValue={value}
    //                         ref={setCellRefs(column.id, row.id)}
    //                         onChange={(newValue: number) => {
    //                             const rowIndex = row.index;
    //                             const colKey = column.id as keyof InvoiceDetail;

    //                             setInvoiceData((prevData) =>
    //                                 prevData.map((rowData, idx) =>
    //                                     idx === rowIndex
    //                                         ? {
    //                                             ...rowData,
    //                                             [colKey]: newValue,
    //                                         }
    //                                         : rowData
    //                                 )
    //                             )
    //                         }}
    //                         formatter={(val) => String(parseNumber(val))}
    //                         validate={(val) => true}
    //                         onAccept={() => focusOnCellRef("unitPrice", row.id)}
    //                     />
    //                 </>
    //             )
    //         },
    //     },
    //     // unit price column
    //     {
    //         accessorKey: "unitPrice",
    //         header: () => defaultColumnHeader("الفئة"),
    //         cell: ({ row, column }) => {
    //             const value = row.getValue(column.id) as number;
    //             return (
    //                 <EditableInputCell
    //                     id={`${column.id}-${row.id}`}
    //                     type="number"
    //                     initialValue={value}
    //                     ref={setCellRefs(column.id, row.id)}
    //                     onChange={(newValue: number) => {
    //                         const rowIndex = row.index;
    //                         const colKey = column.id as keyof InvoiceDetail;

    //                         setInvoiceData((prevData) =>
    //                             prevData.map((rowData, idx) =>
    //                                 idx === rowIndex
    //                                     ? {
    //                                         ...rowData,
    //                                         [colKey]: newValue,
    //                                     }
    //                                     : rowData
    //                             )
    //                         )
    //                     }}
    //                     formatter={(val) => parsePrice(val)}
    //                     validate={(val) => true}
    //                     onAccept={() => focusOnCellRef("sale", row.id)}
    //                 />
    //             );
    //         },
    //     },
    //     // sale column
    //     {
    //         accessorKey: "sale",
    //         header: () => defaultColumnHeader("الخصم"),
    //         cell: ({ row, column }) => {
    //             const value = row.getValue(column.id)?.toString() ?? "";
    //             return (
    //                 <EditableInputCell
    //                     id={`${column.id}-${row.id}`}
    //                     type="number"
    //                     ref={setCellRefs(column.id, row.id)}
    //                     initialValue={value}
    //                     onChange={(newValue: string) => {
    //                         const rowIndex = row.index;
    //                         const colKey = column.id as keyof InvoiceDetail;

    //                         setInvoiceData((prevData) =>
    //                             prevData.map((rowData, idx) =>
    //                                 idx === rowIndex
    //                                     ? {
    //                                         ...rowData,
    //                                         [colKey]: parseFloat(newValue),
    //                                     }
    //                                     : rowData
    //                             )
    //                         )
    //                     }}
    //                     formatter={(val) => parsePrice(val)}
    //                     validate={(val) => true}
    //                     onAccept={() => focusOnCellRef("total", row.id)}
    //                 />
    //             );
    //         },
    //     },
    //     // total column
    //     {
    //         accessorKey: "total",
    //         header: ({ column }) => (
    //             <div className="text-center">
    //                 <Button
    //                     variant="ghost"
    //                     className="text-foreground font-medium"
    //                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                 >
    //                     المجموع
    //                     <ArrowUpDown />
    //                 </Button>
    //             </div>
    //         ),
    //         cell: ({ row, column }) => {
    //             const value = row.getValue(column.id)?.toString() ?? "";
    //             return <EditableInputCell
    //                 id={`${column.id}-${row.id}`}
    //                 type="number"
    //                 initialValue={value}
    //                 ref={setCellRefs(column.id, row.id)}
    //                 onChange={(newValue: string) => {
    //                     const rowIndex = row.index;
    //                     const colKey = column.id as keyof InvoiceDetail;

    //                     setInvoiceData((prevData) =>
    //                         prevData.map((rowData, idx) =>
    //                             idx === rowIndex
    //                                 ? {
    //                                     ...rowData,
    //                                     [colKey]: parseFloat(newValue),
    //                                 }
    //                                 : rowData
    //                         )
    //                     );
    //                 }}
    //                 formatter={(val) => parsePrice(val)}
    //             ></EditableInputCell>
    //         },
    //     },
    //     // actions column
    //     {
    //         id: "actions",
    //         enableHiding: false,
    //         cell: ({ row }) => {
    //             const payment = row.original;
    //             return (
    //                 <div className="text-right">
    //                     <DropdownMenu>
    //                         <DropdownMenuTrigger asChild>
    //                             <Button variant="ghost" className="h-8 w-8 p-0">
    //                                 <span className="sr-only">Open menu</span>
    //                                 <MoreHorizontal />
    //                             </Button>
    //                         </DropdownMenuTrigger>
    //                         <DropdownMenuContent align="end">
    //                             <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
    //                             <DropdownMenuItem
    //                                 onClick={() => navigator.clipboard.writeText(payment.productName)}
    //                             >
    //                                 نسخ اسم المنتج
    //                             </DropdownMenuItem>
    //                             <DropdownMenuSeparator />
    //                             <DropdownMenuItem
    //                                 onClick={() => removeRow(row.index)}
    //                             >
    //                                 ازالة السطر
    //                             </DropdownMenuItem>
    //                         </DropdownMenuContent>
    //                     </DropdownMenu>
    //                 </div>
    //             );
    //         },
    //     },
    // ]
    return (
        <>
            <div id="invoice_form" className="flex flex-col bg-white rounded-xl shadow-sm border">
                <div id="header" className="flex p-4">
                    <div id="texts" className="flex flex-col">
                        <div id="text" className="flex flex-col">
                            <h2 className="mb-2">نموذج الفاتورة</h2>
                            <span className="font-light text-gray-600">{useFormatter().parseDate(new Date())}</span>
                            <span className="font-bold">٥ كتب</span>
                        </div>
                        <div id="invoice_info" className="flex flex-col justify-end gap-2">
                            <Checkbox />
                            <div className="flex flex-wrap flex-1/2 gap-4">
                                <Combobox placeholder="اختر العميل..." variant="outline" id={""} items={[]} />
                                <Combobox placeholder="اختر حالة الفاتورة..." variant="outline" id={""} items={[]} />
                            </div>
                        </div>
                    </div>
                    <div id="main_actions" className="flex w-full h-full gap-4 justify-end align-top">
                        <div id="button-group" className="flex flex-wrap-reverse justify-end align-top gap-4">
                            <Button variant="tonal">
                                ابدأ من جديد
                            </Button>
                            <Button>
                                إنشاء فاتورة
                            </Button>
                        </div>
                    </div>
                </div>
                <div id="divider" className="flex bg-gray-200 w-full h-[1px]" />
                <div id="body" className="flex flex-col p-4">
                    <p>Body</p>
                </div>
                {/* <EditableDataTable
                columns={columns}
                data={invoiceData}
                addRow={addNewRow}
                filterColumnIds={["productName", "notes"]}
                /> */}
            </div >
        </>
    )
}
