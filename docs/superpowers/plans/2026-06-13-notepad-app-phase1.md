 # Notepad App Phase 1 — Foundation Implementation Plan
 
 > **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
 
 **Goal:** Build the monorepo foundation, shared core types, backend auth + note CRUD API, and basic web app with login/register and note management.
 
 **Architecture:** pnpm monorepo with Turborepo. packages/core defines all data models and storage interfaces. apps/server provides REST API with JWT auth. apps/web consumes the API with React + Vite + React Router.
 
 **Tech Stack:** pnpm workspaces, Turborepo, TypeScript 5, Vitest, Node.js + Express, better-sqlite3, React 18, Vite, React Router 6, Tailwind CSS.
 
 ---
 
 ### Task 1: Monorepo Scaffold
 
 **Files:**
 - Create: `package.json`
 - Create: `pnpm-workspace.yaml`
 - Create: `turbo.json`
 - Create: `tsconfig.base.json`
 - Create: `.gitignore`
 
 - [ ] **Step 1: Create root config files**
 
 `package.json`:
 ```json
 {
   "name": "notepad-monorepo",
   "private": true,
   "scripts": {
     "dev": "turbo dev",
     "build": "turbo build",
     "test": "turbo test",
     "lint": "turbo lint"
   },
   "devDependencies": {
     "turbo": "^2.0.0",
     "typescript": "^5.5.0",
     "prettier": "^3.3.0"
   },
   "packageManager": "pnpm@9.0.0"
 }
 ```
 
 `pnpm-workspace.yaml`:
 ```yaml
 packages:
   - "packages/*"
   - "apps/*"
 ```
 
 `turbo.json`:
 ```json
 {
   "$schema": "https://turbo.build/schema.json",
   "tasks": {
     "build": {
       "dependsOn": ["^build"],
       "outputs": ["dist/**"]
     },
     "test": {
       "dependsOn": ["build"],
       "outputs": []
     },
     "dev": {
       "cache": false,
       "persistent": true
     },
     "lint": {
       "outputs": []
     }
   }
 }
 ```
 
 `tsconfig.base.json`:
 ```json
 {
   "compilerOptions": {
     "target": "ES2022",
     "module": "ESNext",
     "moduleResolution": "bundler",
     "strict": true,
     "esModuleInterop": true,
     "skipLibCheck": true,
     "forceConsistentCasingInFileNames": true,
     "declaration": true,
     "declarationMap": true,
     "sourceMap": true
   }
 }
 ```
 
 `.gitignore`:
 ```
 node_modules/
 dist/
 .turbo/
 *.tsbuildinfo
 .superpowers/
 ```
 
 - [ ] **Step 2: Install dependencies**
 
 Run: `pnpm install`
 Expected: node_modules created, workspace ready
 
 - [ ] **Step 3: Verify structure**
 
 Run: `pnpm ls -r`
 Expected: Empty workspace with no packages yet
 
 - [ ] **Step 4: Commit**
 
 ```bash
 git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .gitignore
 git commit -m "chore: init monorepo with pnpm + turborepo"
 ```
 
 ---
 
 ### Task 2: packages/core — Data Models
 
 **Files:**
 - Create: `packages/core/package.json`
 - Create: `packages/core/tsconfig.json`
 - Create: `packages/core/src/index.ts`
 - Create: `packages/core/src/types.ts`
 
 - [ ] **Step 1: Create package config**
 
 `packages/core/package.json`:
 ```json
 {
   "name": "@notepad/core",
   "version": "0.1.0",
   "private": true,
   "main": "./dist/index.js",
   "types": "./dist/index.d.ts",
   "exports": {
     ".": {
       "import": "./dist/index.js",
       "types": "./dist/index.d.ts"
     }
   },
   "scripts": {
     "build": "tsc",
     "test": "vitest run",
     "dev": "tsc --watch"
   },
   "devDependencies": {
     "typescript": "^5.5.0",
     "vitest": "^2.0.0"
   }
 }
 ```
 
 `packages/core/tsconfig.json`:
 ```json
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "outDir": "dist",
     "rootDir": "src"
   },
   "include": ["src"]
 }
 ```
 
 - [ ] **Step 2: Write data model types**
 
 `packages/core/src/types.ts`:
 ```typescript
 export interface User {
   id: string
   email: string
   nickname: string
   avatar: string | null
   createdAt: number
 }
 
 export interface Note {
   id: string
   userId: string
   title: string
   content: NoteContent
   themeId: string
   size: { width: number; height: number }
   position: { x: number; y: number }
   tags: string[]
   folderId: string | null
   linkedUrl: string | null
   linkedApp: string | null
   version: number
   createdAt: number
   updatedAt: number
   deletedAt: number | null
 }
 
 export interface NoteContent {
   text: string
   drawing: string | null
   images: Attachment[]
   recordings: Attachment[]
 }
 
 export interface Attachment {
   id: string
   name: string
   mimeType: string
   path: string
   insertedAt: number
 }
 
 export interface Folder {
   id: string
   name: string
   parentId: string | null
   color: string
   icon: string
   createdAt: number
 }
 
 export interface Tag {
   id: string
   name: string
   color: string
 }
 
 export interface SharePermission {
   noteId: string
   sharedBy: string
   sharedWith: string
   permission: 'read' | 'edit'
   status: 'pending' | 'accepted' | 'rejected' | 'blocked'
   createdAt: number
 }
 
 export interface UserSettings {
   userId: string
   globalShortcut: string
   receiveEnabled: boolean
   receiveWhitelist: string[]
   defaultTheme: string
 }
 ```
 
 - [ ] **Step 3: Write package entry point**
 
 `packages/core/src/index.ts`:
 ```typescript
 export * from './types'
 ```
 
 - [ ] **Step 4: Build package**
 
 Run: `cd packages/core && npx tsc`
 Expected: dist/index.js + dist/index.d.ts + dist/types.js + dist/types.d.ts created
 
 - [ ] **Step 5: Commit**
 
 ```bash
 git add packages/core/
 git commit -m "feat(core): add data model types"
 ```
 
 ---
 
 ### Task 3: packages/core — StorageAdapter Interface + Tests
 
 **Files:**
 - Create: `packages/core/src/storage/StorageAdapter.ts`
 - Create: `packages/core/src/storage/index.ts`
 - Create: `packages/core/src/__tests__/types.test.ts`
 
 - [ ] **Step 1: Write the failing test**
 
 `packages/core/src/__tests__/types.test.ts`:
 ```typescript
 import { describe, it, expect } from 'vitest'
 import { Note, Folder, Tag, SharePermission, UserSettings, NoteContent, Attachment } from '../types'
 
 describe('Note model', () => {
   it('creates a valid note with required fields', () => {
     const note: Note = {
       id: 'note-1',
       userId: 'user-1',
       title: 'Test Note',
       content: {
         text: 'Hello',
         drawing: null,
         images: [],
         recordings: []
       },
       themeId: 'classic-white',
       size: { width: 300, height: 200 },
       position: { x: 0, y: 0 },
       tags: ['work'],
       folderId: null,
       linkedUrl: null,
       linkedApp: null,
       version: 1,
       createdAt: Date.now(),
       updatedAt: Date.now(),
       deletedAt: null
     }
     expect(note.id).toBe('note-1')
     expect(note.content.text).toBe('Hello')
     expect(note.size.width).toBe(300)
   })
 
   it('accepts attachments', () => {
     const attachment: Attachment = {
       id: 'att-1',
       name: 'photo.png',
       mimeType: 'image/png',
       path: '/files/att-1.png',
       insertedAt: Date.now()
     }
     const content: NoteContent = {
       text: 'With image',
       drawing: null,
       images: [attachment],
       recordings: []
     }
     expect(content.images).toHaveLength(1)
     expect(content.images[0].mimeType).toBe('image/png')
   })
 })
 
 describe('SharePermission model', () => {
   it('creates a pending share permission', () => {
     const perm: SharePermission = {
       noteId: 'note-1',
       sharedBy: 'user-a',
       sharedWith: 'user-b',
       permission: 'edit',
       status: 'pending',
       createdAt: Date.now()
     }
     expect(perm.status).toBe('pending')
     expect(perm.permission).toBe('edit')
   })
 })
 
 describe('UserSettings model', () => {
   it('creates default settings', () => {
     const settings: UserSettings = {
       userId: 'user-1',
       globalShortcut: 'Ctrl+Shift+N',
       receiveEnabled: true,
       receiveWhitelist: [],
       defaultTheme: 'classic-white'
     }
     expect(settings.receiveEnabled).toBe(true)
     expect(settings.globalShortcut).toBe('Ctrl+Shift+N')
   })
 })
 ```
 
 - [ ] **Step 2: Run test to verify it fails (expected — no test runner config yet)**
 
 Run: `cd packages/core && npx vitest run`
 Expected: Tests fail because vitest is not yet installed properly
 
 - [ ] **Step 3: Install vitest in the package**
 
 Run: `cd packages/core && pnpm add -D vitest`
 Expected: vitest installed
 
 - [ ] **Step 4: Add vitest config**
 
 Add to `packages/core/package.json`:
 ```json
   "vitest": {
     "include": ["src/**/__tests__/**/*.test.ts"]
   }
 ```
 
 - [ ] **Step 5: Run tests again**
 
 Run: `cd packages/core && pnpm test`
 Expected: All 3 tests pass
 
 - [ ] **Step 6: Write StorageAdapter interface**
 
 `packages/core/src/storage/StorageAdapter.ts`:
 ```typescript
 import { Note, Folder, Tag, SharePermission } from '../types'
 
 export interface StorageAdapter {
   // Notes
   getNote(id: string): Promise<Note | null>
   getAllNotes(userId: string): Promise<Note[]>
   saveNote(note: Note): Promise<void>
   deleteNote(id: string): Promise<void>
   getNotesByUrl(url: string, userId: string): Promise<Note[]>
 
   // Folders
   getFolders(userId: string): Promise<Folder[]>
   saveFolder(folder: Folder): Promise<void>
   deleteFolder(id: string): Promise<void>
 
   // Tags
   getTags(userId: string): Promise<Tag[]>
   saveTag(tag: Tag): Promise<void>
 
   // Share
   getSharePermissions(noteId: string): Promise<SharePermission[]>
   saveSharePermission(perm: SharePermission): Promise<void>
 }
 ```
 
 `packages/core/src/storage/index.ts`:
 ```typescript
 export { StorageAdapter } from './StorageAdapter'
 ```
 
 - [ ] **Step 7: Update package entry point**
 
 `packages/core/src/index.ts`:
 ```typescript
 export * from './types'
 export * from './storage'
 ```
 
 - [ ] **Step 8: Build and test**
 
 Run: `cd packages/core && npx tsc && pnpm test`
 Expected: Build succeeds, all tests pass
 
 - [ ] **Step 9: Commit**
 
 ```bash
 git add packages/core/
 git commit -m "feat(core): add StorageAdapter interface and model tests"
 ```
 
 ---
 
 ### Task 4: apps/server — Backend Scaffold with Auth
 
 **Files:**
 - Create: `apps/server/package.json`
 - Create: `apps/server/tsconfig.json`
 - Create: `apps/server/src/index.ts`
 - Create: `apps/server/src/db.ts`
 - Create: `apps/server/src/auth.ts`
 - Create: `apps/server/src/routes/auth.ts`
 - Create: `apps/server/src/__tests__/auth.test.ts`
 
 - [ ] **Step 1: Create package config**
 
 `apps/server/package.json`:
 ```json
 {
   "name": "@notepad/server",
   "version": "0.1.0",
   "private": true,
   "type": "module",
   "scripts": {
     "dev": "tsx watch src/index.ts",
     "build": "tsc",
     "start": "node dist/index.js",
     "test": "vitest run"
   },
   "dependencies": {
     "@notepad/core": "workspace:*",
     "express": "^4.19.0",
     "better-sqlite3": "^11.0.0",
     "bcryptjs": "^2.4.3",
     "jsonwebtoken": "^9.0.0",
     "cors": "^2.8.5",
     "uuid": "^10.0.0"
   },
   "devDependencies": {
     "@types/express": "^4.17.21",
     "@types/better-sqlite3": "^7.6.11",
     "@types/bcryptjs": "^2.4.6",
     "@types/jsonwebtoken": "^9.0.6",
     "@types/cors": "^2.8.17",
     "@types/uuid": "^10.0.0",
     "tsx": "^4.16.0",
     "typescript": "^5.5.0",
     "vitest": "^2.0.0",
     "supertest": "^7.0.0",
     "@types/supertest": "^6.0.2"
   }
 }
 ```
 
 `apps/server/tsconfig.json`:
 ```json
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "outDir": "dist",
     "rootDir": "src"
   },
   "include": ["src"]
 }
 ```
 
 - [ ] **Step 2: Write database layer**
 
 `apps/server/src/db.ts`:
 ```typescript
 import Database from 'better-sqlite3'
 import path from 'path'
 
 const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'notepad.db')
 
 let db: Database.Database
 
 export function getDb(): Database.Database {
   if (!db) {
     db = new Database(DB_PATH)
     db.pragma('journal_mode = WAL')
     db.pragma('foreign_keys = ON')
     initSchema()
   }
   return db
 }
 
 function initSchema(): void {
   const database = db
   database.exec(`
     CREATE TABLE IF NOT EXISTS users (
       id TEXT PRIMARY KEY,
       email TEXT UNIQUE NOT NULL,
       nickname TEXT NOT NULL,
       password_hash TEXT NOT NULL,
       avatar TEXT,
       created_at INTEGER NOT NULL DEFAULT (unixepoch())
     );
 
     CREATE TABLE IF NOT EXISTS notes (
       id TEXT PRIMARY KEY,
       user_id TEXT NOT NULL,
       title TEXT NOT NULL DEFAULT '',
       content_text TEXT NOT NULL DEFAULT '',
       content_drawing TEXT,
       theme_id TEXT NOT NULL DEFAULT 'classic-white',
       size_w INTEGER NOT NULL DEFAULT 300,
       size_h INTEGER NOT NULL DEFAULT 200,
       pos_x REAL NOT NULL DEFAULT 0,
       pos_y REAL NOT NULL DEFAULT 0,
       tags TEXT NOT NULL DEFAULT '[]',
       folder_id TEXT,
       linked_url TEXT,
       linked_app TEXT,
       version INTEGER NOT NULL DEFAULT 1,
       created_at INTEGER NOT NULL DEFAULT (unixepoch()),
       updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
       deleted_at INTEGER,
       FOREIGN KEY (user_id) REFERENCES users(id)
     );
 
     CREATE TABLE IF NOT EXISTS folders (
       id TEXT PRIMARY KEY,
       user_id TEXT NOT NULL,
       name TEXT NOT NULL,
       parent_id TEXT,
       color TEXT NOT NULL DEFAULT '#e0e0e0',
       icon TEXT NOT NULL DEFAULT 'folder',
       created_at INTEGER NOT NULL DEFAULT (unixepoch()),
       FOREIGN KEY (user_id) REFERENCES users(id)
     );
 
     CREATE TABLE IF NOT EXISTS tags (
       id TEXT PRIMARY KEY,
       user_id TEXT NOT NULL,
       name TEXT NOT NULL,
       color TEXT NOT NULL DEFAULT '#888',
       FOREIGN KEY (user_id) REFERENCES users(id)
     );
   `)
 }
 
 export function closeDb(): void {
   if (db) {
     db.close()
     db = undefined as any
   }
 }
 ```
 
 - [ ] **Step 3: Write auth utilities**
 
 `apps/server/src/auth.ts`:
 ```typescript
 import bcrypt from 'bcryptjs'
 import jwt from 'jsonwebtoken'
 
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
 
 export function authMiddleware(req: any, res: any, next: any): void {
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
 ```
 
 - [ ] **Step 4: Write auth routes**
 
 `apps/server/src/routes/auth.ts`:
 ```typescript
 import { Router, Request, Response } from 'express'
 import { v4 as uuid } from 'uuid'
 import { getDb } from '../db'
 import { hashPassword, verifyPassword, generateToken } from '../auth'
 
 const router = Router()
 
 router.post('/register', (req: Request, res: Response) => {
   const { email, nickname, password } = req.body
   if (!email || !nickname || !password) {
     res.status(400).json({ error: 'Missing required fields' })
     return
   }
   const db = getDb()
   const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
   if (existing) {
     res.status(409).json({ error: 'Email already registered' })
     return
   }
   const id = uuid()
   const passwordHash = hashPassword(password)
   db.prepare(
     'INSERT INTO users (id, email, nickname, password_hash) VALUES (?, ?, ?, ?)'
   ).run(id, email, nickname, passwordHash)
   const token = generateToken(id)
   res.status(201).json({ user: { id, email, nickname }, token })
 })
 
 router.post('/login', (req: Request, res: Response) => {
   const { email, password } = req.body
   if (!email || !password) {
     res.status(400).json({ error: 'Missing email or password' })
     return
   }
   const db = getDb()
   const user = db.prepare('SELECT id, email, nickname, password_hash FROM users WHERE email = ?').get(email) as any
   if (!user || !verifyPassword(password, user.password_hash)) {
     res.status(401).json({ error: 'Invalid email or password' })
     return
   }
   const token = generateToken(user.id)
   res.json({ user: { id: user.id, email: user.email, nickname: user.nickname }, token })
 })
 
 export default router
 ```
 
 - [ ] **Step 5: Write main server entry**
 
 `apps/server/src/index.ts`:
 ```typescript
 import express from 'express'
 import cors from 'cors'
 import authRoutes from './routes/auth'
 import noteRoutes from './routes/notes'
 import { getDb, closeDb } from './db'
 
 const app = express()
 const PORT = parseInt(process.env.PORT || '3001', 10)
 
 app.use(cors())
 app.use(express.json())
 
 app.use('/api/auth', authRoutes)
 app.use('/api/notes', noteRoutes)
 
 app.get('/api/health', (_req, res) => {
   res.json({ status: 'ok' })
 })
 
 const server = app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`)
   getDb()
 })
 
 function shutdown(): void {
   closeDb()
   server.close()
   process.exit(0)
 }
 
 process.on('SIGINT', shutdown)
 process.on('SIGTERM', shutdown)
 
 export default app
 ```
 
 - [ ] **Step 6: Install dependencies and test startup**
 
 Run: `cd apps/server && pnpm install`
 Run: `cd apps/server && npx tsx src/index.ts &` then `curl http://localhost:3001/api/health`
 Expected: Server starts, health endpoint returns `{"status":"ok"}`
 Kill the server process after verification.
 
 - [ ] **Step 7: Commit**
 
 ```bash
 git add apps/server/
 git commit -m "feat(server): add backend scaffold with SQLite and auth"
 ```
 
 ---
 
 ### Task 5: apps/server — Note CRUD Routes + Tests
 
 **Files:**
 - Create: `apps/server/src/routes/notes.ts`
 - Create: `apps/server/src/__tests__/notes.test.ts`
 
 - [ ] **Step 1: Write note CRUD routes**
 
 `apps/server/src/routes/notes.ts`:
 ```typescript
 import { Router, Request, Response } from 'express'
 import { v4 as uuid } from 'uuid'
 import { getDb } from '../db'
 import { authMiddleware } from '../auth'
 
 const router = Router()
 router.use(authMiddleware)
 
 // GET /api/notes — list all notes for current user
 router.get('/', (req: Request, res: Response) => {
   const db = getDb()
   const notes = db.prepare(
     `SELECT id, title, theme_id as themeId, size_w as sizeW, size_h as sizeH, 
             pos_x as posX, pos_y as posY, tags, folder_id as folderId,
             linked_url as linkedUrl, linked_app as linkedApp, version,
             created_at as createdAt, updated_at as updatedAt
      FROM notes WHERE user_id = ? AND deleted_at IS NULL
      ORDER BY updated_at DESC`
   ).all(req.userId)
   res.json({ notes })
 })
 
 // GET /api/notes/:id — get single note
 router.get('/:id', (req: Request, res: Response) => {
   const db = getDb()
   const note = db.prepare(
     `SELECT * FROM notes WHERE id = ? AND user_id = ? AND deleted_at IS NULL`
   ).get(req.params.id, req.userId) as any
   if (!note) {
     res.status(404).json({ error: 'Note not found' })
     return
   }
   res.json({
     note: {
       id: note.id,
       userId: note.user_id,
       title: note.title,
       content: {
         text: note.content_text,
         drawing: note.content_drawing,
         images: [],
         recordings: []
       },
       themeId: note.theme_id,
       size: { width: note.size_w, height: note.size_h },
       position: { x: note.pos_x, y: note.pos_y },
       tags: JSON.parse(note.tags || '[]'),
       folderId: note.folder_id,
       linkedUrl: note.linked_url,
       linkedApp: note.linked_app,
       version: note.version,
       createdAt: note.created_at,
       updatedAt: note.updated_at
     }
   })
 })
 
 // POST /api/notes — create note
 router.post('/', (req: Request, res: Response) => {
   const { title, content, themeId, size, position, tags, folderId, linkedUrl, linkedApp } = req.body
   const id = uuid()
   const now = Date.now()
   const db = getDb()
   db.prepare(`
     INSERT INTO notes (id, user_id, title, content_text, content_drawing, theme_id, size_w, size_h, pos_x, pos_y, tags, folder_id, linked_url, linked_app, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `).run(
     id, req.userId, title || '',
     content?.text || '', content?.drawing || null,
     themeId || 'classic-white',
     size?.width || 300, size?.height || 200,
     position?.x || 0, position?.y || 0,
     JSON.stringify(tags || []), folderId || null,
     linkedUrl || null, linkedApp || null,
     now, now
   )
   res.status(201).json({ id })
 })
 
 // PUT /api/notes/:id — update note
 router.put('/:id', (req: Request, res: Response) => {
   const { title, content, themeId, size, position, tags, folderId, linkedUrl, linkedApp } = req.body
   const now = Date.now()
   const db = getDb()
   const result = db.prepare(`
     UPDATE notes SET
       title = COALESCE(?, title),
       content_text = COALESCE(?, content_text),
       content_drawing = COALESCE(?, content_drawing),
       theme_id = COALESCE(?, theme_id),
       size_w = COALESCE(?, size_w),
       size_h = COALESCE(?, size_h),
       pos_x = COALESCE(?, pos_x),
       pos_y = COALESCE(?, pos_y),
       tags = COALESCE(?, tags),
       folder_id = COALESCE(?, folder_id),
       linked_url = COALESCE(?, linked_url),
       linked_app = COALESCE(?, linked_app),
       version = version + 1,
       updated_at = ?
     WHERE id = ? AND user_id = ? AND deleted_at IS NULL
   `).run(
     title, content?.text, content?.drawing, themeId,
     size?.width, size?.height, position?.x, position?.y,
     tags ? JSON.stringify(tags) : null, folderId, linkedUrl, linkedApp,
     now, req.params.id, req.userId
   )
   if (result.changes === 0) {
     res.status(404).json({ error: 'Note not found' })
     return
   }
   res.json({ success: true })
 })
 
 // DELETE /api/notes/:id — soft delete
 router.delete('/:id', (req: Request, res: Response) => {
   const db = getDb()
   const result = db.prepare(
     'UPDATE notes SET deleted_at = ?, version = version + 1 WHERE id = ? AND user_id = ?'
   ).run(Date.now(), req.params.id, req.userId)
   if (result.changes === 0) {
     res.status(404).json({ error: 'Note not found' })
     return
   }
   res.json({ success: true })
 })
 
 export default router
 ```
 
 - [ ] **Step 2: Write auth middleware test**
 
 `apps/server/src/__tests__/auth.test.ts`:
 ```typescript
 import { describe, it, expect } from 'vitest'
 import { hashPassword, verifyPassword, generateToken, verifyToken } from '../auth'
 
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
 ```
 
 - [ ] **Step 3: Add vitest config to server package.json**
 
 Add to `apps/server/package.json`:
 ```json
   "vitest": {
     "include": ["src/**/__tests__/**/*.test.ts"]
   }
 ```
 
 - [ ] **Step 4: Run tests**
 
 Run: `cd apps/server && pnpm test`
 Expected: All tests pass
 
 - [ ] **Step 5: Commit**
 
 ```bash
 git add apps/server/
 git commit -m "feat(server): add note CRUD routes and auth tests"
 ```
 
 ---
 
 ### Task 6: apps/web — React + Vite Scaffold
 
 **Files:**
 - Create: `apps/web/package.json`
 - Create: `apps/web/tsconfig.json`
 - Create: `apps/web/tsconfig.node.json`
 - Create: `apps/web/vite.config.ts`
 - Create: `apps/web/index.html`
 - Create: `apps/web/src/main.tsx`
 - Create: `apps/web/src/App.tsx`
 - Create: `apps/web/src/vite-env.d.ts`
 - Create: `apps/web/src/api/client.ts`
 
 - [ ] **Step 1: Create package config**
 
 `apps/web/package.json`:
 ```json
 {
   "name": "@notepad/web",
   "version": "0.1.0",
   "private": true,
   "type": "module",
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview",
     "test": "vitest run"
   },
   "dependencies": {
     "@notepad/core": "workspace:*",
     "react": "^18.3.0",
     "react-dom": "^18.3.0",
     "react-router-dom": "^6.25.0"
   },
   "devDependencies": {
     "@types/react": "^18.3.0",
     "@types/react-dom": "^18.3.0",
     "@vitejs/plugin-react": "^4.3.0",
     "typescript": "^5.5.0",
     "vite": "^5.4.0",
     "vitest": "^2.0.0"
   }
 }
 ```
 
 `apps/web/tsconfig.json`:
 ```json
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "jsx": "react-jsx",
     "outDir": "dist",
     "rootDir": "src"
   },
   "include": ["src"]
 }
 ```
 
 `apps/web/tsconfig.node.json`:
 ```json
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "moduleResolution": "bundler",
     "allowImportingTsExtensions": true,
     "noEmit": true
   },
   "include": ["vite.config.ts"]
 }
 ```
 
 `apps/web/vite.config.ts`:
 ```typescript
 import { defineConfig } from 'vite'
 import react from '@vitejs/plugin-react'
 
 export default defineConfig({
   plugins: [react()],
   server: {
     port: 5173,
     proxy: {
       '/api': 'http://localhost:3001'
     }
   }
 })
 ```
 
 `apps/web/index.html`:
 ```html
 <!DOCTYPE html>
 <html lang="zh-TW">
 <head>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>記事本</title>
 </head>
 <body>
   <div id="root"></div>
   <script type="module" src="/src/main.tsx"></script>
 </body>
 </html>
 ```
 
 - [ ] **Step 2: Write app entry files**
 
 `apps/web/src/main.tsx`:
 ```tsx
 import React from 'react'
 import ReactDOM from 'react-dom/client'
 import { BrowserRouter } from 'react-router-dom'
 import App from './App'
 
 ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </React.StrictMode>
 )
 ```
 
 `apps/web/src/vite-env.d.ts`:
 ```typescript
 /// <reference types="vite/client" />
 ```
 
 - [ ] **Step 3: Write API client**
 
 `apps/web/src/api/client.ts`:
 ```typescript
 const API_BASE = '/api'
 
 function getToken(): string | null {
   return localStorage.getItem('token')
 }
 
 async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
   const token = getToken()
   const headers: Record<string, string> = {
     'Content-Type': 'application/json',
     ...(options.headers as Record<string, string>)
   }
   if (token) {
     headers['Authorization'] = `Bearer ${token}`
   }
   const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
   if (res.status === 401) {
     localStorage.removeItem('token')
     localStorage.removeItem('user')
     window.location.href = '/login'
     throw new Error('Unauthorized')
   }
   if (!res.ok) {
     const err = await res.json().catch(() => ({ error: 'Request failed' }))
     throw new Error(err.error || 'Request failed')
   }
   return res.json()
 }
 
 export const api = {
   // Auth
   register: (email: string, nickname: string, password: string) =>
     request<{ user: any; token: string }>('/auth/register', {
       method: 'POST',
       body: JSON.stringify({ email, nickname, password })
     }),
   login: (email: string, password: string) =>
     request<{ user: any; token: string }>('/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password })
     }),
 
   // Notes
   getNotes: () =>
     request<{ notes: any[] }>('/notes'),
   getNote: (id: string) =>
     request<{ note: any }>(`/notes/${id}`),
   createNote: (data: any) =>
     request<{ id: string }>('/notes', {
       method: 'POST',
       body: JSON.stringify(data)
     }),
   updateNote: (id: string, data: any) =>
     request<{ success: boolean }>(`/notes/${id}`, {
       method: 'PUT',
       body: JSON.stringify(data)
     }),
   deleteNote: (id: string) =>
     request<{ success: boolean }>(`/notes/${id}`, {
       method: 'DELETE'
     })
 }
 ```
 
 - [ ] **Step 4: Install dependencies**
 
 Run: `cd apps/web && pnpm install`
 Expected: Dependencies installed
 
 - [ ] **Step 5: Commit**
 
 ```bash
 git add apps/web/
 git commit -m "feat(web): scaffold React + Vite app with API client"
 ```
 
 ---
 
 ### Task 7: apps/web — Auth Pages (Login / Register)
 
 **Files:**
 - Create: `apps/web/src/pages/Login.tsx`
 - Create: `apps/web/src/pages/Register.tsx`
 - Modify: `apps/web/src/App.tsx`
 
 - [ ] **Step 1: Write Login page**
 
 `apps/web/src/pages/Login.tsx`:
 ```tsx
 import { useState } from 'react'
 import { useNavigate, Link } from 'react-router-dom'
 import { api } from '../api/client'
 
 export default function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const navigate = useNavigate()
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setError('')
     try {
       const { user, token } = await api.login(email, password)
       localStorage.setItem('token', token)
       localStorage.setItem('user', JSON.stringify(user))
       navigate('/notes')
     } catch (err: any) {
       setError(err.message)
     }
   }
 
   return (
     <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
       <h1>登入</h1>
       {error && <p style={{ color: 'red' }}>{error}</p>}
       <form onSubmit={handleSubmit}>
         <div style={{ marginBottom: 12 }}>
           <label>Email</label><br />
           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
             style={{ width: '100%', padding: 8 }} />
         </div>
         <div style={{ marginBottom: 12 }}>
           <label>密碼</label><br />
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
             style={{ width: '100%', padding: 8 }} />
         </div>
         <button type="submit" style={{ padding: '8px 24px', cursor: 'pointer' }}>登入</button>
       </form>
       <p style={{ marginTop: 16 }}>
         還沒有帳號？<Link to="/register">註冊</Link>
       </p>
     </div>
   )
 }
 ```
 
 - [ ] **Step 2: Write Register page**
 
 `apps/web/src/pages/Register.tsx`:
 ```tsx
 import { useState } from 'react'
 import { useNavigate, Link } from 'react-router-dom'
 import { api } from '../api/client'
 
 export default function Register() {
   const [email, setEmail] = useState('')
   const [nickname, setNickname] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const navigate = useNavigate()
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setError('')
     try {
       const { user, token } = await api.register(email, nickname, password)
       localStorage.setItem('token', token)
       localStorage.setItem('user', JSON.stringify(user))
       navigate('/notes')
     } catch (err: any) {
       setError(err.message)
     }
   }
 
   return (
     <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
       <h1>註冊</h1>
       {error && <p style={{ color: 'red' }}>{error}</p>}
       <form onSubmit={handleSubmit}>
         <div style={{ marginBottom: 12 }}>
           <label>Email</label><br />
           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
             style={{ width: '100%', padding: 8 }} />
         </div>
         <div style={{ marginBottom: 12 }}>
           <label>暱稱</label><br />
           <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required
             style={{ width: '100%', padding: 8 }} />
         </div>
         <div style={{ marginBottom: 12 }}>
           <label>密碼</label><br />
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
             style={{ width: '100%', padding: 8 }} />
         </div>
         <button type="submit" style={{ padding: '8px 24px', cursor: 'pointer' }}>註冊</button>
       </form>
       <p style={{ marginTop: 16 }}>
         已經有帳號了？<Link to="/login">登入</Link>
       </p>
     </div>
   )
 }
 ```
 
 - [ ] **Step 3: Update App.tsx with routes**
 
 `apps/web/src/App.tsx`:
 ```tsx
 import { Routes, Route, Navigate } from 'react-router-dom'
 import Login from './pages/Login'
 import Register from './pages/Register'
 import Notes from './pages/Notes'
 import NoteEditor from './pages/NoteEditor'
 
 function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const token = localStorage.getItem('token')
   if (!token) return <Navigate to="/login" replace />
   return <>{children}</>
 }
 
 export default function App() {
   return (
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
       <Route path="/notes/new" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
       <Route path="/notes/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
       <Route path="*" element={<Navigate to="/notes" replace />} />
     </Routes>
   )
 }
 ```
 
 - [ ] **Step 4: Commit**
 
 ```bash
 git add apps/web/src/
 git commit -m "feat(web): add login/register pages and routing"
 ```
 
 ---
 
 ### Task 8: apps/web — Note List & Editor Pages
 
 **Files:**
 - Create: `apps/web/src/pages/Notes.tsx`
 - Create: `apps/web/src/pages/NoteEditor.tsx`
 
 - [ ] **Step 1: Write Notes list page**
 
 `apps/web/src/pages/Notes.tsx`:
 ```tsx
 import { useState, useEffect } from 'react'
 import { useNavigate } from 'react-router-dom'
 import { api } from '../api/client'
 
 interface NoteItem {
   id: string
   title: string
   themeId: string
   tags: string
   createdAt: number
   updatedAt: number
 }
 
 export default function Notes() {
   const [notes, setNotes] = useState<NoteItem[]>([])
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()
 
   useEffect(() => {
     api.getNotes().then(data => {
       setNotes(data.notes as NoteItem[])
       setLoading(false)
     }).catch(() => setLoading(false))
   }, [])
 
   const user = JSON.parse(localStorage.getItem('user') || '{}')
 
   const handleLogout = () => {
     localStorage.removeItem('token')
     localStorage.removeItem('user')
     navigate('/login')
   }
 
   const handleDelete = async (id: string, e: React.MouseEvent) => {
     e.stopPropagation()
     if (!confirm('確定刪除？')) return
     await api.deleteNote(id)
     setNotes(notes.filter(n => n.id !== id))
   }
 
   return (
     <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
         <h1>記事本</h1>
         <div>
           <span style={{ marginRight: 12 }}>{user.nickname}</span>
           <button onClick={() => navigate('/notes/new')} style={{ marginRight: 8, padding: '8px 16px', cursor: 'pointer' }}>
             ＋ 新筆記
           </button>
           <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>登出</button>
         </div>
       </div>
 
       {loading && <p>載入中...</p>}
 
       {!loading && notes.length === 0 && (
         <p style={{ color: '#666' }}>還沒有筆記，點擊「新筆記」開始寫吧！</p>
       )}
 
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
         {notes.map(note => (
           <div key={note.id} onClick={() => navigate(`/notes/${note.id}`)}
             style={{
               border: '1px solid #e0e0e0',
               borderRadius: 8,
               padding: 16,
               cursor: 'pointer',
               background: 'white',
               minHeight: 150,
               display: 'flex',
               flexDirection: 'column'
             }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <h3 style={{ margin: '0 0 8px' }}>{note.title || '無標題'}</h3>
               <button onClick={(e) => handleDelete(note.id, e)}
                 style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>×</button>
             </div>
             <div style={{ fontSize: 12, color: '#999', marginTop: 'auto' }}>
               {new Date(note.updatedAt).toLocaleString('zh-TW')}
             </div>
           </div>
         ))}
       </div>
     </div>
   )
 }
 ```
 
 - [ ] **Step 2: Write NoteEditor page**
 
 `apps/web/src/pages/NoteEditor.tsx`:
 ```tsx
 import { useState, useEffect } from 'react'
 import { useParams, useNavigate } from 'react-router-dom'
 import { api } from '../api/client'
 
 export default function NoteEditor() {
   const { id } = useParams()
   const navigate = useNavigate()
   const isNew = !id
 
   const [title, setTitle] = useState('')
   const [text, setText] = useState('')
   const [saving, setSaving] = useState(false)
 
   useEffect(() => {
     if (id) {
       api.getNote(id).then(data => {
         setTitle(data.note.title)
         setText(data.note.content?.text || '')
       }).catch(() => navigate('/notes'))
     }
   }, [id, navigate])
 
   const handleSave = async () => {
     setSaving(true)
     try {
       if (isNew) {
         const result = await api.createNote({
           title,
           content: { text, drawing: null, images: [], recordings: [] }
         })
         navigate(`/notes/${result.id}`, { replace: true })
       } else {
         await api.updateNote(id!, { title, content: { text, drawing: null, images: [], recordings: [] } })
       }
     } finally {
       setSaving(false)
     }
   }
 
   return (
     <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
         <button onClick={() => navigate('/notes')} style={{ padding: '6px 12px', cursor: 'pointer' }}>← 返回</button>
         <button onClick={handleSave} disabled={saving} style={{ padding: '8px 24px', cursor: 'pointer' }}>
           {saving ? '儲存中...' : '儲存'}
         </button>
       </div>
 
       <input
         type="text"
         value={title}
         onChange={e => setTitle(e.target.value)}
         placeholder="筆記標題"
         style={{
           width: '100%',
           fontSize: 24,
           fontWeight: 600,
           border: 'none',
           outline: 'none',
           padding: '8px 0',
           marginBottom: 16
         }}
       />
 
       <textarea
         value={text}
         onChange={e => setText(e.target.value)}
         placeholder="開始寫筆記..."
         style={{
           width: '100%',
           minHeight: 400,
           border: '1px solid #e0e0e0',
           borderRadius: 8,
           padding: 16,
           fontSize: 16,
           lineHeight: 1.6,
           resize: 'vertical',
           fontFamily: 'inherit'
         }}
       />
     </div>
   )
 }
 ```
 
 - [ ] **Step 3: Verify dev setup**
 
 Run terminal 1: `cd apps/server && pnpm dev`
 Run terminal 2: `cd apps/web && pnpm dev`
 Visit: http://localhost:5173
 Expected: Can register an account → login → create note → see note in list → edit → delete
 
 - [ ] **Step 4: Commit**
 
 ```bash
 git add apps/web/src/pages/
 git commit -m "feat(web): add note list and editor pages"
 ```
 
 ---
 
 ## Phase 1 Summary
 
 After Phase 1, you have:
 
 - pnpm monorepo with TypeScript + Turborepo
 - `@notepad/core`: shared types and StorageAdapter interface
 - `@notepad/server`: Express API with SQLite + JWT auth + note CRUD
 - `@notepad/web`: React app with login/register and note management
 
 **Working demo:** http://localhost:5173 — register → create notes → view/edit/delete
 
 ## Next Phases (planned)
 
 - **Phase 2 — Rich Editor & Media**: Canvas drawing, image upload, audio recording
 - **Phase 3 — Desktop App**: Tauri wrapper, global shortcut, system tray, window detection
 - **Phase 4 — Mobile App**: React Native with camera/audio
 - **Phase 5 — Sync & Share**: WebSocket sync, sharing, permissions
