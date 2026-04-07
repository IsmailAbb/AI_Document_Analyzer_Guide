import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocuments } from '../api/documents'
import UploadDropzone from '../components/UploadDropzone'
import DocumentCard from '../components/DocumentCard'

interface Document {
  id: string
  filename: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [docs, setDocs] = useState<Document[]>([])
  const navigate = useNavigate()

  const fetchDocs = async () => {
    const res = await getDocuments()
    setDocs(res.data)
  }

  useEffect(() => {
    fetchDocs().catch(console.error)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Documents</h1>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
      <UploadDropzone onUploadComplete={fetchDocs} />
      <div className="doc-list">
        {docs.length === 0
          ? <p className="empty-state">No documents yet -- upload a PDF above</p>
          : docs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onStatusChange={fetchDocs} />
            ))
        }
      </div>
    </div>
  )
}
