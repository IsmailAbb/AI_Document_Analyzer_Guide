import client from './client'

export const uploadDocument = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return client.post('/documents/upload', formData)
}

export const getDocuments = () =>
  client.get('/documents')

export const getResult = (id: string) =>
  client.get(`/documents/${id}/result`)