import { NextResponse } from 'next/server'
import { query } from '@/scripts/get-books';
import { getConnection } from '@/server/OdbcDb';

export async function GET() {
    try {
        const context = await getConnection();
        const data = await context.query(query);
        await context.close();

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


// import { getConnection } from '@/lib/db'

// export async function GET() {
//     try {
//         const pool = await getConnection()
//         // Round((1 - Discount1) * UnitPrice, 5) AS Wholesale_price,
//         // IC.DiscountPercent AS ItemtypesCustomers_DiscountPercent,
//         // IC.Direct,
//         const result = await pool.request().query(
//             `SELECT
//     B.BookID,
//     B.BarCode,
//     B.UnitPrice,
//     CAST(SequenceNo AS VARCHAR) + '.' + CAST(OrderingCode AS VARCHAR) + ' ' + B.DisplayName AS productName
// FROM
//     ItemTypes I
//     INNER JOIN Books B ON I.ItemTypeId = B.ItemType
//     -- INNER JOIN ItemtypesCustomers IC ON I.ItemTypeId = IC.ItemtypeId
// WHERE
//     B.BarCode IS NOT NULL
//     AND B.State = 1
// ORDER BY
//     I.SequenceNo,
//     B.OrderingCode,
//     B.DisplayName;
// `)

//         return NextResponse.json(result.recordset)
//     } catch (err) {
//         console.error(err)
//         return new NextResponse(JSON.stringify({ message: 'Database error' }), {
//             status: 500,
//         })
//     }
// }




// import { getConnection } from '@/lib/sql-server-db'
// import { NextResponse } from 'next/server'

// export async function GET() {
//     try {
//         const pool = await getConnection()
//         // IC.Direct,
//         const result = await pool.request().query(
//             `SELECT
//     B.BookID,
//     BarCode = MAX(B.BarCode),
//     UnitPrice = MAX(B.UnitPrice),
//     MAX(CAST(I.SequenceNo AS VARCHAR) + '.' + CAST(B.OrderingCode AS VARCHAR) + ' ' + B.DisplayName) AS productName
// FROM
//     ItemTypes I
//     INNER JOIN Books B ON I.ItemTypeId = B.ItemType
//     INNER JOIN ItemtypesCustomers IC ON I.ItemTypeId = IC.ItemtypeId
// WHERE
//     B.BarCode IS NOT NULL
//     AND B.State = 1
// GROUP BY
//     B.BookID
// ORDER BY
//     MAX(I.SequenceNo),
//     MAX(B.OrderingCode),
//     MAX(B.DisplayName);  -- Now valid

// `)

//         return NextResponse.json(result.recordset)
//     } catch (err) {
//         console.error(err)
//         return new NextResponse(JSON.stringify({ message: 'Database error' }), {
//             status: 500,
//         })
//     }
// }

