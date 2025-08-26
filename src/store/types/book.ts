import { ComboboxItem } from "@/components/ui/combobox"
import { BooksFilters } from "@/interfaces/BooksFilters"
import { Book } from "@/types/Book"

export interface BookContextType {
    books: Book[]
    originalBooks: Book[]
    isFilterSidebarOpen: boolean
    setFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    booksFilters: BooksFilters
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>
    applyFilters: () => Book[]
    clearFilters: () => void
    setFilters: (newFilters: BooksFilters) => void
    comboBooksTitles: ComboboxItem[]
    comboBooksBarcodes: ComboboxItem[]
    bookStatuses: ComboboxItem[]
}
