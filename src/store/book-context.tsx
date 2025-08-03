import { Book } from "@/types/book"
import { createContext, useState } from "react"


type BookContextType = {
    books: Book[]
    isFilterSidebarOpen: boolean
    setFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BooksContext = createContext<BookContextType>({ books: [], isFilterSidebarOpen: false, setFilterSidebarOpen: () => { } })

export default function BooksContextProvider({ children }: { children: React.ReactNode }) {

    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState<boolean>(false)
    const books: Book[] = [
        {
            bookTitle: "Book1",
            id: "224253579345",
            price: 400,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        },
        {
            bookTitle: "Book2",
            id: "953579657",
            price: 500,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        },
        {
            bookTitle: "Book3",
            id: "3524253572342",
            price: 237,
            quantityInStock: 43,
            quantityPerPack: 67,
            wholesalePrice: 345
        }

    ]

    return (
        <BooksContext.Provider value={{ books, isFilterSidebarOpen, setFilterSidebarOpen }}>
            {children}
        </BooksContext.Provider>
    )
}


export { BooksContext }