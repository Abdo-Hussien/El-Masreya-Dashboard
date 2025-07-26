
"use client"
import { useFormatter } from "@/utils/value-formatter"
import Divider from "@/components/ui/divider"
import CardItem from "@/components/ui/cards/card-item"
import InvoiceActions from "./invoice-actions"
import InvoiceFields from "./invoice-fields"
import InvoiceDetailsDataTable from "@/components/ui/DataTable/invoice-details-data-table"



export default function InvoiceForm() {

    // const addNewRow = () => {
    //     setInvoiceData((prev) => {
    //         const updated = [...prev, new InvoiceDetail()]
    //         const lastIndex = updated.length - 1
    //         focusOnCellRef("productName", lastIndex.toString())
    //         return updated
    //     })
    // }

    // const removeRow = (index: number) => setInvoiceData((prev) => prev.filter((_, i) => { return i !== index }))

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

    const { parseDate } = useFormatter()

    const currentDate = parseDate(new Date())
    return (
        <div id="inv_form" className="flex flex-col grow bg-white rounded-xl border">

            <div className="flex flex-col grow basis-1/6 space-y-12 p-4">
                <div id="inv-title-actions" className="flex">
                    <CardItem id="inv-text" title="نموذج الفاتورة" subtitle={currentDate}>
                        <span className="font-bold text-sm">٥ كتب</span>
                    </CardItem>
                    <InvoiceActions />
                </div>
                <div id="inv_info" className="flex flex-col justify-end gap-4">
                    <InvoiceFields customers={[]} invoiceStatuses={[]} />
                </div>
            </div>

            <Divider />

            <div id="body" className="flex flex-col grow-[8] basis-5/6">
                <InvoiceDetailsDataTable />
            </div>
        </div>
    )
}
