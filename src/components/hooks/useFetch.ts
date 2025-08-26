"use client"
import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"


export interface FetchResponse<DType> {
    data: DType | null
    loading: boolean
    error: string | null
}

export function useFetch<T>(url: string) {
    const [response, setResponse] = useState<FetchResponse<T>>({
        data: null,
        loading: true,
        error: null
    })

    useEffect(() => {
        (async () => {
            try {

                const res = await axios.get<T>(url)
                setResponse((prev) => ({ ...prev, data: res.data }))
            } catch (err) {
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    const message = err instanceof AxiosError ? err.message : "Unknown error"
                    setResponse((prev) => ({ ...prev, error: message }))
                    console.error(`Failed to fetch from ${url}:`, err)
                }
            } finally {
                setResponse((prev) => ({ ...prev, loading: false }))
            }
        })()

    }, [url])

    return response
}
