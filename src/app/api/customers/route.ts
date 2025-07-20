// src/app/api/customers/route.ts

import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT TOP 10 * FROM Customers');

        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error(err);
        return new NextResponse(JSON.stringify({ message: 'Database error' }), {
            status: 500,
        });
    }
}
