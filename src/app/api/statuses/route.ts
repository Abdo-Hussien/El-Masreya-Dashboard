import { NextResponse } from 'next/server'
import { query } from '@/scripts/get-statuses'

export async function GET() {
    try {
        const { getODBC } = await import('@/lib/OdbcDb')
        const conn = await getODBC()
        const data = await conn.query(query)
        await conn.close()

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
