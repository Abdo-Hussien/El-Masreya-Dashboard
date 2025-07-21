"use client"
import {
    ColumnDef as TanstackColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import { InvoiceDetail } from "@/classes/invoice-detail"


type EColumnDef<TData> = TanstackColumnDef<TData> & {
    enableEditing?: boolean;
}

type DataTableProps<TData, TValue> = {
    data: TData[]
    columns: TanstackColumnDef<TData, TValue>[]
    filterColumnId?: string
    editable?: boolean
    className?: string
}



export function ReadonlyDataTable<TData, TValue>({
    data: initialData,
    columns,
    filterColumnId,
    editable = false,
    className,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>(initialData)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [editingCell, setEditingCell] = useState<{
        rowId: string
        columnId: string
    } | null>(null)

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
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
        <div className={`w-full border rounded-xl ${className ?? ""}`}>
            <div className="flex items-center gap-2 p-3">
                {filterColumnId && (
                    <Input
                        placeholder="Search for products..."
                        className="max-w-sm"
                        value={
                            (table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""
                        }
                        onChange={(e) =>
                            table.getColumn(filterColumnId)?.setFilterValue(e.target.value)
                        }
                    />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            العواميد <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="border-y">
                <Table>
                    <TableHeader className="bg-gray-50/80 dark:bg-gray-800">
                        {table.getHeaderGroups().map((group) => (
                            <TableRow className="hover:!bg-transparent" key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (

                                <TableRow className={`${row.index % 2 !== 0 ? 'bg-gray-50/40 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900/40'}`}
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {editable &&
                                                (cell.column.columnDef as EColumnDef<InvoiceDetail>).enableEditing &&
                                                editingCell?.rowId === row.id &&
                                                editingCell?.columnId === cell.column.id ? (
                                                <Input variant="plain" autoFocus defaultValue={cell.getValue() as string}
                                                    onBlur={(e) => {
                                                        const newValue = e.target.value
                                                        setData((prev) => prev.map((r, i) => i === row.index ? { ...r, [cell.column.id]: newValue } : r))
                                                        setEditingCell(null)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") (e.target as HTMLInputElement).blur()
                                                        if (e.key === "Escape") setEditingCell(null)
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    onDoubleClick={() =>
                                                        editable &&
                                                        setEditingCell({ rowId: row.id, columnId: cell.column.id })
                                                    }
                                                    className={editable ? "cursor-text" : ""}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center h-24">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end p-3 space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        السابق
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        التالي
                    </Button>
                </div>
            </div>
        </div>
    )
}

