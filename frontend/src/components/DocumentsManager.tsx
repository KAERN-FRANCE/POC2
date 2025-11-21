import { useState, useEffect, useRef } from 'react'
import { ReferenceDocument } from '../types'
import { documentsApi } from '../services/api'
import { Upload, FileText, Trash2, File, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentsManagerProps {
  meetingId?: string
}

const DocumentsManager = ({ meetingId }: DocumentsManagerProps) => {
  const [documents, setDocuments] = useState<ReferenceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDocuments()
  }, [meetingId])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = meetingId
        ? await documentsApi.getDocumentsByMeeting(meetingId)
        : await documentsApi.getAllDocuments()

      setDocuments(data)
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError('Impossible de charger les documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const document = await documentsApi.uploadDocument(file, meetingId)
        setDocuments((prev) => [document, ...prev])
      }
    } catch (err: any) {
      console.error('Erreur lors de l\'upload:', err)
      setError(err.response?.data?.error || 'Erreur lors de l\'upload des documents')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return

    try {
      await documentsApi.deleteDocument(documentId)
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Impossible de supprimer le document')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />
    if (fileType.includes('excel') || fileType.includes('spreadsheet'))
      return <File className="w-5 h-5 text-green-600" />
    if (fileType.includes('csv')) return <File className="w-5 h-5 text-blue-600" />
    return <FileText className="w-5 h-5 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Chargement des documents...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Documents de Référence</span>
        </h3>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Upload en cours...' : 'Ajouter documents'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.csv,.json,.xls,.xlsx,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        <p>
          <strong>Formats acceptés :</strong> PDF, TXT, CSV, JSON, Excel (.xlsx, .xls)
        </p>
        <p className="mt-1">
          <strong>Taille max :</strong> 50 MB par fichier
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Aucun document de référence</p>
          <p className="text-sm text-gray-500 mb-4">
            Ajoutez des documents pour activer le fact-checking en temps réel
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Ajouter votre premier document</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getFileIcon(doc.fileType)}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {doc.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      {doc.category && (
                        <>
                          <span>•</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                        </>
                      )}
                    </div>

                    {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {doc.metadata.numbers && (
                          <div>
                            <CheckCircle className="w-3 h-3 inline mr-1 text-green-600" />
                            {doc.metadata.numbers.length} chiffres extraits
                          </div>
                        )}
                        {doc.metadata.dates && (
                          <div>
                            <CheckCircle className="w-3 h-3 inline mr-1 text-green-600" />
                            {doc.metadata.dates.length} dates extraites
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentsManager
