import DocumentsManager from '../components/DocumentsManager'
import { FileText } from 'lucide-react'

const DocumentsPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents de Référence</h1>
        <p className="text-gray-600 mt-2">
          Gérez vos documents de référence pour le fact-checking des réunions de board
        </p>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">À propos des documents de référence</h3>
            <p className="text-sm text-blue-800">
              Uploadez vos rapports financiers, présentations, données et autres documents importants.
              L'IA ChatGPT utilisera ces documents comme source de vérité pour analyser ce qui est dit
              pendant vos réunions et détecter automatiquement les erreurs factuelles.
            </p>
          </div>
        </div>
      </div>

      {/* Formats supportés */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Formats de fichiers supportés</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span><strong>PDF</strong> - Rapports, présentations, documents officiels</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span><strong>Excel/CSV</strong> - Données financières, statistiques, tableaux</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span><strong>TXT/Markdown</strong> - Notes, rapports textuels</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <span><strong>JSON</strong> - Données structurées</span>
          </div>
        </div>
      </div>

      {/* Documents Manager Component */}
      <DocumentsManager />

      {/* Usage tips */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Conseils d'utilisation</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Documents globaux :</strong> Les documents uploadés ici sont disponibles pour toutes vos réunions
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Documents spécifiques :</strong> Vous pouvez aussi uploader des documents directement dans la page de setup d'une réunion
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Extraction automatique :</strong> Les chiffres, dates et informations clés sont extraits automatiquement
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Mise à jour :</strong> Supprimez les anciens documents et uploadez les nouvelles versions pour garder vos données à jour
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DocumentsPage
