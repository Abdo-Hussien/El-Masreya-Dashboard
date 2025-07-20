"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { InvoiceDetail } from "@/classes/invoice-detail";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EditableDataTable } from "@/components/ui/DataTable/editable-data-table";
import { EColumnDef } from "@/types/extended-column-defs";

function fetchProducts() {
    return fetch("/api/customers")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if (!Array.isArray(data)) {
                console.warn("Unexpected data format:", data);
                return [];
            }

            return data.map((item) => ({
                value: item.CustomerID.toString(),
                label: item.DisplayName,
            }));
        })
        .catch((err) => {
            console.error("Failed to fetch customers:", err);
            return [];
        });
}

type EditableCellProps<T> = {
    initialValue: T;
    onChange: (value: T) => void;
    formatter?: (value: T) => string;
};

function EditableCell<T>({ initialValue, onChange, formatter }: EditableCellProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    // Format the display value
    const displayValue = formatter ? formatter(value) : value;

    // Parse the input value when saving
    const handleSave = (inputValue: T) => {
        onChange(inputValue);
        setIsEditing(false);
    };

    return isEditing ? (
        <div className="flex justify-center">
            <Input
                variant="plain"
                autoFocus
                // When editing, show the raw value, not the formatted one
                value={value as unknown as string}
                onChange={(e) => setValue(e.target.value as unknown as T)}
                onBlur={() => handleSave(value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                        setValue(initialValue);
                        setIsEditing(false);
                    }
                }}
            />
        </div>
    ) : (
        <div className="cursor-text text-center" onDoubleClick={() => setIsEditing(true)}>
            {displayValue as string}
        </div>
    );
}

export default function InvoicePage() {
    const [customers, setCustomers] = useState<{ value: string; label: string }[]>([]);
    const [invoiceData, setInvoiceData] = useState<InvoiceDetail[]>([
        new InvoiceDetail("1234567890123", "منتج 1", 2, 50, 100, 0.1),
        new InvoiceDetail("2345678901234", "منتج 2", 1, 75, 75, 0.2),
        new InvoiceDetail("3456789012345", "منتج 3", 3, 30, 90, 0.15),
    ]);

    useEffect(() => {
        const loadCustomers = async () => {
            const data = await fetchProducts();
            setCustomers(data);
        };
        loadCustomers();
    }, []);

    const addNewRow = () => {
        setInvoiceData((prev) => [...prev, new InvoiceDetail()]);
    };

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
            accessorKey: "barcode",
            header: () => <div className="text-center">البار كود</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as string;
                return (
                    <EditableCell
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                );
            },
        },
        {
            accessorKey: "productName",
            header: () => <div className="text-center">اسم المنتج</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as string;
                return (
                    <EditableCell
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as string) = newValue;
                        }}
                    />
                );
            },
        },
        // For quantity column
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">العدد</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableCell
                        initialValue={value}
                        onChange={(newValue: number) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                        }}
                        formatter={(val) => new Intl.NumberFormat("ar-EG").format(val)}
                    />
                );
            },
        },

        // For currency column
        {
            accessorKey: "unitPrice",
            header: () => <div className="text-center">السعر</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id) as number;
                return (
                    <EditableCell
                        initialValue={value}
                        onChange={(newValue: number) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = newValue;
                        }}
                        formatter={(val) => new Intl.NumberFormat("ar-EG", {
                            style: "currency",
                            currency: "EGP",
                        }).format(val)}
                    />
                );
            },
        },
        {
            accessorKey: "ratio",
            header: () => <div className="text-center">النسبة</div>,
            cell: ({ row, column }) => {
                const value = row.getValue(column.id)?.toString() ?? "";
                return (
                    <EditableCell
                        initialValue={value}
                        onChange={(newValue: string) => {
                            (row.original[column.id as keyof InvoiceDetail] as number) = parseFloat(newValue);
                        }}
                        formatter={(val) => {
                            const num = Number(val)
                            return new Intl.NumberFormat("ar-EG", {
                                style: "percent",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(num)
                        }}
                    />
                );
            },
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        المجموع
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total"));
                const formatted = new Intl.NumberFormat("ar-EG", {
                    style: "currency",
                    currency: "EGP",
                }).format(amount);
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => (
                <div className="text-right">
                    <Button className="rounded-sm" onClick={addNewRow}>
                        <Plus />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const payment = row.original;
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
                                <DropdownMenuItem
                                    dir="rtl"
                                    onClick={() => navigator.clipboard.writeText(payment.productName)}
                                >
                                    نسخ اسم المنتج
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    dir="rtl"
                                    onClick={() =>
                                        setInvoiceData((prev) =>
                                            prev.filter((_, index) => index !== row.index)
                                        )
                                    }
                                >
                                    ازالة السطر
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-4 flex flex-col gap-2">
            <h1 className="text-2xl font-bold mb-4">New Invoice</h1>
            <Select>
                <SelectTrigger dir="rtl" className="w-[180px]">
                    <SelectValue placeholder="اسم العميل" />
                </SelectTrigger>
                <SelectContent className="max-h-80" dir="rtl">
                    {customers.map((customer) => (
                        <SelectItem key={customer.value} value={customer.value}>
                            {customer.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-4">
                <EditableDataTable
                    columns={columns}
                    data={invoiceData}
                    filterColumnIds={["productName", "notes"]}
                />
            </div>
        </div>
    );
}
