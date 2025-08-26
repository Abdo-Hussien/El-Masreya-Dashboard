import { ComboboxItem } from "@/components/ui/combobox"

type _filter = ComboboxItem | undefined

export interface BooksFilters {
    category?: _filter
    item_name?: _filter
    barcode?: _filter
    status?: _filter
    sort_by_price?: _filter
}