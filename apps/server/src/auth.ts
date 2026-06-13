 import bcrypt from 'bcryptjs'
 import jwt from 'jsonwebtoken'
 import { Request, Response, NextFunction } from 'express'
 
 const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
 const SALT_ROUNDS = 10
 
 export function hashPassword(password: string): string {
   return bcrypt.hashSync(password, SALT_ROUNDS)
 }
 
 export function verifyPassword(password: string, hash: string): boolean {
   return bcrypt.compareSync(password, hash)
 }
 
 export function generateToken(userId: string): string {
   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
 }
 
 export function verifyToken(token: string): { userId: string } | null {
   try {
     const decoded = jwt.verify(token, JWT_SECRET)
     return decoded as { userId: string }
   } catch {
     return null
   }
 }
 
 export interface AuthRequest extends Request {
   userId?: string
 }
 
 export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
   const header = req.headers.authorization
   if (!header || !header.startsWith('Bearer ')) {
     res.status(401).json({ error: 'Unauthorized' })
     return
   }
   const token = header.slice(7)
   const payload = verifyToken(token)
   if (!payload) {
     res.status(401).json({ error: 'Invalid token' })
     return
   }
   req.userId = payload.userId
   next()
 }
