import express from 'express'
import multer from 'multer'
import * as transcribeController from '../controllers/transcribeController'

const router = express.Router()

// Configuration de multer pour les fichiers temporaires
const upload = multer({
  dest: '/tmp',
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max pour Whisper
  },
})

// Route pour transcrire avec Whisper
router.post('/whisper', upload.single('audio'), transcribeController.transcribeWithWhisper)

export default router
