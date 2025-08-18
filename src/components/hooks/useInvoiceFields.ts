import { useState } from "react"
import { ComboboxItem } from "../ui/combobox"

export const useInvoiceFields = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<ComboboxItem<number>>()
    const [selectedStatus, setSelectedStatus] = useState<ComboboxItem<number>>()
    return {
        selectedCustomer,
        selectedStatus,
        setSelectedCustomer,
        setSelectedStatus
    }
}