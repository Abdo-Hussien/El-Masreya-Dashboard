import Dexie, { Table } from "dexie"
import { InvoiceDetail } from "@/classes/InvoiceDetail"

class InvoiceDB extends Dexie {
    invoiceDetails!: Table<InvoiceDetail, number>

    constructor() {
        super("InvoiceDetailsDB")
        this.version(1).stores({
            invoiceDetails: "++id, barcode, bookTitle, quantity, total"
        })
    }
}

// Always create one DB instance
export const db = new InvoiceDB()

// Track whether observables have been applied
let observableEnabled = false

/**
 * Get the shared DB instance with dexie-observable enabled.
 */
export async function getDb(): Promise<InvoiceDB> {
    if (typeof window === "undefined") {
        throw new Error("getDb() must be called in the browser")
    }

    if (!observableEnabled) {
        await import("dexie-observable")
        observableEnabled = true
    }

    return db
}
