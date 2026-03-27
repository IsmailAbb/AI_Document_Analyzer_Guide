import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import documentRoutes from './routes/documents'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok' }))
app.use('/auth', authRoutes)
app.use('/documents', documentRoutes)

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' })
})

app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`))