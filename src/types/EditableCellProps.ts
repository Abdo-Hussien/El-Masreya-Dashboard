export type NewEditableCellProps<T = any> = {
    initialValue?: T
    onValueAccepted: (newValue: T) => void
    validate?: (newValue: T) => boolean
    formatter?: (value: T) => string
}