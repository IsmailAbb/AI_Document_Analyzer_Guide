import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocuments } from '../api/documents'
import UploadDropzone from '../components/UploadDropzone'
import DocumentCard from '../components/DocumentCard'
import { Toaster } from 'react-hot-toast'

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
        const loadDocs = async () => {
            const res = await getDocuments()
            setDocs(res.data)
        }
        loadDocs().catch(console.error)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <Toaster />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>My Documents</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <UploadDropzone onUploadComplete={fetchDocs} />
      <div style={{ marginTop: 24 }}>
        {docs.length === 0
          ? <p style={{ color: '#888', textAlign: 'center' }}>No documents yet — upload a PDF above</p>
          : docs.map(doc => <DocumentCard key={doc.id} doc={doc} />)
        }
      </div>
    </div>
  )
}