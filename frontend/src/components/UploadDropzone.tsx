import { useDropzone } from 'react-dropzone'
import { uploadDocument } from '../api/documents'
import toast from 'react-hot-toast'

interface Props {
  onUploadComplete: () => void
}

export default function UploadDropzone({ onUploadComplete }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    onDrop: async (accepted, rejected) => {
      if (rejected.length > 0) {
        toast.error('File rejected -- must be a PDF under 10MB')
        return
      }
      try {
        await uploadDocument(accepted[0])
        toast.success('Uploaded! Analyzing in background...')
        onUploadComplete()
      } catch {
        toast.error('Upload failed')
      }
    }
  })

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Drop it here!' : 'Drag & drop a PDF, or click to select'}</p>
      <p className="hint">Max 10MB</p>
    </div>
  )
}
