export class InvoiceDetail {
    id?: number
    barcode: string
    bookTitle: string
    quantity: number
    unitPrice: number
    sale: number
    total: number


    // overloads
    constructor(barcode?: string, bookTitle?: string, unitPrice?: number)
    constructor(
        barcode?: string,
        bookTitle?: string,
        quantity?: number,
        unitPrice?: number,
        total?: number,
        sale?: number
    )
    constructor(
        barcode: string = "",
        bookTitle: string = "",
        a?: number,
        b?: number,
        c?: number,
        d?: number
    ) {
        this.barcode = barcode
        this.bookTitle = bookTitle

        if (b === undefined && c === undefined && d === undefined) {
            // short form: (barcode, title, unitPrice)
            this.quantity = 1
            this.unitPrice = a ?? 0
            this.total = this.unitPrice
            this.sale = 0
        } else {
            // long form
            this.quantity = a ?? 1
            this.unitPrice = b ?? 0
            this.total = c ?? this.unitPrice * this.quantity
            this.sale = d ?? 0
        }
    }
}