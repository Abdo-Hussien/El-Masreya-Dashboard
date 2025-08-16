import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { TableBody, TableRow, TableCell } from "../../table"
import { DataTable } from "../../data-table"
import { useState } from "react"
import { cn } from "@/lib/Utils"

export default function ReadonlyDataTable({ data, columns, quickFilters }: { data: any[], columns: any[], quickFilters?: React.ReactNode }) {
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

    return (
        <>
            <DataTable table={table} filterField="bookTitle" quickFilters={quickFilters}>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow className={cn('h-12', row.index % 2 !== 0 ? 'bg-gray-50/40 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900/40')} key={row.id} >
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
                            <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </>
    )
}