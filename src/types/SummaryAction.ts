import { InvoiceDetail } from "@/classes/InvoiceDetail";

export type SummaryAction =
    | { type: "set sale"; newValue: number }
    | { type: "set amount paid"; newValue: number }
    | { type: "recalculate totals"; invoiceDetails?: InvoiceDetail[] }
    | { type: "reset" }

