import { ColumnDef } from "@tanstack/react-table"
import { Book } from "@/types/Book"
import { parseNumber, parsePrice } from "@/utils/value-formatter"
import CellRenderer from "../cells/cell-renderer"
import BtnHeader from "../headers/btn-header"

export const bookColumns: ColumnDef<Book>[] = [
    {
        accessorKey: "bookTitle",
        header: "السلعة",
        cell: ({ getValue }) => <CellRenderer value={getValue() as string} />,
    },
    {
        accessorKey: "wholesalePrice",
        header: ({ column }) => <BtnHeader column={column} title="فئة" />,
        cell: ({ getValue }) => <CellRenderer value={getValue() as number} formatter={parsePrice} />,
        enableSorting: true,
    },
    {
        accessorKey: "price",
        header: ({ column }) => <BtnHeader column={column} title="السعر" />,
        cell: ({ getValue }) => <CellRenderer value={getValue() as number} formatter={parsePrice} />,
        enableSorting: true,
    },
    {
        accessorKey: "unitsAvailable",
        header: "العدد في المخزن",
        cell: ({ getValue }) => <CellRenderer value={getValue() as number} formatter={parseNumber} />,
    },
    {
        accessorKey: "packSize",
        header: "القطع",
        cell: ({ getValue }) => <CellRenderer value={getValue() as number} formatter={parseNumber} />,
    }
]
