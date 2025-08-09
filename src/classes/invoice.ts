
import { InvoiceDetail } from "@/classes/InvoiceDetail";

type statusType = "paid" | "unpaid" | "overdue"

export class Invoice {
    customerName: string
    status: statusType
    totalAmount: number
    paidAmount: number
    details: InvoiceDetail[]

    constructor(customerName: string, status: statusType, totalAmount: number, paidAmount: number, details: InvoiceDetail[]) {
        this.customerName = customerName
        this.status = status
        this.totalAmount = totalAmount
        this.paidAmount = paidAmount
        this.details = details
    }

}