import { getConnection } from '@/lib/sql-server-db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const pool = await getConnection()
    const request = pool.request()

    if (req.method === 'GET') {
      const result = await request.input('id', id).query('SELECT * FROM [HP_PC]...[Customers] WHERE CustomerID = @id')
      res.status(200).json({ success: true, data: result.recordset })

    } else if (req.method === 'PUT') {
      const { DisplayName, CustomerName, Area } = req.body

      await request.input('id', id)
        .input('d_name', DisplayName)
        .input('c_name', CustomerName)
        .input('area', Area)
        .query(`
        UPDATE [HP_PC]...[Customers]
        SET DisplayName = @d_name, CustomerName = @c_name, Area = @area
        WHERE CustomerID = @id
      `)

      res.status(200).json({ success: true, message: 'Customer updated.' })

    } else if (req.method === 'DELETE') {
      await request.input('id', id)
        .query('DELETE FROM [HP_PC]...[Customers] WHERE CustomerID = @id')

      res.status(200).json({ success: true, message: 'Customer deleted.' })
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
