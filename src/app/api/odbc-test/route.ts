// src/app/api/odbc-test/route.ts
import { getConnection } from '@/server/OdbcDb';
import { NextResponse } from 'next/server';
// import odbc from 'odbc'
export async function GET() {
    try {
        const context = await getConnection();
        const result = await context.query("SELECT 1 AS test")
        console.log("result: ", result)
        await context.close();
        return NextResponse.json({ success: true, message: 'ODBC connected successfully' });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
