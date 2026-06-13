import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface NoteItem {
  id: string
  title: string
  themeId: string
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
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }
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
          <button onClick={() => navigate('/notes/new')} style={{ marginRight: 8, padding: '8px 16px', cursor: 'pointer' }}>＋ 新筆記</button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>登出</button>
        </div>
      </div>
      {loading && <p>載入中...</p>}
      {!loading && notes.length === 0 && <p style={{ color: '#666' }}>還沒有筆記，點擊「新筆記」開始寫吧！</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {notes.map(note => (
          <div key={note.id} onClick={() => navigate(`/notes/${note.id}`)}
            style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, cursor: 'pointer', background: 'white', minHeight: 150, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: '0 0 8px' }}>{note.title || '無標題'}</h3>
              <button onClick={(e) => handleDelete(note.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>×</button>
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