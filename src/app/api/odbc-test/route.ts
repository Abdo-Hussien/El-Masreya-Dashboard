// src/app/api/odbc-test/route.ts
import { NextResponse } from 'next/server';
// import odbc from 'odbc'
export async function GET() {
    try {
        const { getODBC } = await import('@/lib/sql-server-db');
        const conn = await getODBC();
        const result = await conn.query("SELECT 1 AS test")
        console.log("result: ", result)
        await conn.close();
        return NextResponse.json({ success: true, message: 'ODBC connected successfully' });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
