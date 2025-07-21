import { getConnection } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const pool = await getConnection()
        const result = await pool.request().query(
                                                `SELECT
                                                    B.BookID,
                                                    B.BarCode,
                                                    B.UnitPrice,
                                                    Round((1 - Discount1) * UnitPrice, 5) AS Wholesale_price,
                                                    IC.DiscountPercent AS ItemtypesCustomers_DiscountPercent,
                                                    IC.Direct,
                                                    [SequenceNo] & "." & [OrderingCode] & " " & [DisplayName] AS productName
                                                FROM
                                                    (
                                                        ItemTypes I
                                                        INNER JOIN Books B ON ItemTypes.ItemTypeId = B.ItemType
                                                    )
                                                    INNER JOIN ItemtypesCustomers IC ON I.ItemTypeId = IC.ItemtypeId
                                                WHERE
                                                        B.BarCode) IS NOT NULL
                                                        AND B.State = 1
                                                ORDER BY
                                                    I.SequenceNo,
                                                    B.OrderingCode,
                                                    B.DisplayName`)

        return NextResponse.json(result.recordset)
    } catch (err) {
        console.error(err)
        return new NextResponse(JSON.stringify({ message: 'Database error' }), {
            status: 500,
        })
    }
}
