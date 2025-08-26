import { ComboboxItem } from "@/components/ui/combobox"
import axios from "axios"
import { createContext, useEffect, useState } from "react"


type CategoryContextType = {
    categories: ComboboxItem[]
}


const CategoriesContext = createContext<CategoryContextType>({} as CategoryContextType)

export default function CategoriesContextProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<ComboboxItem[]>([])
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get('/api/category')
                setCategories(response.data.data)
            } catch (err) {
                console.error("Failed to fetch books: ", err)
            }
        }
        getCategories()
    }, [])

    return (
        <CategoriesContext.Provider value={{ categories }}>
            {children}
        </CategoriesContext.Provider>
    )
}


export { CategoriesContext }