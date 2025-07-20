
export class InvoiceDetail {
    barcode: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
    ratio: number

    constructor(barcode?: string, productName?: string, quantity?: number, unitPrice?: number, total?: number, ratio?: number) {
        this.barcode = barcode || "null"
        this.productName = productName || "null"
        this.unitPrice = unitPrice || 0
        this.total = total || 0
        this.quantity = quantity || 0
        this.ratio = ratio || 0
    }
}