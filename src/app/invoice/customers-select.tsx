"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";

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

export default function CustomersSelect() {
    const [customers, setCustomers] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        fetchProducts().then((data) => {
            setCustomers(data);
        });
    }, []);

    return (
        <>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اسم العميل" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                    {customers.map((customer) => (
                        <SelectItem key={customer.value} value={customer.value}>
                            {customer.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}


