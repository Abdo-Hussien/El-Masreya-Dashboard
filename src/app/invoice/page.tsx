"use client";

import DataTable from '@/components/ui/DataTable/data-table';
import { use, useEffect } from 'react';
async function fetchProducts(query: string) {
    const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data;
}
export default async function InvoicePage() {
    useEffect(() => {
        // This effect can be used to fetch products or perform other side effects
        // when the component mounts.
        fetchProducts("Apple").then(products => {
            console.log(products);
        })
    }
        , []);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Invoice List</h1>
            <DataTable />
        </div>
    )
}
