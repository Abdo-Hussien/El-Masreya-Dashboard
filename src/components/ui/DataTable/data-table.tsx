"use client"

import * as React from "react"
import { flexRender, useReactTable } from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import Button from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export function DataTable({ table, filterField, primaryGroup, quickFilters, footerText, children }: {
    table: ReturnType<typeof useReactTable>,
    children: React.ReactNode,
    filterField: string
    primaryGroup?: React.ReactNode
    quickFilters?: React.ReactNode
    footerText?: string,
}) {

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center gap-4 p-4">
                <Input placeholder="ابحث..."
                    value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterField)?.setFilterValue(event.target.value)
                    }
                    className="w-full sm:max-w-xs"
                />
                <div className="flex flex-wrap gap-4 mr-auto">
                    {quickFilters}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"> العواميد <ChevronDown /> </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >{column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {primaryGroup}
                </div>
            </div>
            <div className="overflow-hidden border-y">
                <Table>
                    <TableHeader className="bg-gray-50/80 dark:bg-gray-800">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {children}
                </Table>
            </div>
            <div className="flex items-center justify-start space-x-2 p-4">
                <div className="text-muted-foreground flex-1 text-sm">{footerText}</div>
                <div className="space-x-2 flex">
                    <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} >Previous</Button>
                    <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} >Next</Button>
                </div>
            </div>
        </div>
    )
}
