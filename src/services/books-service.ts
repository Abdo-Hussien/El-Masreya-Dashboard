import axios from "axios"
import { Book } from "@/types/Book"
import { ComboboxItem } from "@/components/ui/combobox"

export class BooksService {
    static async fetchBooks(): Promise<Book[]> {
        const res = await axios.get("/api/book")
        return res.data.data
    }

    static async fetchStatuses(): Promise<ComboboxItem[]> {
        const res = await axios.get("/api/book/status")
        return res.data.data
    }
}
