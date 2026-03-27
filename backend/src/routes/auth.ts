import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db'

const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required', code: 'MISSING_FIELDS' })

  const hash = await bcrypt.hash(password, 10)

  try {
    const result = await pool.query(
      'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id, email',
      [email, hash]
    )
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    })
    res.status(201).json({ token })
  } catch (err: any) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email already exists', code: 'EMAIL_TAKEN' })
    throw err
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: 'Invalid credentials', code: 'BAD_CREDENTIALS' })

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  res.json({ token })
})

export default router