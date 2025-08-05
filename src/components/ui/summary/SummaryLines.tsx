"use client"

import { cn } from "@/lib/Utils"
import { parseNumber, parsePrice } from "@/utils/value-formatter"
import { ReactNode, useContext, useEffect, useState } from "react"
import Divider from "../divider"
import { InvoiceContext } from "@/store/invoice-context"
import { Mode } from "@/types/Mode"

interface SummaryLineProps<T = number> {
    label: string
    value: T
    inlineSlot?: ReactNode
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

const SummaryLine = ({ label, value, formatter, labelStyle, valueStyle, action, children, inlineSlot }: SummaryLineProps) => {
    return (
        <div className="relative flex gap-4 w-full lg:w-1/2 overflow-hidden items-center">
            <p className={cn("flex whitespace-nowrap", labelStyle)}>{label}</p>
            {action}
            {inlineSlot}
            <Divider />
            {!children ? <div className={cn(valueStyle)}>{formatter?.(value) || value}</div> : children}
        </div>
    )
}

const EditableSummaryLine = ({ label, value, onChange, labelStyle, formatter, valueStyle, action, children }: EditableSummaryLineProps) => {
    const [mode, setMode] = useState<Mode>("read")
    const [internalValue, setInternalValue] = useState(value)

    const handleDoubleClick = () => setMode("write")
    const handleBlur = () => setMode("read")
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") setMode("read")
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value)
        setInternalValue(newVal)
        onChange(newVal)
    }

    useEffect(() => {
        setInternalValue(value)
    }, [value])

    return (
        <SummaryLine value={internalValue} label={label} labelStyle={labelStyle} valueStyle={valueStyle} action={action}
            inlineSlot={children}
        >
            {mode === "write" ? (
                <input
                    type="number"
                    autoFocus
                    value={internalValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleEnter}
                    className="min-w-0 max-w-20 border-gray-300 bg-transparent focus:outline-none"
                />
            ) : (
                <p onDoubleClick={handleDoubleClick} className={cn("cursor-pointer", valueStyle)}>
                    {formatter?.(internalValue)}
                </p>
            )}
        </SummaryLine>
    )
}

const SaleSummaryLine = () => {
    const { summaryFields, execute } = useContext(InvoiceContext)
    const percentageValue = parseNumber(
        summaryFields.sale / summaryFields.subTotal,
        { style: "percent", minimumFractionDigits: 2 }
    )
    return (
        <EditableSummaryLine
            label="الخصم"
            value={summaryFields.sale}
            onChange={(newValue: number) => execute({ type: "set sale", newValue })}
            formatter={parsePrice}
            valueStyle="text-red-700"
        >
            <Divider />
            <p className="text-gray-500">{percentageValue}</p>
        </EditableSummaryLine>
    )
}

const AmountPaidSummaryLine = () => {
    const { summaryFields, execute } = useContext(InvoiceContext)

    return (
        <EditableSummaryLine
            label="قيمة المدفوع"
            value={summaryFields.amountPaid}
            onChange={(newValue: number) => execute({ type: "set amount paid", newValue })}
            formatter={parsePrice}
            valueStyle="text-green-800"
        />
    )
}

export {
    SummaryLine,
    SaleSummaryLine,
    AmountPaidSummaryLine
}
