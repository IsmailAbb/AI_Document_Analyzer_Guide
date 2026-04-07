import { useNavigate } from 'react-router-dom'
import { useDocumentStatus } from '../hooks/useDocumentStatus'

interface Props {
  doc: {
    id: string
    filename: string
    status: string
    created_at: string
  }
  onStatusChange?: () => void
}

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  done: '#10b981',
  error: '#ef4444'
}

export default function DocumentCard({ doc, onStatusChange }: Props) {
  const navigate = useNavigate()
  const status = useDocumentStatus(doc.id, doc.status)

  if (status !== doc.status && status === 'done' && onStatusChange) {
    onStatusChange()
  }

  return (
    <div className="doc-card">
      <div>
        <p className="doc-filename">{doc.filename}</p>
        <p className="doc-date">
          {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="doc-actions">
        <span className="status-badge" style={{ background: statusColor[status] || '#ccc' }}>
          {status}
        </span>
        {status === 'done' && (
          <button className="btn btn-sm" onClick={() => navigate(`/result/${doc.id}`)}>
            View Result
          </button>
        )}
      </div>
    </div>
  )
}
