/* eslint-disable @typescript-eslint/no-unused-vars */



import EditableComboboxCell from "./editable-combobox-cell";

interface ProductsComboboxCellProps {
    row: any
    column: any
    products: string[]
    cellRefs: React.RefObject<Record<string, any>>
    setInvoiceData: (value: string) => void
    className?: string
}


const ProductsComboboxCell = ({ row, column, products, cellRefs, setInvoiceData }: ProductsComboboxCellProps) => {

    const cellValue = row.getValue(column.id)
    return (
        <div className="flex justify-center">
            <EditableComboboxCell id={`${column.id}-${row.id}`}
                selectedItem={cellValue}
                items={products}
                onChange={(newValue: string) => { setInvoiceData(newValue) }}
            />

        </div>
    )
}
export default ProductsComboboxCell