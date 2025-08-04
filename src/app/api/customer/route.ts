// src/app/api/customer/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { getODBC } = await import('@/lib/sql-server-db');
        const conn = await getODBC();
        const data = await conn.query('SELECT * FROM Customers');
        await conn.close();

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { DisplayName, CustomerName, Area, City } = body;

        const { getODBC } = await import('@/lib/sql-server-db');
        const conn = await getODBC();

        const insertSql = `INSERT INTO Customers (DisplayName, CustomerName, Area, City) VALUES ('${DisplayName}', '${CustomerName}', '${Area}', '${City}')`
        await conn.query(insertSql)

        const result = await conn.query<{ LastID: number }>('SELECT MAX(CustomerID) AS LastID FROM Customers');

        await conn.close();

        return NextResponse.json({
            success: true,
            message: 'Customer created.',
            id: result[0].LastID,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
