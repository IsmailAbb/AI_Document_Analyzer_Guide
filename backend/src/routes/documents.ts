import { Router, Response } from 'express'
import multer from 'multer'
import axios from 'axios'
import pool from '../config/db'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// Upload a PDF
router.post('/upload', requireAuth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!req.file)
    return res.status(400).json({ error: 'No file uploaded', code: 'NO_FILE' })

  if (req.file.mimetype !== 'application/pdf')
    return res.status(400).json({ error: 'Only PDFs accepted', code: 'INVALID_TYPE' })

  // Create DB record
  const doc = await pool.query(
    'INSERT INTO documents(user_id, filename, storage_key, status) VALUES($1, $2, $3, $4) RETURNING id',
    [req.user!.id, req.file.originalname, `temp-${Date.now()}`, 'processing']
  )
  const documentId = doc.rows[0].id

  // Call AI service
  try {
    const formData = new FormData()
    const blob = new Blob([req.file.buffer as BlobPart], { type: 'application/pdf' })
    formData.append('file', blob, req.file.originalname)

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    // Save result
    await pool.query(
      'INSERT INTO analysis_results(document_id, summary, extracted_data, model_used) VALUES($1, $2, $3, $4)',
      [documentId, aiResponse.data.summary, JSON.stringify(aiResponse.data), 'gpt-4o-mini']
    )

    await pool.query('UPDATE documents SET status = $1 WHERE id = $2', ['done', documentId])
    res.json({ documentId, status: 'done' })
  } catch (err: unknown){
    console.error('Upload error:', err)
    await pool.query('UPDATE documents SET status = $1 WHERE id = $2', ['error', documentId])
    res.status(500).json({ error: 'AI processing failed', code: 'AI_ERROR' })
  }
})

// List user's documents
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT id, filename, status, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user!.id]
  )
  res.json(result.rows)
})

// Get analysis result
router.get('/:id/result', requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    `SELECT ar.* FROM analysis_results ar
     JOIN documents d ON d.id = ar.document_id
     WHERE ar.document_id = $1 AND d.user_id = $2`,
    [req.params.id, req.user!.id]
  )
  if (!result.rows[0])
    return res.status(404).json({ error: 'Result not found', code: 'NOT_FOUND' })

  res.json(result.rows[0])
})

export default router