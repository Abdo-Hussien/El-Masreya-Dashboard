import { NextResponse } from 'next/server'
import { query } from '@/scripts/get-invoice-statuses'
import { getConnection } from '@/lib/OdbcDb'

export async function GET() {
    try {
        const context = await getConnection()
        const data = await context.query(query)
        await context.close()

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
