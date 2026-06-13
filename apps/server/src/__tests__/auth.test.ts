 import { describe, it, expect } from 'vitest'
 import { hashPassword, verifyPassword, generateToken, verifyToken } from '../auth.js'
 
 describe('auth utilities', () => {
   it('hashes and verifies password', () => {
     const hash = hashPassword('test123')
     expect(hash).not.toBe('test123')
     expect(verifyPassword('test123', hash)).toBe(true)
     expect(verifyPassword('wrong', hash)).toBe(false)
   })
 
   it('generates and verifies JWT token', () => {
     const token = generateToken('user-1')
     expect(typeof token).toBe('string')
     const payload = verifyToken(token)
     expect(payload).not.toBeNull()
     expect(payload!.userId).toBe('user-1')
   })
 
   it('returns null for invalid token', () => {
     expect(verifyToken('invalid-token')).toBeNull()
   })
 })
