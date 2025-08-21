import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { TableBody, TableRow, TableCell } from "../../table"
import { DataTable } from "../../data-table"
import { useState } from "react"
import { cn } from "@/lib/Utils"

export default function ReadonlyDataTable({
    data,
    columns,
    quickFilters,
    onRowDoubleClick
}: {
    data: any[],
    columns: any[],
    quickFilters?: React.ReactNode,
    onRowDoubleClick: (rowId: number) => void
}) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [flashRowId, setFlashRowId] = useState<number | null>(null)

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

    const handleRowDoubleClick = (rowId: number) => {
        onRowDoubleClick(rowId)

        setFlashRowId(rowId)
        setTimeout(() => setFlashRowId(null), 2000) // remove after animation
    }

    return (
        <DataTable table={table} filterField="bookTitle" quickFilters={quickFilters}>
            <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => {
                        return (
                            <TableRow
                                onDoubleClick={() => handleRowDoubleClick(row.original.id!)}
                                className={cn(
                                    "h-12 cursor-pointer transition-colors duration-1000",
                                    row.index % 2 !== 0
                                        ? "bg-gray-50/40 dark:bg-gray-800/40"
                                        : "bg-white dark:bg-gray-900/40",
                                    row.original.id == flashRowId && "flash-success"
                                )}
                                key={row.id}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        <div>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })
                ) : (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </DataTable>
    )
}
