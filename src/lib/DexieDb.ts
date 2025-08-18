import Dexie, { Table } from "dexie";
import { InvoiceDetail } from "@/classes/InvoiceDetail";

class InvoiceDB extends Dexie {
    invoiceDetails!: Table<InvoiceDetail, number>;

    constructor() {
        super("InvoiceDetailsDB");
        this.version(1).stores({
            invoiceDetails: "++id, barcode, bookTitle, quantity, total"
        });
    }
}

export const db = new InvoiceDB();

