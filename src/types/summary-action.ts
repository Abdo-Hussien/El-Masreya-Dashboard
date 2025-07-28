import { SaleFormat } from "./sale-format"

export type SummaryAction =
    { type: "set sale"; newValue: number; saleFormat: SaleFormat }
    | { type: "set amount paid"; newValue: number; saleFormat: SaleFormat }
    | { type: "recalculate totals"; saleFormat: SaleFormat }
