"use client"

import Button from "@/components/ui/button"
import BooksDataTable from "@/components/ui/data-table/books-data-table"
import Divider from "@/components/ui/divider"
import { X } from "lucide-react"
import { useState } from "react"


export default function ExtendedItemSearch() {
    const [isSummaryOpen, setSummaryOpen] = useState<boolean>(false)


    const openSummary = () => setSummaryOpen(true)
    const closeSummary = () => setSummaryOpen(false)
    return (
        <>
            <div data-component="overlay" className="fixed inset-0 z-50 pointer-events-none">
                <div onClick={openSummary} className="absolute hover:shadow-2xl flex vertical-text px-6 py-1 transition-all duration-200 top-1/4 pointer-events-auto rounded-r-2xl left-[-4px] transform -translate-y-1/2 cursor-pointer border border-gray-900 bg-[linear-gradient(to_top_left,_#111827,_#2C3444,_#111827,_#2C3444)]" >
                    <p className="caption text-shadow-white text-muted/90 hover:text-white">بحث موسع</p>
                </div>
            </div>

            <div data-component="overlay" className={`fixed inset-0 z-50 flex justify-center items-center glass p-2 bg-gray-200/40 transition-all duration-300 ease-in-out ${isSummaryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} >
                <div id="extended_search" className={`relative  w-full h-full flex flex-col bg-white rounded-2xl border-4 border-gray-300/50 transition-all duration-300 ease-in-out ${isSummaryOpen ? 'scale-100' : 'scale-90'}`}>
                    <Button className="absolute w-6 h-6 top-1 left-1 rounded-lg p-2" variant="outline" onClick={closeSummary}><X /></Button>
                    <div id="header" className="flex justify-between p-4">
                        <h2 className="flex grow mb-2">بحث موسع عن المنتج</h2>
                    </div>
                    <Divider />
                    <BooksDataTable />
                </div>
            </div>
        </>
    )
}