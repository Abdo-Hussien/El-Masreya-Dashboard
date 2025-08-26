import { BooksFilters } from "@/interfaces/BooksFilters";
import { Book } from "@/types/Book";
import { useState } from "react";


export const useBooksFilters = (books: Book[]) => {
    const [booksFilters, setBooksFilters] = useState<BooksFilters>({})

    const applyFilters = () => {
        let filteredBooks = books;
        console.log(booksFilters)
        if (booksFilters.item_name) {
            filteredBooks = filteredBooks.filter(book => book.bookTitle.toLowerCase().includes(booksFilters.item_name?.label?.toLowerCase() ?? ''));
        }
        if (booksFilters.category) {
            filteredBooks = filteredBooks.filter(book => book.category_id === booksFilters.category?.value);
        }
        if (booksFilters.barcode) {
            filteredBooks = filteredBooks.filter(book => book.barcode === booksFilters.barcode?.label);
        }
        if (booksFilters.status) {
            filteredBooks = filteredBooks.filter(book => book.status === booksFilters.status?.value);
        }
        const sortBy = Number(booksFilters.sort_by_price?.value);
        if (!isNaN(sortBy)) {
            filteredBooks = filteredBooks.sort((a, b) => sortBy === 0 ? a.price - b.price : b.price - a.price);
        }
        console.log('original books:', books)
        console.log('filtered books:', filteredBooks)

        return filteredBooks;
    }
    const clearFilters = () => {
        setBooksFilters({})
    }
    const setFilters = (newFilters: BooksFilters) => {
        setBooksFilters(newFilters)
    }

    return {
        booksFilters,
        applyFilters,
        setFilters,
        clearFilters
    }
}