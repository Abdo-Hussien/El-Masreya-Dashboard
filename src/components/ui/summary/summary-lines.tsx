"use client"

import { cn } from "@/lib/utils"
import { useFormatter } from "@/utils/value-formatter"
import { Percent, Banknote } from "lucide-react"
import { useEffect, useState } from "react"
import Divider from "../divider"
import { SaleFormat } from "@/types/sale-format"
import { SummaryAction } from "@/types/summary-action"
import { Mode } from "@/types/mode"


interface SummaryLineProps<T = number> {
    label: string
    value: T
    formatter?: (price: string | number) => string
    action?: React.ReactNode
    children?: React.ReactNode
    labelStyle?: string
    valueStyle?: string
}

interface EditableSummaryLineProps extends SummaryLineProps {
    onChange: (newVal: number) => void
    children?: React.ReactNode
}


const SaleFormatIcon = ({ format, setFormat }: { format: SaleFormat, setFormat: React.Dispatch<SaleFormat> }) => {
    return (
        <div className="cursor-pointer">
            {format == 'percentage' ?
                <Percent size="18" onClick={() => setFormat('number')} className="text-red-700" /> :
                <Banknote onClick={() => setFormat('percentage')} className="text-red-700" />
            }
        </div>
    )
}


const SummaryLine = ({ label, value, formatter, labelStyle, valueStyle, action, children }: SummaryLineProps) => {
    return (
        <div className="flex gap-4 w-full lg:w-1/2 overflow-hidden items-center">
            <p className={cn("flex whitespace-nowrap", labelStyle)}>{label}</p>
            {action}
            <Divider />
            {!children ? <div className={cn(valueStyle)}>{formatter?.(value) || value}</div> : children}
        </div>
    )
}


const EditableSummaryLine = ({ label, value, onChange, labelStyle, formatter, valueStyle, action }: EditableSummaryLineProps) => {
    const [mode, setMode] = useState<Mode>("read")
    const [internalValue, setInternalValue] = useState(value)

    const handleDoubleClick = () => setMode("write")
    const handleBlur = () => setMode("read")
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') setMode("read")
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value)
        setInternalValue(newVal)
        onChange(newVal)
    }

    useEffect(() => {
        console.log("From Summary Lines: ")
        setInternalValue(value)
    }, [value])

    return (
        <SummaryLine value={internalValue} label={label} labelStyle={labelStyle} valueStyle={valueStyle} action={action}>
            {
                mode === "write" ? (
                    <input type="number" autoFocus value={internalValue} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleEnter}
                        className="min-w-0 max-w-20 border-gray-300 bg-transparent focus:outline-none"
                    />
                ) : (
                    <p onDoubleClick={handleDoubleClick} className={cn("cursor-pointer", valueStyle)}>
                        {formatter?.(internalValue)}
                    </p>
                )
            }
        </SummaryLine>
    )
}


const SaleSummaryLine = ({ value, onChange, format, setFormat }: {
    value: number,
    onChange: (object: SummaryAction) => void,
    format: SaleFormat,
    setFormat: React.Dispatch<SaleFormat>
}) => {
    const { parsePrice, parseNumber } = useFormatter()

    const dynamicFormatter = (v: string | number) => {
        return format === 'number' ? parsePrice(v) : parseNumber(Number(v) / 100, { style: 'percent', maximumFractionDigits: 2 });
    }
    return (
        <EditableSummaryLine label="الخصم" value={value} onChange={(newValue: number) => onChange({ type: "set sale", newValue, saleFormat: format })} formatter={dynamicFormatter} valueStyle="text-red-700"
            action={
                <SaleFormatIcon
                    format={format}
                    setFormat={(newFormat) => {
                        onChange({ type: "recalculate totals", saleFormat: newFormat })
                        setFormat(newFormat)
                    }}
                />}
        />
    )
}


const AmountPaidSummaryLine = ({ value, format, onChange }: { value: number, format: SaleFormat, onChange: (object: SummaryAction) => void }) => {
    const { parsePrice } = useFormatter()
    return (
        <EditableSummaryLine label="قيمة المدفوع" value={value} onChange={(newValue: number) => {
            onChange({ type: "set amount paid", newValue, saleFormat: format })
        }} formatter={parsePrice} valueStyle="text-green-800" />
    )
}


export {
    SummaryLine,
    SaleSummaryLine,
    AmountPaidSummaryLine
}