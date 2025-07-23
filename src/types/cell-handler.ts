/**
 * Handler for cell editor operations
 * @description Used for activating editor mode of a cell
 * @example
 * ```typescript
 * const handler: CellHandler = {
 *   activateEditor: () => console.log('Editor activated')
 * }
 * ```
 */
export type InputCellHandler = {
    activateEditor: () => void
}


export type ComboboxCellHandler = {
    openPopover: () => void
}
