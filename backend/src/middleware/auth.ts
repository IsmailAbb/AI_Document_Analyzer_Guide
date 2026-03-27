import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
    }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' })
  }
}