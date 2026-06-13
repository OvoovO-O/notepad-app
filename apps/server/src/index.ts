import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import noteRoutes from './routes/notes.js'
import { initDb, closeDb } from './db.js'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})

function shutdown(): void {
  closeDb()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

export default app