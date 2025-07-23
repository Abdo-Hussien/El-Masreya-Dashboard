
import Dexie, { Table } from 'dexie'
import { TableState } from '@tanstack/react-table'

export interface StoredTableState {
    id: string
    state: TableState | null
}

class InvoiceDetailsTableDB extends Dexie {
    tableState!: Table<StoredTableState>

    constructor() {
        super('InvoiceDetailsTable')
        this.version(1).stores({
            tableState: 'id, state',
        })
    }
}

const indexedDb = new InvoiceDetailsTableDB()
export default indexedDb