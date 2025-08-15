import { Book } from "@/types/Book"
import axios from "axios"
import { createContext, useEffect, useState } from "react"


type BookContextType = {
    books: Book[]
    isFilterSidebarOpen: boolean
    setFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BooksContext = createContext<BookContextType>({ books: [], isFilterSidebarOpen: false, setFilterSidebarOpen: () => { } })

export default function BooksContextProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([])
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState<boolean>(false)

    useEffect(() => {
        const getBooks = async () => {
            const response = await axios.get('/api/books')
            setBooks(response.data.data)
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