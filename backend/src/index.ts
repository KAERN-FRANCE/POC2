import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import meetingsRouter from './routes/meetings'
import transcribeRouter from './routes/transcribe'
import documentsRouter from './routes/documents'
import factCheckRouter from './routes/factCheck'
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
const documentsDir = process.env.DOCUMENTS_PATH || './documents'
const dataDir = path.dirname(process.env.DATABASE_PATH || './data/meetings.db')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true })
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Servir les fichiers statiques (audio uploads et documents)
app.use('/uploads', express.static(uploadDir))
app.use('/documents', express.static(documentsDir))

// Initialiser la base de données
initDatabase()

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Recorder API with AI Fact-Checking',
    version: '2.0.0',
    endpoints: {
      meetings: '/api/meetings',
      transcribe: '/api/transcribe',
      documents: '/api/documents',
      factCheck: '/api/fact-check',
    },
  })
})

app.use('/api/meetings', meetingsRouter)
app.use('/api/transcribe', transcribeRouter)
app.use('/api/documents', documentsRouter)
app.use('/api/fact-check', factCheckRouter)

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
  console.log(`📄 Dossier documents: ${documentsDir}`)
  console.log(`💾 Base de données: ${process.env.DATABASE_PATH || './data/meetings.db'}`)
  console.log(`🤖 AI Fact-Checking: ${process.env.OPENAI_API_KEY ? 'Activé' : 'Désactivé (Ajoutez OPENAI_API_KEY)'}`)
})

export default app
