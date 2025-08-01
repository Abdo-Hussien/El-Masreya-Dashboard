"use client"

import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { TableBody, TableRow, TableCell } from "../../table"
import { DataTable } from "../../data-table"
import { useContext, useState } from "react"
import Button from "../../button"
import { Plus } from "lucide-react"
import { useFormatter } from "@/utils/value-formatter"
import { InvoiceContext } from "@/store/invoice-context"


const PrimaryAction = () => {
    const { addRow } = useContext(InvoiceContext)
    return <Button onClick={addRow}> <Plus /></Button>
}

export default function EditableDataTable({ data, columns }: { data: any[], columns: any[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const { parseNumber } = useFormatter()
    const rowsSelectedText = `تم تحديد ${parseNumber(table.getFilteredSelectedRowModel().rows.length)} من ${parseNumber(table.getFilteredRowModel().rows.length)} صفوف.`

    return (
        <>
            <DataTable table={table} filterField="bookTitle" primaryGroup={<PrimaryAction />} footerText={rowsSelectedText}>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow className={`${row.index % 2 !== 0 ? 'bg-gray-50/40 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900/40'}`} key={row.id} data-state={row.getIsSelected() && "selected"} >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        <div className="cursor-text">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={columns.length} className="text-center h-18">
                                <p>ابداء باضافة منتج.</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </>
    )
}

