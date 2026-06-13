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
        const result = await api.createNote({ title, content: { text, drawing: null, images: [], recordings: [] } })
        navigate(`/notes/${result.id}`, { replace: true })
      } else {
        await api.updateNote(id!, { title, content: { text, drawing: null, images: [], recordings: [] } })
      }
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => navigate('/notes')} style={{ padding: '6px 12px', cursor: 'pointer' }}>← 返回</button>
        <button onClick={handleSave} disabled={saving} style={{ padding: '8px 24px', cursor: 'pointer' }}>
          {saving ? '儲存中...' : '儲存'}
        </button>
      </div>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="筆記標題"
        style={{ width: '100%', fontSize: 24, fontWeight: 600, border: 'none', outline: 'none', padding: '8px 0', marginBottom: 16, boxSizing: 'border-box' }} />
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="開始寫筆記..."
        style={{ width: '100%', minHeight: 400, border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, fontSize: 16, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
    </div>
  )
}