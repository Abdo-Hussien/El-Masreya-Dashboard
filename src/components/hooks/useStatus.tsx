import { InvoiceStatus } from "@/interfaces/InvoiceStatus"
import { useState } from "react"


export const useStatus = () => {

    const [selectedStatus, setStatus] = useState<InvoiceStatus>()

    return {
        status: selectedStatus
    }
}