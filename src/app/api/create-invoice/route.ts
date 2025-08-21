import { handleError } from '@/utils/error-handler'
import { BadRequestError, NotFoundError } from '@/utils/errors'
import { NextResponse } from 'next/server'
import { formatAccessDate } from '@/utils/value-formatter'
import { getConnection } from '@/lib/OdbcDb'
import { Connection } from 'odbc'
import '@/../monitor-process'

interface _InvoicePayload {
    customer_id: number
    amount_paid: number
    amount_refunded: number
    discount: number
    status_id: number
    override_is_wholesale: boolean
}
interface _InvoiceDetailPayload {
    book_id: number
    price?: number
    quantity: number
    discount: number
}
interface _Payload {
    invoice: _InvoicePayload
    inv_details: _InvoiceDetailPayload[]
}

let context: Connection;

export async function POST(request: Request) {
    const start = performance.now()
    context = await getConnection()
    let transactionStarted = false

    try {
        const body: _Payload = await request.json()
        const invoice: _InvoicePayload = body.invoice
        const invDetails: _InvoiceDetailPayload[] = body.inv_details

        if (!invoice || !invDetails || invDetails.length === 0) {
            throw new BadRequestError(`Invalid Information: Missing invoice or details`)
        }

        await context.beginTransaction()
        transactionStarted = true

        // Step 1: Validate customer
        await validateCustomer(invoice.customer_id)

        // Step 2: Create invoice
        const invoiceId = await insertInvoice(invoice)

        // Step 3: Insert invoice details
        const bookData = await getBookData(invDetails)
        await insertInvoiceDetails(invoiceId, invDetails, bookData)

        await context.commit()
        const end = performance.now()
        console.log(`POST /create-invoice took ${(end - start).toFixed(2)} ms`)

        return NextResponse.json({ success: true, message: `Invoice created successfully`, id: invoiceId })
    }
    catch (error: any) {
        if (transactionStarted) await context.rollback()
        return handleError(error)
    }
    finally {
        await context.close()
    }
}

/** Validate customer existence */
async function validateCustomer(customerId: number) {
    if (!customerId) throw new BadRequestError('Customer is required')
    const res = await context.query<{ found: number }>(
        `SELECT COUNT(CustomerID) as found FROM Customers WHERE CustomerID = ${customerId}`
    )
    if (!res[0].found) throw new NotFoundError(`Customer not found`)
}

/** Insert invoice and return new ID */
async function insertInvoice(invoice: _InvoicePayload) {
    const currentDate = new Date()
    if (!invoice.status_id) throw new BadRequestError('Invoice status is required')
    const query = `
    INSERT INTO Invoices (CustomerDisplayName, InvoiceDate, ChangeDate, Total, PaidAmount, CashDiscount, Status, UserID, InvoiceExport)
        VALUES (${invoice.customer_id}, ${formatAccessDate(currentDate)}, ${formatAccessDate(currentDate)}, ${0}, ${invoice.amount_paid}, ${invoice.discount}, ${invoice.status_id}, ${0}, 'فاتورة')
        `
    await context.query(query)

    const res = await context.query<{ lastId: number }>(
        `SELECT MAX(InvoiceID) as lastId FROM Invoices`
    )
    return res[0].lastId
}

/** Fetch book info for items missing price */
async function getBookData(invDetails: _InvoiceDetailPayload[]) {
    const idsToFetch = invDetails.map(d => {
        if (d.book_id != 0 && d.quantity != 0) return d.book_id
    }).filter(Boolean)
    if (idsToFetch.length === 0) throw new BadRequestError('No valid books provided')

    const rows = await context.query<{ BookID: number; UnitPrice: number }>(
        `SELECT BookID, UnitPrice FROM Books WHERE BookID IN (${idsToFetch.join(',')})`
    )
    return rows.reduce((map, row) => {
        map[row.BookID] = row.UnitPrice
        return map
    }, {} as Record<number, number>)
}

/** Insert invoice details */
async function insertInvoiceDetails(invoiceId: number, details: _InvoiceDetailPayload[], bookData: Record<number, number>) {
    const currentDate = new Date()
    for (const d of details) {

        const pricePerUnit = (d.price && bookData[d.book_id] != d.price) ? d.price : bookData[d.book_id]
        // console.log(`price of ${d.book_id} = `, pricePerUnit)
        if (pricePerUnit == null) throw new BadRequestError(`Missing price for book ${d.book_id}`)

        const cashDiscount = d.discount ?? 0
        const netPrice = pricePerUnit - cashDiscount

        const query = `
        INSERT INTO InvoiceDetails (InvoiceID, ProductID, PricePerUnit, CashDiscountPerProduct, NetPricePerProduct, Quantity, ChangeDate) 
        VALUES (${invoiceId}, ${d.book_id}, ${pricePerUnit}, ${cashDiscount}, ${netPrice}, ${d.quantity}, ${formatAccessDate(currentDate)})
        `

        await context.query(query)
    }
}
