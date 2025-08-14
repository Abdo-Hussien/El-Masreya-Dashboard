// src/app/api/customer/[id]/route.ts
import { getConnection } from '@/lib/OdbcDb';
import { NextResponse } from 'next/server';

// GET /api/customer/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const context = await getConnection();
        const result = await context.query(`SELECT * FROM Customers WHERE CustomerID = ${params.id}`);
        await context.close();

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

        const context = await getConnection();
        const query = `
            UPDATE Customers 
            SET DisplayName = '${DisplayName}', CustomerName = '${CustomerName}', Area = '${Area}'
            WHERE CustomerID = ${params.id}`
        console.log(query)
        await context.query(query);
        await context.close();

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
        const context = await getConnection();
        await context.query(`DELETE FROM Customers WHERE CustomerID = ${params.id}`);
        await context.close();

        return NextResponse.json({ success: true, message: 'Customer deleted.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
