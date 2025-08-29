"use client"

import { Column } from "@tanstack/react-table"
import { Book } from "@/types/Book"
import { ChevronsUpDown } from "lucide-react"
import Button from "../../button"

export default function BtnHeader({ column, title }: { column: Column<Book>, title: string }) {
    const sort = () => column.toggleSorting(column.getIsSorted() === "asc")
    return (
        <Button variant="ghost" onClick={sort}>
            {title}
            <ChevronsUpDown />
        </Button>
    )
}
