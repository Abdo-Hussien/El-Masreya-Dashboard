import { InvoiceDetail } from "@/classes/invoice-detail";
import { SaleFormat } from "./sale-format"

export type SummaryAction =
    | { type: "set sale"; newValue: number }
    | { type: "set amount paid"; newValue: number }
    | { type: "set sale format"; newFormat: SaleFormat }
    | { type: "recalculate totals"; invoiceDetails?: InvoiceDetail[] }
    | { type: "reset" }

