import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { queryOne, execute } from '../db'
import { hashPassword, verifyPassword, generateToken } from '../auth'

const router = Router()

router.post('/register', (req: Request, res: Response) => {
  const { email, nickname, password } = req.body
  if (!email || !nickname || !password) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }
  const existing = queryOne('SELECT id FROM users WHERE email = ?', [email])
  if (existing) {
    res.status(409).json({ error: 'Email already registered' })
    return
  }
  const id = uuid()
  const passwordHash = hashPassword(password)
  const now = Date.now()
  execute('INSERT INTO users (id, email, nickname, password_hash, created_at) VALUES (?, ?, ?, ?, ?)', [id, email, nickname, passwordHash, now])
  const token = generateToken(id)
  res.status(201).json({ user: { id, email, nickname }, token })
})

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' })
    return
  }
  const user = queryOne('SELECT id, email, nickname, password_hash FROM users WHERE email = ?', [email])
  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  const token = generateToken(user.id)
  res.json({ user: { id: user.id, email: user.email, nickname: user.nickname }, token })
})

export default router