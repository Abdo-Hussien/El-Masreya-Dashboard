

import { useEffect, useState } from 'react'

export function useProducts() {
    const [products, setProducts] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProducts = async () => {
            const res = await fetch("/api/products")
            if (!res.ok) {
                setLoading(false)
                return
            }

            const productsData = await res.json()
            const productNames = productsData.map((product: { productName: string }) => product.productName)
            setProducts(productNames)
            setLoading(false)
        }
        getProducts()
    }, [])

    return { products, loading }
}