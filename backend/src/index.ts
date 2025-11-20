import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import meetingsRouter from './routes/meetings'
import transcribeRouter from './routes/transcribe'
import { initDatabase } from './database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Créer les dossiers nécessaires
const uploadDir = process.env.UPLOAD_PATH || './uploads'
const dataDir = path.dirname(process.env.DATABASE_PATH || './data/meetings.db')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Servir les fichiers statiques (audio uploads)
app.use('/uploads', express.static(uploadDir))

// Initialiser la base de données
initDatabase()

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Recorder API',
    version: '1.0.0',
    endpoints: {
      meetings: '/api/meetings',
      transcribe: '/api/transcribe',
    },
  })
})

app.use('/api/meetings', meetingsRouter)
app.use('/api/transcribe', transcribeRouter)

// Gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  })
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
  console.log(`📁 Dossier d'upload: ${uploadDir}`)
  console.log(`💾 Base de données: ${process.env.DATABASE_PATH || './data/meetings.db'}`)
})

export default app
