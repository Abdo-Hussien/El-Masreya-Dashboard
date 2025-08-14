// src/app/api/customer/route.ts
import { NextResponse } from 'next/server'
import { query } from '@/scripts/get-customers'
import { Customer } from '@/interfaces/Customer'
import { getConnection } from '@/lib/OdbcDb'

export async function GET() {
    try {
        const context = await getConnection()
        const data = await context.query<Customer[]>(query)
        await context.close()

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { DisplayName, CustomerName, Area, City } = body;

        const context = await getConnection();

        const insertSql = `INSERT INTO Customers (DisplayName, CustomerName, Area, City) VALUES ('${DisplayName}', '${CustomerName}', '${Area}', '${City}')`
        await context.query(insertSql)

        const result = await context.query<{ LastID: number }>('SELECT MAX(CustomerID) AS LastID FROM Customers');

        await context.close();

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
