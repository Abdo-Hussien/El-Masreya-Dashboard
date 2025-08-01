import { getODBC } from '@/lib/sql-server-db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed')

  try {
    const pool = await getODBC()
    console.debug("ODBC: Connected")
    await pool.close()
    res.status(200).json({ success: true, message: 'SQL Server linked connection successful' })
    await pool.close()
  } catch (error: any) {
    console.error('SQL Server linked error:', error)
    res.status(500).json({ success: false, message: 'SQL Server linked connection failed', error: error.message, })
  }
}
