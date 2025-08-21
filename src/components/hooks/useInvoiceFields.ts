import { useState } from "react"
import { ComboboxItem } from "../ui/combobox"

export const useInvoiceFields = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<ComboboxItem<number>>()
    const [selectedStatus, setSelectedStatus] = useState<ComboboxItem<number>>({ label: "لم يتم التحاسب", value: 1 })
    return {
        selectedCustomer,
        selectedStatus,
        setSelectedCustomer,
        setSelectedStatus
    }
}