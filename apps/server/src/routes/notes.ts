import { Router, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { queryAll, queryOne, execute } from '../db'
import { authMiddleware, AuthRequest } from '../auth'

const router = Router()
router.use(authMiddleware)

router.get('/', (req: AuthRequest, res: Response) => {
  const rows = queryAll('SELECT id, title, theme_id, size_w, size_h, pos_x, pos_y, tags, folder_id, linked_url, linked_app, version, created_at, updated_at FROM notes WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC', [req.userId!])
  res.json({ notes: rows })
})

router.get('/:id', (req: AuthRequest, res: Response) => {
  const note = queryOne('SELECT * FROM notes WHERE id = ? AND user_id = ? AND deleted_at IS NULL', [req.params.id, req.userId!])
  if (!note) { res.status(404).json({ error: 'Note not found' }); return }
  res.json({ note: { ...note } })
})

router.post('/', (req: AuthRequest, res: Response) => {
  const { title, content, themeId, size, position, tags, folderId, linkedUrl, linkedApp } = req.body
  const id = uuid()
  const now = Date.now()
  execute('INSERT INTO notes (id, user_id, title, content_text, content_drawing, theme_id, size_w, size_h, pos_x, pos_y, tags, folder_id, linked_url, linked_app, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.userId!, title || '', content?.text || '', content?.drawing || null,
     themeId || 'classic-white', size?.width || 300, size?.height || 200,
     position?.x || 0, position?.y || 0, JSON.stringify(tags || []), folderId || null,
     linkedUrl || null, linkedApp || null, now, now])
  res.status(201).json({ id })
})

router.put('/:id', (req: AuthRequest, res: Response) => {
  const { title, content, themeId, size, position, tags, folderId, linkedUrl, linkedApp } = req.body
  const now = Date.now()
  const affected = execute(`UPDATE notes SET title = COALESCE(?, title), content_text = COALESCE(?, content_text), content_drawing = COALESCE(?, content_drawing), theme_id = COALESCE(?, theme_id), size_w = COALESCE(?, size_w), size_h = COALESCE(?, size_h), pos_x = COALESCE(?, pos_x), pos_y = COALESCE(?, pos_y), tags = COALESCE(?, tags), folder_id = COALESCE(?, folder_id), linked_url = COALESCE(?, linked_url), linked_app = COALESCE(?, linked_app), version = version + 1, updated_at = ? WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
    [title, content?.text, content?.drawing, themeId, size?.width, size?.height, position?.x, position?.y, tags ? JSON.stringify(tags) : null, folderId, linkedUrl, linkedApp, now, req.params.id, req.userId!])
  if (affected === 0) { res.status(404).json({ error: 'Note not found' }); return }
  res.json({ success: true })
})

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const affected = execute('UPDATE notes SET deleted_at = ?, version = version + 1 WHERE id = ? AND user_id = ?', [Date.now(), req.params.id, req.userId!])
  if (affected === 0) { res.status(404).json({ error: 'Note not found' }); return }
  res.json({ success: true })
})

export default router