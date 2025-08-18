

export type SummaryFields = {
    subTotal: number
    sale: number
    total: number
    amountPaid: number
    finalTotal: number
}

export class SummaryFieldsBuilder {
    private subTotal: number = 1
    private sale: number = 0
    private total: number = 1
    private amountPaid: number = 1
    private finalTotal: number = 1

    public build(): SummaryFields {
        return {
            subTotal: this.subTotal,
            sale: this.sale,
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
