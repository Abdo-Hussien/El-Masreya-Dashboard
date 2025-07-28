import { SaleFormat } from "./sale-format"

export type SummaryFields = {
    subTotal: number
    sale: number
    saleFormat: SaleFormat
    total: number
    amountPaid: number
    finalTotal: number
}

export class SummaryFieldsBuilder {
    private subTotal: number = 1
    private sale: number = 0
    private saleFormat: SaleFormat = "number"
    private total: number = 1
    private amountPaid: number = 1
    private finalTotal: number = 1

    public build(): SummaryFields {
        return {
            subTotal: this.subTotal,
            sale: this.sale,
            saleFormat: this.saleFormat,
            total: this.total,
            amountPaid: this.amountPaid,
            finalTotal: this.finalTotal
        }
    }

    public setSubTotal(value: number) {
        this.subTotal = value
        return this
    }

    public setSale(value: number) {
        this.sale = value
        return this
    }

    public setSaleFormat(value: SaleFormat) {
        this.saleFormat = value
        return this
    }

    public setTotal(value: number) {
        this.total = value
        return this
    }

    public setAmountPaid(value: number) {
        this.amountPaid = value
        return this
    }

    public setFinalTotal(value: number) {
        this.finalTotal = value
        return this
    }
}
