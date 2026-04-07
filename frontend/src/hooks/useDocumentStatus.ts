import { useState, useEffect, useCallback } from 'react'
import client from '../api/client'

export function useDocumentStatus(docId: string, initialStatus: string) {
  const [status, setStatus] = useState(initialStatus)

  const checkStatus = useCallback(async () => {
    try {
      const res = await client.get(`/documents/${docId}/result`)
      if (res.data) setStatus('done')
    } catch {
      // result not ready yet — keep polling
    }
  }, [docId])

  useEffect(() => {
    if (initialStatus === 'done' || initialStatus === 'error') return

    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [initialStatus, checkStatus])

  return status
}
