"use client";

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/DataTable/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { ColumnDef as TanstackColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

function fetchProducts() {
    return fetch('/api/customers')
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data: any) => {
            if (!Array.isArray(data)) {
                console.warn("Unexpected data format:", data);
                return [];
            }

            return data.map((item: any) => ({
                value: item.CustomerID.toString(),
                label: item.DisplayName,
            }));
        })
        .catch((err) => {
            console.error("Failed to fetch customers:", err);
            return [];
        });
}


type EColumnDef<TData> = TanstackColumnDef<TData> & {
    enableEditing?: boolean;
};

type InvoiceDetail = {
    id: number
    productName: string
    total: number
    paidAmount: number
    notes: string
}

const originalData: InvoiceDetail[] = [{ id: 1, productName: "Apple iPhone 14", total: 500.00, paidAmount: 123.45, notes: "Payment for invoice #12345" }, { id: 2, productName: "Samsung Galaxy S23", total: 400.00, paidAmount: 183.95, notes: "Payment for invoice #12345" }, { id: 3, productName: "Google Pixel 7", total: 600.00, paidAmount: 200.00, notes: "Payment for invoice #12345" }, { id: 4, productName: "OnePlus 11", total: 450.00, paidAmount: 150.00, notes: "Payment for invoice #12345" }]

type Invoice = {
    id: number
    customerName: string
    status: "paid" | "unpaid" | "overdue"
    totalAmount: number
    paidAmount: number
    details: InvoiceDetail[]
}

const columns: EColumnDef<InvoiceDetail>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "productName",
        header: "اسم المنتج",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("productName")}</div>
        ),
        enableEditing: true,
    },
    {
        accessorKey: "notes",
        header: "الملاحظات",
        cell: ({ row }) => (
            <div>{row.getValue("notes")}</div>
        ),
        enableEditing: true,
    },
    {
        accessorKey: "total",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    المجموع
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return (<div className="text-left">{formatted}</div>)
        },
        enableEditing: true,
    },
    {
        accessorKey: "paidAmount",
        header: () => <div className="text-right">المدفوع</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("paidAmount"))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right">{formatted}</div>
        },
        enableEditing: true,
    },
    {
        id: "actions",
        enableHiding: false,
        header: ({ }) => {
            return (
                <div className="text-right">
                    <Button variant="tonal" className="size-8 my-2 rounded-sm"
                    // onClick={() => }
                    >
                        <Plus />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const payment = row.original

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel dir="rtl">الإجراءات</DropdownMenuLabel>
                            <DropdownMenuItem dir="rtl"
                                onClick={() => navigator.clipboard.writeText(payment.productName)}
                            >
                                نسخ اسم المنتج
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem dir="rtl">ازالة السطر</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
export default function InvoicePage() {
    const [customers, setCustomers] = useState<{ value: string; label: string }[]>([])
    useEffect(() => {
        const loadCustomers = async () => {
            const data = await fetchProducts()
            console.log("Fetched customers:", data)
            setCustomers(data)
        }

        loadCustomers()
    }, [])
    return (
        <div className="p-4 flex flex-col gap-2">
            <h1 className="text-2xl font-bold mb-4">New Invoice</h1>
            <Select>
                <SelectTrigger dir='rtl' className="w-[180px]">
                    <SelectValue placeholder="اسم العميل" />
                </SelectTrigger>
                <SelectContent className="max-h-80" dir='rtl'>{customers.map((customer) => (
                    <SelectItem key={customer.value} value={customer.value}>
                        {customer.label}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-4">
                <DataTable columns={columns} data={originalData} filterColumnId="productName" editable />
                {/* <DataTable columns={columns} data={originalData} filterColumnId="productName" editable={false} /> */}
            </div>
        </div>
    )
}
