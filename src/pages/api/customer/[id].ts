import { getODBC } from '@/lib/sql-server-db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  try {
    const pool = await getODBC()
    if (req.method === 'GET') {
      const result = await pool.query(`SELECT * FROM Customers WHERE CustomerID = ${id}`)
      res.status(200).json({ success: true, data: result })
    } else if (req.method === 'PUT') {
      const { DisplayName, CustomerName, Area } = req.body

      await pool.query(`
        UPDATE Customers
        SET DisplayName = '${DisplayName}', CustomerName = '${CustomerName}', Area = '${Area}'
        WHERE CustomerID = ${id}
      `)

      res.status(200).json({ success: true, message: 'Customer updated.' })

    } else if (req.method === 'DELETE') {
      await pool.query(`DELETE FROM Customers WHERE CustomerID = ${id}`)

      res.status(200).json({ success: true, message: 'Customer deleted.' })
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    await pool.close()
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
