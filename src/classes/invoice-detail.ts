
export class InvoiceDetail {

    private static nextId: number = 0
    public readonly id: number
    barcode: string
    bookTitle: string
    quantity: number
    unitPrice: number
    sale: number
    total: number

    constructor(barcode?: string, bookTitle?: string, quantity?: number, unitPrice?: number, total?: number, sale?: number) {
        this.id = InvoiceDetail.nextId
        InvoiceDetail.nextId++
        this.barcode = barcode || "null"
        this.bookTitle = bookTitle || "null"
        this.quantity = quantity || 1
        this.unitPrice = unitPrice || 0
        this.sale = sale || 0
        this.total = total || 0
    }
}