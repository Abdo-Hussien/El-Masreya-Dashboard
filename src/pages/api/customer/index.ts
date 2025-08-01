import { getODBC } from '@/lib/sql-server-db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    const pool = await getODBC()
    if (req.method === 'GET') {
      const data = await pool.query('SELECT * FROM Customers')
      res.status(200).json({ success: true, data })
    } else if (req.method === 'POST') {
      const { DisplayName, CustomerName, Area, City } = req.body

      const sql = `
        INSERT INTO Customers (DisplayName, CustomerName, Area, City)
        VALUES ('${DisplayName}', '${CustomerName}', '${Area}', '${City}')
      `;

      await pool.query(sql)
      const result = await pool.query<{ LastID: number }>('SELECT MAX(CustomerID) AS LastID FROM Customers');

      res.status(201).json({ success: true, message: 'Customer created.', id: result[0].LastID })
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    await pool.close()
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
