import { createContext } from "react"


type BookContextType = {
    test: string
}

const BookContext = createContext<BookContextType>({ test: "" })

export default function InvoiceContextProvider({ children }: { children: React.ReactNode }) {

    return (
        <BookContext.Provider value={{ test: "Hello" }}>
            {children}
        </BookContext.Provider>
    )
}