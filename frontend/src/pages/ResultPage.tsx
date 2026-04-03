import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResult } from '../api/documents'

interface Entity {
  name: string
  type: string
}

interface AnalysisData {
  summary: string
  key_points: string[]
  entities: Entity[]
  document_type: string
}

interface AnalysisResult {
  extracted_data: AnalysisData
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadResult = async () => {
      const res = await getResult(id!)
      setResult(res.data)
    }
    loadResult().catch(console.error)
  }, [id])

  if (!result) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>

  const data = result.extracted_data

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 24 }}>
        ← Back to Dashboard
      </button>
      <h1>Analysis Result</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Key Points</h2>
        <ul>
          {data.key_points?.map((point: string, i: number) => <li key={i}>{point}</li>)}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Entities</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.entities?.map((e: Entity, i: number) => (
            <span key={i} style={{
              background: '#e0e7ff',
              padding: '4px 10px',
              borderRadius: 99,
              fontSize: 13
            }}>
              {e.name} <span style={{ color: '#6366f1' }}>({e.type})</span>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Document Type</h2>
        <p style={{ textTransform: 'capitalize' }}>{data.document_type}</p>
      </section>
    </div>
  )
}