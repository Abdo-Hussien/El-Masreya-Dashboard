import { createContext, useEffect, useState } from "react"
import { useBooksFilters } from "@/components/hooks/useBooksFilters"
import { BookContextType } from "./types/book"
import { Book } from "@/types/Book"
import { ComboboxItem } from "@/components/ui/combobox"
import { BooksService } from "@/services/books-service"

const BooksContext = createContext<BookContextType>({} as BookContextType)

export default function BooksContextProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([])
    const [originalBooks, setOriginalBooks] = useState<Book[]>([])
    const [bookStatuses, setBookStatuses] = useState<ComboboxItem[]>([])
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState<boolean>(false)

    const { booksFilters, applyFilters, clearFilters, setFilters } = useBooksFilters(originalBooks)

    const comboBooksTitles = books.map((b) => ({ label: b.bookTitle, value: b.id }))
    const comboBooksBarcodes = books.map((b) => ({ label: b.barcode, value: b.id }))

    useEffect(() => {
        const loadData = async () => {
            try {
                const [booksData, statuses] = await Promise.all([
                    BooksService.fetchBooks(),
                    BooksService.fetchStatuses(),
                ])
                setBooks(booksData)
                setOriginalBooks(booksData)
                setBookStatuses(statuses)
            } catch (err) {
                console.error("Failed to fetch books: ", err)
            }
        }

        loadData()
    }, [])

    return (
        <BooksContext.Provider
            value={{
                books,
                originalBooks,
                bookStatuses,
                booksFilters,
                applyFilters,
                setBooks,
                clearFilters,
                setFilters,
                isFilterSidebarOpen,
                setFilterSidebarOpen,
                comboBooksBarcodes,
                comboBooksTitles,
            }}
        >
            {children}
        </BooksContext.Provider>
    )
}

export { BooksContext }
