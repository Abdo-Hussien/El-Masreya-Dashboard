// useGrid.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import axios, { AxiosError } from 'axios'
import indexedDb, { StoredTableState } from '@/lib/indexed-db'
import { TableState } from '@tanstack/react-table'


export default function useGrid() {
    const [tableState, setTableState] = useState<TableState | null>(null)
    const [gridError, setGridError] = useState<string | null>(null)
    const stateRef = useRef<TableState | null>(null)
    useEffect(() => {
        async function loadState() {
            try {
                const savedState: StoredTableState | undefined = await indexedDb.tableState.get('table1')
                if (savedState?.state) {
                    setTableState(savedState.state)
                }
            } catch (err) {
                console.error('Failed to load table state:', err)
                setGridError('Failed to load table state.')
            }
        }
        loadState()
    }, [])

    // Update stateRef on state change (but don't save to IndexedDB yet)
    const handleStateChange = (newState: TableState) => {
        setTableState(newState)
        stateRef.current = newState // Keep track of latest state
    }

    // Save state to IndexedDB on page unload (e.g., reload)
    useEffect(() => {
        const handleBeforeUnload = async () => {
            if (stateRef.current) {
                try {
                    await indexedDb.tableState.put({ id: 'table1', state: stateRef.current })
                } catch (err) {
                    console.error('Failed to save table state on unload:', err)
                    // Can't setError here as the page is unloading
                }
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    const createTransaction = async () => {
        try {
            const savedState: StoredTableState | undefined = await indexedDb.tableState.get('table1')
            if (!savedState || !savedState.state) {
                setGridError('No table state to upload.')
                return
            }

            const response = await axios.post('/api/upload', savedState.state, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.status === 200) {
                await indexedDb.tableState.delete('table1')
                setTableState(null)
                setGridError(null)
                console.log('Data uploaded successfully:', response.data)
            } else {
                throw new Error(`Unexpected response status: ${response.status}`)
            }
        } catch (err) {
            const errorMessage = err instanceof AxiosError ? err.message : 'Unknown error'
            console.error('Failed to upload table state:', err)
            setGridError(`Failed to upload table state: ${errorMessage}`)
        }
    }

    return {
        tableState,
        gridError,
        handleStateChange,
        createTransaction,
    }
}