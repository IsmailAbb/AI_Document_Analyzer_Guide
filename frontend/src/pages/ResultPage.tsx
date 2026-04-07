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
    getResult(id!).then(res => setResult(res.data)).catch(console.error)
  }, [id])

  if (!result) return <p className="empty-state" style={{ marginTop: 80 }}>Loading...</p>

  const data = result.extracted_data

  return (
    <div className="page result-page">
      <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
      <h1 style={{ margin: '24px 0' }}>Analysis Result</h1>

      <section>
        <h2>Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section>
        <h2>Key Points</h2>
        <ul>
          {data.key_points?.map((point, i) => (
            <li key={i}>{typeof point === 'string' ? point : (point as { name: string }).name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Entities</h2>
        <div className="entity-list">
          {data.entities?.map((e, i) => (
            <span key={i} className="entity-tag">
              {e.name} <span className="entity-type">({e.type})</span>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Document Type</h2>
        <span className="doc-type-badge">{data.document_type}</span>
      </section>
    </div>
  )
}
