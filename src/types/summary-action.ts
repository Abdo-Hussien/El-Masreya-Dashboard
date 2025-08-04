import { InvoiceDetail } from "@/classes/invoice-detail";

export type SummaryAction =
    | { type: "set sale"; newValue: number }
    | { type: "set amount paid"; newValue: number }
    | { type: "recalculate totals"; invoiceDetails?: InvoiceDetail[] }
    | { type: "reset" }

