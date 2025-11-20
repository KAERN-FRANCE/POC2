import express from 'express'
import multer from 'multer'
import path from 'path'
import * as meetingsController from '../controllers/meetingsController'

const router = express.Router()

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `meeting-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg']
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non supporté'))
    }
  },
})

// Routes
router.get('/', meetingsController.getAllMeetings)
router.post('/', meetingsController.createMeeting)
router.get('/:id', meetingsController.getMeeting)
router.put('/:id', meetingsController.updateMeeting)
router.delete('/:id', meetingsController.deleteMeeting)
router.post('/:id/transcript', meetingsController.addTranscriptSegment)
router.post('/:id/audio', upload.single('audio'), meetingsController.uploadAudio)
router.get('/:id/export/:format', meetingsController.exportTranscript)

export default router
