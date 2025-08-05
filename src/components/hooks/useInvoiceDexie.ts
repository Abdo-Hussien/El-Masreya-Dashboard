import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/DexieDb";
import { InvoiceDetail } from "@/classes/InvoiceDetail";

export function useInvoiceDexie() {
    const [savedInvoices, setSavedInvoices] = useState<InvoiceDetail[]>([]);

    // Load all invoices on mount
    useEffect(() => {
        const loadInvoices = async () => {
            const all = await db.invoiceDetails.toArray();
            setSavedInvoices(all);
        };
        loadInvoices();
    }, []);

    const saveInvoice = useCallback(async (invoice: InvoiceDetail) => {
        await db.invoiceDetails.add(invoice);
        const all = await db.invoiceDetails.toArray();
        setSavedInvoices(all);
    }, []);

    const updateInvoice = useCallback(async (id: number, invoice: InvoiceDetail) => {
        await db.invoiceDetails.update(id, invoice);
        const all = await db.invoiceDetails.toArray();
        setSavedInvoices(all);
    }, []);

    const deleteInvoice = useCallback(async (id: number) => {
        await db.invoiceDetails.delete(id);
        const all = await db.invoiceDetails.toArray();
        setSavedInvoices(all);
    }, []);

    const clearAll = useCallback(async () => {
        await db.invoiceDetails.clear();
        setSavedInvoices([]);
    }, []);

    return {
        savedInvoices,
        saveInvoice,
        updateInvoice,
        deleteInvoice,
        clearAll,
    };
}
