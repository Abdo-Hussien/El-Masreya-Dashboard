export class InvoiceDetail {
    id?: number
    book_id: number
    barcode: string
    bookTitle: string
    quantity: number
    unitPrice: number
    sale: number
    total: number

    // overloads
    constructor(book_id?: number, barcode?: string, bookTitle?: string, unitPrice?: number)
    constructor(
        book_id?: number,
        barcode?: string,
        bookTitle?: string,
        quantity?: number,
        unitPrice?: number,
        total?: number,
        sale?: number
    )
    constructor(
        book_id: number = 0,
        barcode: string = "",
        bookTitle: string = "",
        a?: number,
        b?: number,
        c?: number,
        d?: number
    ) {
        this.book_id = book_id
        this.barcode = barcode
        this.bookTitle = bookTitle

        if (barcode === "" && bookTitle === "" && a === undefined && b === undefined && c === undefined && d === undefined) {
            // empty constructor case (only book_id given)
            this.quantity = 0
            this.unitPrice = 0
            this.total = 0
            this.sale = 0
        }
        else if (b === undefined && c === undefined && d === undefined) {
            // short form: (book_id, barcode, title, unitPrice)
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
