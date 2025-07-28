import { InvoiceDetail } from "@/classes/invoice-detail"
import { SummaryAction } from "@/types/summary-action"
import { SummaryFields, SummaryFieldsBuilder } from "@/types/summary-fields"
import { createContext, useReducer } from "react"


type InvoiceContextType = {
    summaryFields: SummaryFields
    execute: React.Dispatch<SummaryAction>
}

const InvoiceContext = createContext<InvoiceContextType>({
    summaryFields: new SummaryFieldsBuilder().build(),
    execute: () => { }
})


export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {
    const invoice1 = new InvoiceDetail("9781234567897", "JavaScript Essentials", 2, 50, 100, 10)
    const invoice2 = new InvoiceDetail("9789876543210", "React Mastery", 1, 75, 75, 0)
    const invoice3 = new InvoiceDetail("9781111111111", "Database Systems", 3, 40, 120, 15)
    const invoice4 = new InvoiceDetail("9782222222222", "Python for Beginners", 5, 25, 125, 20)

    const details = [invoice1, invoice2, invoice3, invoice4]

    const calculateSubTotal = (invoiceDetails: InvoiceDetail[]) =>
        invoiceDetails.map((detail) => detail.total).reduce((acc, total) => acc + total, 0)

    function reducer(state: SummaryFields, action: SummaryAction): SummaryFields {
        let newState: SummaryFields
        switch (action.type) {
            case "set sale":
                newState = { ...state, sale: action.newValue }
                break
            case "set amount paid":
                newState = { ...state, amountPaid: action.newValue }
                break
            case "recalculate totals":
                newState = { ...state }
                break
            default:
                return state
        }

        const total = action.saleFormat === "percentage"
            ? newState.subTotal * (1 - newState.sale / 100)
            : newState.subTotal - newState.sale

        const finalTotal = total - newState.amountPaid
        console.log("newState: ", newState)
        return { ...newState, total, finalTotal }
    }

    const initialFields = new SummaryFieldsBuilder()
        .setSubTotal(calculateSubTotal(details))
        .build()

    const [summaryFields, execute] = useReducer(reducer, initialFields)

    return (
        <InvoiceContext.Provider value={{ summaryFields, execute }}>
            {children}
        </InvoiceContext.Provider>
    )
}


export { InvoiceContext }