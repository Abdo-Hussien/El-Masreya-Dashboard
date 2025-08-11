export type Book = {
    barcode: string
    bookTitle: string
    unitsAvailable: number
    wholesalePrice: number // الفئة
    price: number // السعر
    packSize: number // القطع
    [key: string]: any
}