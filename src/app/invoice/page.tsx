"use client";

import DataTable from '@/components/ui/DataTable/data-table';
export default function InvoicePage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Invoice List</h1>
            <DataTable />
        </div>
    )
}
