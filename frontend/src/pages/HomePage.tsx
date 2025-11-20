import { Link } from 'react-router-dom'
import { Mic, List, Zap, Globe, FileText } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Enregistrez et transcrivez vos réunions
          <span className="block text-blue-600 mt-2">en temps réel</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Une plateforme simple et puissante pour capturer vos réunions et obtenir des
          transcriptions instantanées, accessible sur ordinateur et mobile.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/record"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            <Mic className="w-6 h-6" />
            <span>Nouvelle réunion</span>
          </Link>

          <Link
            to="/meetings"
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 transition-all"
          >
            <List className="w-6 h-6" />
            <span>Voir mes réunions</span>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Transcription instantanée
          </h3>
          <p className="text-gray-600">
            La transcription se fait en direct au fur et à mesure de la parole, sans délai.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Multi-plateforme</h3>
          <p className="text-gray-600">
            Fonctionne sur ordinateur, tablette et téléphone grâce à une interface responsive.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Export facile</h3>
          <p className="text-gray-600">
            Exportez vos transcriptions en TXT, JSON ou PDF pour les partager facilement.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Comment ça marche ?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold mb-2 text-gray-900">Créez une réunion</h4>
            <p className="text-gray-600 text-sm">
              Donnez un nom à votre réunion et autorisez l'accès au microphone
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold mb-2 text-gray-900">Enregistrez</h4>
            <p className="text-gray-600 text-sm">
              Lancez l'enregistrement et parlez normalement, la transcription est automatique
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold mb-2 text-gray-900">Consultez et exportez</h4>
            <p className="text-gray-600 text-sm">
              Relisez la transcription et exportez-la dans le format de votre choix
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
