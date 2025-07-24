import { getConnection } from '@/lib/sql-server-db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const pool = await getConnection()
        const result = await pool.request().query(`SELECT CustomerID, DisplayName
                                                    FROM Customers
                                                    WHERE State = 1
                                                    ORDER BY DisplayName`)
        pool.close()
        return NextResponse.json(result.recordset)
    } catch (err) {
        console.error(err)
        return new NextResponse(JSON.stringify({ message: 'Database error' }), {
            status: 500,
        })
    }
}




