// src/app/api/customer/[id]/route.ts
import { NextResponse } from 'next/server';

// GET /api/customer/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { getODBC } = await import('@/lib/OdbcDb');
        const conn = await getODBC();
        const result = await conn.query(`SELECT * FROM Customers WHERE CustomerID = ${params.id}`);
        await conn.close();

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/customer/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { DisplayName, CustomerName, Area } = body;

        const { getODBC } = await import('@/lib/OdbcDb');
        const conn = await getODBC();
        const query = `
            UPDATE Customers 
            SET DisplayName = '${DisplayName}', CustomerName = '${CustomerName}', Area = '${Area}'
            WHERE CustomerID = ${params.id}`
        console.log(query)
        await conn.query(query);
        await conn.close();

        return NextResponse.json({ success: true, message: 'Customer updated.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE /api/customer/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { getODBC } = await import('@/lib/OdbcDb');
        const conn = await getODBC();
        await conn.query(`DELETE FROM Customers WHERE CustomerID = ${params.id}`);
        await conn.close();

        return NextResponse.json({ success: true, message: 'Customer deleted.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
