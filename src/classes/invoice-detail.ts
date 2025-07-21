
export class InvoiceDetail {
    barcode: string
    productName: string
    quantity: number
    unitPrice: number
    sale: number
    total: number

    constructor(barcode?: string, productName?: string, quantity?: number, unitPrice?: number, total?: number, sale?: number) {
        this.barcode = barcode || "null"
        this.productName = productName || "null"
        this.quantity = quantity || 1
        this.unitPrice = unitPrice || 0
        this.sale = sale || 0
        this.total = total || 0
    }
}