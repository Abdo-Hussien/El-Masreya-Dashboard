import { getConnection } from '@/lib/sql-server-db'
import sql from 'mssql'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = await getConnection()

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM [HP_PC]...[Customers]')
      res.status(200).json({ success: true, data: result.recordset })
    } else if (req.method === 'POST') {
      const { DisplayName, CustomerName, Area, City } = req.body
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('DisplayName', DisplayName)
        .input('CustomerName', CustomerName)
        .input('Area', Area)
        .input('City', City)
        .output('CustomerID', sql.Int)
        .execute('InsertCustomerAndReturnId')

      res.status(201).json({ success: true, message: 'Customer created.', id: result.output.CustomerID })
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
