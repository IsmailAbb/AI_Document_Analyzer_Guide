import { useDropzone } from 'react-dropzone'
import { uploadDocument } from '../api/documents'
import toast from 'react-hot-toast'

interface Props {
  onUploadComplete: () => void
}

export default function UploadDropzone({ onUploadComplete }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (accepted, rejected) => {
      if (rejected.length > 0) {
        toast.error('File rejected — must be a PDF under 10MB')
        return
      }
      const toastId = toast.loading('Uploading and analyzing...')
      try {
        await uploadDocument(accepted[0])
        toast.success('Analysis complete!', { id: toastId })
        onUploadComplete()
      } catch {
        toast.error('Upload failed', { id: toastId })
      }
    }
  })

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ccc',
        borderRadius: 8,
        padding: 40,
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#f0f0ff' : 'transparent'
      }}
    >
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Drop it here!' : 'Drag & drop a PDF, or click to select'}</p>
      <p style={{ fontSize: 12, color: '#888' }}>Max 10MB</p>
    </div>
  )
}