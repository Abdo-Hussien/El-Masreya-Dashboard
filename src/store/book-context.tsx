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
            console.log(response.data.data)
            setBooks(response.data.data)
        }
        getBooks()
    }, [])
    // const books: Book[] = [
    //     {
    //         bookTitle: "Book1",
    //         id: "224253579345",
    //         price: 400,
    //         quantityInStock: 43,
    //         quantityPerPack: 67,
    //         wholesalePrice: 345
    //     },
    //     {
    //         bookTitle: "Book2",
    //         id: "953579657",
    //         price: 500,
    //         quantityInStock: 43,
    //         quantityPerPack: 67,
    //         wholesalePrice: 345
    //     },
    //     {
    //         bookTitle: "Book3",
    //         id: "3524253572342",
    //         price: 237,
    //         quantityInStock: 43,
    //         quantityPerPack: 67,
    //         wholesalePrice: 345
    //     }

    // ]

    return (
        <BooksContext.Provider value={{ books, isFilterSidebarOpen, setFilterSidebarOpen }}>
            {children}
        </BooksContext.Provider>
    )
}


export { BooksContext }