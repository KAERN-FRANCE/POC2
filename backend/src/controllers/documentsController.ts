import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import db from '../database'
import { ReferenceDocument, UploadDocumentDTO } from '../types'
import { parseDocument, extractKeyInformation } from '../services/documentParserService'

// Récupérer tous les documents
export const getAllDocuments = (req: Request, res: Response) => {
  try {
    const docs = db
      .prepare(
        `SELECT id, meeting_id as meetingId, title, file_name as fileName,
                file_type as fileType, file_size as fileSize, file_path as filePath,
                category, upload_date as uploadDate
         FROM reference_documents
         ORDER BY upload_date DESC`
      )
      .all() as any[]

    res.json(docs)
  } catch (error) {
    console.error('Erreur getAllDocuments:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' })
  }
}

// Récupérer un document par ID
export const getDocument = (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const doc = db
      .prepare(
        `SELECT id, meeting_id as meetingId, title, file_name as fileName,
                file_type as fileType, file_size as fileSize, file_path as filePath,
                extracted_text as extractedText, category, metadata, upload_date as uploadDate
         FROM reference_documents
         WHERE id = ?`
      )
      .get(id) as any

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    const document: ReferenceDocument = {
      ...doc,
      metadata: doc.metadata ? JSON.parse(doc.metadata) : undefined,
    }

    res.json(document)
  } catch (error) {
    console.error('Erreur getDocument:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération du document' })
  }
}

// Récupérer les documents d'une réunion
export const getDocumentsByMeeting = (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params

    const docs = db
      .prepare(
        `SELECT id, meeting_id as meetingId, title, file_name as fileName,
                file_type as fileType, file_size as fileSize, file_path as filePath,
                category, upload_date as uploadDate
         FROM reference_documents
         WHERE meeting_id = ? OR meeting_id IS NULL
         ORDER BY upload_date DESC`
      )
      .all(meetingId) as any[]

    res.json(docs)
  } catch (error) {
    console.error('Erreur getDocumentsByMeeting:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' })
  }
}

// Upload un document
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' })
    }

    const uploadData: UploadDocumentDTO = req.body
    const file = req.file

    // Parser le document pour extraire le texte
    let extractedText = ''
    let metadata: Record<string, any> = {}

    try {
      const parsed = await parseDocument(file.path)
      extractedText = parsed.text
      metadata = { ...parsed.metadata, ...extractKeyInformation(parsed.text) }
    } catch (parseError) {
      console.error('Erreur lors du parsing:', parseError)
      extractedText = `[Erreur lors de l'extraction du texte du document]`
    }

    const docId = uuidv4()
    const title = uploadData.title || file.originalname

    db.prepare(
      `INSERT INTO reference_documents
       (id, meeting_id, title, file_name, file_type, file_size, file_path,
        extracted_text, category, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      docId,
      uploadData.meetingId || null,
      title,
      file.originalname,
      file.mimetype,
      file.size,
      file.path,
      extractedText,
      uploadData.category || null,
      JSON.stringify(metadata)
    )

    const document: ReferenceDocument = {
      id: docId,
      meetingId: uploadData.meetingId,
      title,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      extractedText,
      uploadDate: new Date().toISOString(),
      category: uploadData.category,
      metadata,
    }

    res.status(201).json(document)
  } catch (error) {
    console.error('Erreur uploadDocument:', error)
    res.status(500).json({ error: 'Erreur lors de l\'upload du document' })
  }
}

// Supprimer un document
export const deleteDocument = (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Récupérer le document pour obtenir le chemin du fichier
    const doc = db
      .prepare('SELECT file_path FROM reference_documents WHERE id = ?')
      .get(id) as any

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    // Supprimer le fichier physique
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path)
    }

    // Supprimer de la base de données
    db.prepare('DELETE FROM reference_documents WHERE id = ?').run(id)

    res.status(204).send()
  } catch (error) {
    console.error('Erreur deleteDocument:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression du document' })
  }
}
