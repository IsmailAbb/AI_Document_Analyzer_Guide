import { useNavigate } from 'react-router-dom'

interface Props {
  doc: {
    id: string
    filename: string
    status: string
    created_at: string
  }
}

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  done: '#10b981',
  error: '#ef4444'
}

export default function DocumentCard({ doc }: Props) {
  const navigate = useNavigate()

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p style={{ fontWeight: 600, margin: 0 }}>{doc.filename}</p>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
          {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          background: statusColor[doc.status] || '#ccc',
          color: 'white',
          padding: '2px 10px',
          borderRadius: 99,
          fontSize: 12
        }}>
          {doc.status}
        </span>
        {doc.status === 'done' && (
          <button onClick={() => navigate(`/result/${doc.id}`)}>
            View Result
          </button>
        )}
      </div>
    </div>
  )
}