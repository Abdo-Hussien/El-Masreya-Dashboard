import { FormatterFunction } from "@/types/Formatter"

export default function CellRenderer({ value, formatter }: { value: number | string, formatter?: FormatterFunction }) {
    return <div className="text-right">{formatter?.(value) || value}</div>
}