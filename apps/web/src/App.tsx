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