import { NextResponse } from 'next/server'

const fakeProducts = [
    { id: 1, name: "Apple", price: 10 },
    { id: 2, name: "Banana", price: 5 }
]

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.toLowerCase() ?? ''
    const results = fakeProducts.filter(p => p.name.toLowerCase().includes(q))
    return NextResponse.json(results)
}