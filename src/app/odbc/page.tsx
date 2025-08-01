'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

type Status = 'loading' | 'success' | 'error'
type Step =
  | 'test-connection'
  | 'read-all-customers'
  | 'create-customer'
  | 'read-customer'
  | 'update-customer'
  | 'delete-customer'

export default function ODBC() {
  const [status, setStatus] = useState<Status>('loading')
  const [step, setStep] = useState<Step>('test-connection')
  const [logs, setLogs] = useState<string[]>([])

  const log = (msg: string) => setLogs((prev) => [...prev, msg])
  const testAll = async () => {
    try {
      log('🔌 Testing connection...')
      const connectionRes = await axios.get('/api/odbc-test')
      if (!connectionRes.data.success) throw new Error(connectionRes.data.error)
      log('Connection OK.')

      setStep('read-all-customers')
      log('📤 Reading all customers...')
      const readAllRes = await axios.get('/api/customer')
      log(`Fetched all customers: ${JSON.stringify(readAllRes.data.data)}`)

      setStep('create-customer')
      log('📤 Creating test customer...')
      const createRes = await axios.post('/api/customer', { DisplayName: 'mohamedhussien._', CustomerName: 'Mohamed Hussien', Area: 'Heliopolis', City: 'Cairo' })
      const customerId = createRes.data.id
      log('Customer created.')

      setStep('read-customer')
      log('📥 Reading test customer...')
      const readRes = await axios.get(`/api/customer/${customerId}`)
      log(`Fetched customer: ${JSON.stringify(readRes.data.data[0])}`)

      setStep('update-customer')
      log('✏️ Updating test customer...')
      await axios.put(`/api/customer/${customerId}`, { DisplayName: 'mohamed', CustomerName: 'Mohamed H.', Area: 'El Nozha' })
      log('Customer updated.')

      setStep('delete-customer')
      log('🗑 Deleting test customer...')
      await axios.delete(`/api/customer/${customerId}`)
      log('Customer deleted.')

      setStatus('success')
    } catch (error: any) {
      setStatus('error')
      log(`Error during '${step}': ${error.message}`)
    }
  }

  useEffect(() => {
    testAll()
  }, [])

  return (
    <div dir='ltr' className="p-6 font-sans space-y-4">
      <h2 className="text-2xl font-extrabold">ODBC + CRUD Test</h2>

      <p className="text-gray-700">
        <strong>Status:</strong>{' '}
        {status === 'loading' && 'Processing...'}
        {status === 'success' && <span className="text-green-600">✅ All operations passed.</span>}
        {status === 'error' && <span className="text-red-600">❌ Test failed at: {step}</span>}
      </p>

      <div className="bg-gray-100 p-4 rounded-md font-light text-sm whitespace-pre-wrap">
        {logs.map((log, idx) => (
          <div key={idx}>{log.length > 100 ? log.substring(0, 200) + '...' : log}</div>
        ))}
      </div>
    </div>
  )
}
