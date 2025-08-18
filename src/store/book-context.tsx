import { useBooksFilters } from "@/components/hooks/useBooksFilters"
import { BooksFilters } from "@/interfaces/BooksFilters"
import { Book } from "@/types/Book"
import axios from "axios"
import { createContext, useEffect, useState } from "react"


type BookContextType = {
    books: Book[]
    isFilterSidebarOpen: boolean
    setFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    booksFilters?: BooksFilters
}


const BooksContext = createContext<BookContextType>({} as BookContextType)

export default function BooksContextProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([])
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState<boolean>(false)
    const { booksFilters } = useBooksFilters(books)
    const { } = booksFilters
    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await axios.get('/api/books')
                setBooks(response.data.data)
            } catch (err) {
                console.error("Failed to fetch books: ", err)
            }
        }
        getBooks()
    }, [])


    return (
        <BooksContext.Provider value={{ books, isFilterSidebarOpen, setFilterSidebarOpen }}>
            {children}
        </BooksContext.Provider>
    )
}


export { BooksContext }