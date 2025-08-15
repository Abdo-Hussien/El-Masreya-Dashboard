"use client"

import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

            ; (async () => {
                try {
                    setLoading(true)
                    setError(null)

                    const res = await axios.get<T>(url, { signal: controller.signal })
                    setData(res.data)
                } catch (err) {
                    if (!(err instanceof DOMException && err.name === "AbortError")) {
                        const message = err instanceof AxiosError ? err.message : "Unknown error"
                        setError(message)
                        console.error(`Failed to fetch from ${url}:`, err)
                    }
                } finally {
                    setLoading(false)
                }
            })()

        return () => controller.abort()
    }, [url])

    return { data, loading, error }
}
