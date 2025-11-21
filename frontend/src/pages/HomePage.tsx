import { Link } from 'react-router-dom'
import { Mic, List, Zap, Globe, FileText, Bot, ShieldCheck } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            Nouveau : Fact-Checking IA en temps réel
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Réunions de board sécurisées avec
          <span className="block text-blue-600 mt-2">vérification IA en temps réel</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          L'IA ChatGPT analyse automatiquement chaque déclaration et alerte instantanément en cas d'erreurs factuelles, de chiffres incorrects ou d'incohérences avec vos documents de référence.
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-md border-2 border-blue-200">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            IA Fact-Checking
          </h3>
          <p className="text-gray-600">
            ChatGPT analyse en temps réel et détecte automatiquement les erreurs factuelles, chiffres incorrects et incohérences.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Documents de référence</h3>
          <p className="text-gray-600">
            Uploadez vos rapports financiers, présentations et données pour une vérification automatique des faits.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Alertes instantanées</h3>
          <p className="text-gray-600">
            Recevez des alertes immédiates avec corrections suggérées quand des informations erronées sont détectées.
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
