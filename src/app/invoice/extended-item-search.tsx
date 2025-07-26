"use client"

import BooksDataTable from "@/components/ui/DataTable/books-data-table"
import Divider from "@/components/ui/divider"


export default function ExtendedItemSearch() {
    return (
        <div id="extended_search" className="flex flex-col bg-white rounded-xl border">
            <div id="header" className="flex justify-between p-4">
                <h2 className="flex grow mb-2">بحث موسع عن المنتج</h2>
            </div>
            <Divider />
            <BooksDataTable />
        </div>
    )
}