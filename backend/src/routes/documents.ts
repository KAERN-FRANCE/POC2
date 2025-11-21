import express from 'express'
import multer from 'multer'
import path from 'path'
import * as documentsController from '../controllers/documentsController'

const router = express.Router()

// Configuration de multer pour l'upload de documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentsPath = process.env.DOCUMENTS_PATH || './documents'
    cb(null, documentsPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `doc-${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    const allowedExtensions = ['.pdf', '.txt', '.csv', '.json', '.xls', '.xlsx', '.md']

    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non supporté. Formats acceptés: PDF, TXT, CSV, JSON, Excel'))
    }
  },
})

// Routes pour les documents
router.get('/', documentsController.getAllDocuments)
router.post('/', upload.single('document'), documentsController.uploadDocument)
router.get('/:id', documentsController.getDocument)
router.delete('/:id', documentsController.deleteDocument)
router.get('/meeting/:meetingId', documentsController.getDocumentsByMeeting)

export default router
