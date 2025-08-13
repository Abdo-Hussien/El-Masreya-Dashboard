import { handleError } from '@/utils/error-handler'
import { BadRequestError, BaseError, NotFoundError } from '@/utils/errors'
import { NextResponse } from 'next/server'
import type { Connection } from 'odbc'

interface InvoicePayload {
    customer_id: number
    amount_paid: number
    amount_refunded: number
    discount: number
    status_id: number
    override_is_wholesale: boolean
}

interface InvoiceDetailPayload {
    book_id: number
    price?: number
    quantity: number
    discount: number
}

function formatAccessDate(date: any) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `#${mm}/${dd}/${yyyy} ${hh}:${mi}:${ss}#`;
}

export async function POST(request: Request) {
    const { getODBC } = await import('@/lib/OdbcDb')
    const conn = await getODBC()

    let transactionStarted = false

    try {
        const body = await request.json()
        const invoice: InvoicePayload = body.invoice
        const invDetails: InvoiceDetailPayload[] = body.inv_details
        // --- Start Transaction ---
        await conn.beginTransaction()
        transactionStarted = true

        // Step 1: Validate customer
        await validateCustomer(conn, invoice.customer_id)
        // Step 2: Create invoice
        const invoiceId = await insertInvoice(conn, invoice)

        // Step 3: Insert invoice details
        const bookData = await getBookData(conn, invDetails)
        await insertInvoiceDetails(conn, invoiceId, invDetails, bookData)

        // --- Commit ---
        await conn.commit()

        return NextResponse.json({ success: true, message: `Invoice created successfully`, id: invoiceId })
    }
    catch (error: any) {
        console.log("Did rollback: ", transactionStarted)
        if (transactionStarted) await conn.rollback()
        return handleError(error)
    }
    finally {
        await conn.close()
    }
}

/** Validate customer existence */
async function validateCustomer(conn: Connection, customerId: number) {
    const res = await conn.query<{ found: number }>(
        `SELECT COUNT(CustomerID) as found FROM Customers WHERE CustomerID = ${customerId}`
    )
    if (!res[0].found) throw new NotFoundError(`Customer not found`)
}

/** Insert invoice and return new ID */
async function insertInvoice(conn: Connection, invoice: InvoicePayload) {
    const query = `
        INSERT INTO Invoices (CustomerDisplayName, InvoiceDate, ChangeDate, Total, PaidAmount, CashDiscount, Status, UserID, InvoiceExport)
        VALUES (${invoice.customer_id}, ${formatAccessDate(new Date())}, ${formatAccessDate(new Date())}, ${0}, ${invoice.amount_paid}, ${invoice.discount}, ${invoice.status_id}, ${0}, 'فاتورة')
        `
    await conn.query(query)

    const res = await conn.query<{ lastId: number }>(
        `SELECT MAX(InvoiceID) as lastId FROM Invoices`
    )
    return res[0].lastId
}

/** Fetch book info for items missing price */
async function getBookData(conn: Connection, invDetails: InvoiceDetailPayload[]) {
    const idsToFetch = invDetails.map(d => d.book_id)

    if (idsToFetch.length === 0) return {}

    const rows = await conn.query<{ BookID: number; UnitPrice: number }>(
        `SELECT BookID, UnitPrice FROM Books WHERE BookID IN (${idsToFetch.join(',')})`
    )
    return rows.reduce((map, row) => {
        map[row.BookID] = row.UnitPrice
        return map
    }, {} as Record<number, number>)
}

/** Insert invoice details */
async function insertInvoiceDetails(
    conn: any,
    invoiceId: number,
    details: InvoiceDetailPayload[],
    bookData: Record<number, number>
) {
    for (const d of details) {

        const pricePerUnit = d.price ?? bookData[d.book_id]
        if (pricePerUnit == null) throw new BadRequestError(`Missing price for book ID ${d.book_id}`)

        const cashDiscount = d.discount ?? 0
        const netPrice = pricePerUnit - cashDiscount

        const query = `
        INSERT INTO InvoiceDetails (InvoiceID, ProductID, PricePerUnit, CashDiscountPerProduct, NetPricePerProduct, Quantity) 
        VALUES (${invoiceId}, ${d.book_id}, ${pricePerUnit}, ${cashDiscount}, ${netPrice}, ${d.quantity})
        `

        await conn.query(query)
    }
}
