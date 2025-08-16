import { BooksFilters } from "@/interfaces/BooksFilters";
import { Book } from "@/types/Book";
import { useState } from "react";


export const useBooksFilters = (books: Book[]) => {
    const [booksFilters, setBooksFilters] = useState<BooksFilters>({})

    const applyFilters = () => {
        let filteredBooks = books;

        if (booksFilters.category) {
            filteredBooks = filteredBooks.filter(book => book.category === booksFilters.category);
        }
        if (booksFilters.item_name) {
            filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(booksFilters.item_name?.toLowerCase()));
        }
        if (booksFilters.barcode) {
            filteredBooks = filteredBooks.filter(book => book.barcode === booksFilters.barcode);
        }
        if (booksFilters.status !== undefined) {
            filteredBooks = filteredBooks.filter(book => book.status === booksFilters.status);
        }
        if (booksFilters.sort_by_price) {
            filteredBooks.sort((a, b) => booksFilters.sort_ascendingly ? a.price - b.price : b.price - a.price);
        }

        return filteredBooks;
    }
    const clearFilters = () => {
        setBooksFilters({})
    }

    return {
        booksFilters,
        applyFilters,
        clearFilters
    }
}