import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'notepad.db')

let db: SqlJsDatabase | null = null
let SQL: SqlJsStatic | null = null

export async function initDb(): Promise<void> {
  SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  }
  db.run('PRAGMA foreign_keys = ON')
  initSchema()
  saveDb()
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDb() first.')
  return db
}

function initSchema(): void {
  db!.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, nickname TEXT NOT NULL, password_hash TEXT NOT NULL, avatar TEXT, created_at INTEGER NOT NULL)`)
  db!.run(`CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', content_text TEXT NOT NULL DEFAULT '', content_drawing TEXT, theme_id TEXT NOT NULL DEFAULT 'classic-white', size_w INTEGER NOT NULL DEFAULT 300, size_h INTEGER NOT NULL DEFAULT 200, pos_x REAL NOT NULL DEFAULT 0, pos_y REAL NOT NULL DEFAULT 0, tags TEXT NOT NULL DEFAULT '[]', folder_id TEXT, linked_url TEXT, linked_app TEXT, version INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))`)
  db!.run(`CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, parent_id TEXT, color TEXT NOT NULL DEFAULT '#e0e0e0', icon TEXT NOT NULL DEFAULT 'folder', created_at INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))`)
  db!.run(`CREATE TABLE IF NOT EXISTS tags (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '#888', FOREIGN KEY (user_id) REFERENCES users(id))`)
}

export function queryAll(sql: string, params: any[] = []): any[] {
  const d = getDb()
  const stmt = d.prepare(sql)
  if (params.length > 0) stmt.bind(params)
  const results: any[] = []
  while (stmt.step()) { results.push(stmt.getAsObject()) }
  stmt.free()
  return results
}

export function queryOne(sql: string, params: any[] = []): any | null {
  const results = queryAll(sql, params)
  return results.length > 0 ? results[0] : null
}

export function execute(sql: string, params: any[] = []): number {
  const d = getDb()
  const stmt = d.prepare(sql)
  if (params.length > 0) stmt.bind(params)
  stmt.step()
  const affected = d.getRowsModified()
  stmt.free()
  saveDb()
  return affected
}

function saveDb(): void {
  if (!db) return
  const data = db.export()
  const buffer = Buffer.from(data)
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DB_PATH, buffer)
}

export function closeDb(): void {
  if (db) { saveDb(); db.close(); db = null }
}