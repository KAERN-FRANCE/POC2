import OpenAI from 'openai'
import db from '../database'
import { v4 as uuidv4 } from 'uuid'
import { ReferenceDocument, FactCheckAlert, FactCheckConfig } from '../types'

// Initialiser le client OpenAI seulement si la clé est présente
let openai: OpenAI | null = null

const getOpenAIClient = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key non configurée. Ajoutez OPENAI_API_KEY dans le fichier .env')
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openai
}

interface FactCheckResult {
  hasIssue: boolean
  issue?: string
  correctInformation?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  sources?: string[]
}

// Récupérer les documents de référence pour une réunion
export const getReferenceDocumentsForMeeting = (meetingId: string): ReferenceDocument[] => {
  const docs = db
    .prepare(
      `SELECT id, meeting_id as meetingId, title, file_name as fileName,
              file_type as fileType, file_size as fileSize, file_path as filePath,
              extracted_text as extractedText, category, metadata, upload_date as uploadDate
       FROM reference_documents
       WHERE meeting_id = ? OR meeting_id IS NULL
       ORDER BY upload_date DESC`
    )
    .all(meetingId) as any[]

  return docs.map((doc) => ({
    ...doc,
    metadata: doc.metadata ? JSON.parse(doc.metadata) : undefined,
  }))
}

// Récupérer la configuration de fact-checking
export const getFactCheckConfig = (meetingId: string): FactCheckConfig | null => {
  const config = db
    .prepare(
      `SELECT meeting_id as meetingId, enabled, sensitivity,
              check_numbers as checkNumbers, check_dates as checkDates,
              check_names as checkNames, check_financials as checkFinancials,
              auto_alert as autoAlert, min_confidence as minConfidence
       FROM fact_check_config
       WHERE meeting_id = ?`
    )
    .get(meetingId) as any

  if (!config) return null

  return {
    ...config,
    enabled: config.enabled === 1,
    checkNumbers: config.checkNumbers === 1,
    checkDates: config.checkDates === 1,
    checkNames: config.checkNames === 1,
    checkFinancials: config.checkFinancials === 1,
    autoAlert: config.autoAlert === 1,
  }
}

// Créer ou mettre à jour la configuration
export const upsertFactCheckConfig = (config: FactCheckConfig): void => {
  db.prepare(
    `INSERT INTO fact_check_config
     (meeting_id, enabled, sensitivity, check_numbers, check_dates,
      check_names, check_financials, auto_alert, min_confidence)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(meeting_id) DO UPDATE SET
       enabled = excluded.enabled,
       sensitivity = excluded.sensitivity,
       check_numbers = excluded.check_numbers,
       check_dates = excluded.check_dates,
       check_names = excluded.check_names,
       check_financials = excluded.check_financials,
       auto_alert = excluded.auto_alert,
       min_confidence = excluded.min_confidence`
  ).run(
    config.meetingId,
    config.enabled ? 1 : 0,
    config.sensitivity,
    config.checkNumbers ? 1 : 0,
    config.checkDates ? 1 : 0,
    config.checkNames ? 1 : 0,
    config.checkFinancials ? 1 : 0,
    config.autoAlert ? 1 : 0,
    config.minConfidence
  )
}

// Construire le contexte à partir des documents de référence
const buildReferenceContext = (documents: ReferenceDocument[]): string => {
  if (documents.length === 0) {
    return 'Aucun document de référence disponible.'
  }

  let context = 'DOCUMENTS DE RÉFÉRENCE DISPONIBLES:\n\n'

  for (const doc of documents) {
    context += `--- Document: ${doc.title} (${doc.fileName}) ---\n`
    context += `Type: ${doc.fileType}\n`
    if (doc.category) {
      context += `Catégorie: ${doc.category}\n`
    }
    context += `Contenu:\n${doc.extractedText}\n\n`
  }

  return context
}

// Analyser un segment de transcription avec ChatGPT
export const analyzeSegmentWithChatGPT = async (
  segmentText: string,
  meetingId: string,
  config: FactCheckConfig
): Promise<FactCheckResult> => {
  try {
    // Vérifier que l'API key est configurée
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key non configurée')
    }

    // Récupérer les documents de référence
    const documents = getReferenceDocumentsForMeeting(meetingId)
    const referenceContext = buildReferenceContext(documents)

    // Construire le prompt en fonction de la configuration
    let checkInstructions = 'Vérifie particulièrement :\n'
    if (config.checkNumbers) checkInstructions += '- Les chiffres et statistiques\n'
    if (config.checkDates) checkInstructions += '- Les dates et périodes temporelles\n'
    if (config.checkNames) checkInstructions += '- Les noms de personnes et d\'entreprises\n'
    if (config.checkFinancials)
      checkInstructions += '- Les données financières (revenus, coûts, marges, etc.)\n'

    const sensitivityMap = {
      low: 'Tu dois uniquement signaler les erreurs flagrantes et indiscutables.',
      medium: 'Tu dois signaler les erreurs significatives et les incohérences importantes.',
      high: 'Tu dois signaler toute incohérence, même mineure, avec les documents de référence.',
    }

    const systemPrompt = `Tu es un assistant IA expert en vérification des faits pour des réunions de board d'entreprise.

Ton rôle est d'analyser ce qui est dit pendant la réunion et de le comparer aux documents de référence fournis pour détecter :
- Les erreurs factuelles
- Les chiffres incorrects
- Les dates erronées
- Les informations contradictoires
- Les affirmations non supportées par les données

${checkInstructions}

NIVEAU DE SENSIBILITÉ: ${config.sensitivity.toUpperCase()}
${sensitivityMap[config.sensitivity]}

Si tu détectes un problème, tu dois :
1. Identifier clairement l'affirmation incorrecte
2. Expliquer le problème
3. Fournir l'information correcte basée sur les documents de référence
4. Évaluer la sévérité (low, medium, high, critical)
5. Indiquer ton niveau de confiance (0-1)

Réponds UNIQUEMENT au format JSON suivant :
{
  "hasIssue": true/false,
  "issue": "Description du problème identifié",
  "correctInformation": "L'information correcte basée sur les documents",
  "severity": "low|medium|high|critical",
  "confidence": 0.95,
  "sources": ["Nom du document 1", "Nom du document 2"]
}

Si tu ne détectes AUCUN problème, réponds simplement :
{
  "hasIssue": false,
  "confidence": 1.0
}`

    const userPrompt = `${referenceContext}

--- DÉCLARATION À VÉRIFIER ---
"${segmentText}"

Analyse cette déclaration et compare-la avec les documents de référence. Y a-t-il des erreurs ou incohérences ?`

    // Appeler ChatGPT
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-4o', // ou 'gpt-4-turbo' pour plus de rapidité
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Basse température pour plus de cohérence
      response_format: { type: 'json_object' },
    })

    const resultText = response.choices[0].message.content || '{}'
    const result: FactCheckResult = JSON.parse(resultText)

    // Vérifier le seuil de confiance minimum
    if (result.hasIssue && result.confidence < config.minConfidence) {
      return {
        hasIssue: false,
        confidence: result.confidence,
      }
    }

    return result
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse ChatGPT:', error)
    throw new Error(`Erreur d'analyse: ${error.message}`)
  }
}

// Créer une alerte de fact-checking
export const createFactCheckAlert = (
  meetingId: string,
  segmentId: string,
  timestamp: number,
  claimedStatement: string,
  result: FactCheckResult
): FactCheckAlert => {
  const alertId = uuidv4()

  db.prepare(
    `INSERT INTO fact_check_alerts
     (id, meeting_id, segment_id, timestamp, claimed_statement, issue,
      correct_information, severity, confidence, sources, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`
  ).run(
    alertId,
    meetingId,
    segmentId,
    timestamp,
    claimedStatement,
    result.issue || '',
    result.correctInformation || null,
    result.severity || 'medium',
    result.confidence,
    result.sources ? JSON.stringify(result.sources) : null
  )

  const alert: FactCheckAlert = {
    id: alertId,
    meetingId,
    segmentId,
    timestamp,
    claimedStatement,
    issue: result.issue || '',
    correctInformation: result.correctInformation,
    severity: result.severity || 'medium',
    confidence: result.confidence,
    sources: result.sources,
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  return alert
}

// Récupérer toutes les alertes d'une réunion
export const getAlertsForMeeting = (meetingId: string): FactCheckAlert[] => {
  const alerts = db
    .prepare(
      `SELECT id, meeting_id as meetingId, segment_id as segmentId,
              timestamp, claimed_statement as claimedStatement, issue,
              correct_information as correctInformation, severity,
              confidence, sources, status, created_at as createdAt
       FROM fact_check_alerts
       WHERE meeting_id = ?
       ORDER BY timestamp ASC`
    )
    .all(meetingId) as any[]

  return alerts.map((alert) => ({
    ...alert,
    sources: alert.sources ? JSON.parse(alert.sources) : undefined,
  }))
}

// Mettre à jour le statut d'une alerte
export const updateAlertStatus = (
  alertId: string,
  status: 'active' | 'acknowledged' | 'resolved'
): void => {
  db.prepare('UPDATE fact_check_alerts SET status = ? WHERE id = ?').run(status, alertId)
}

// Analyser un segment et créer une alerte si nécessaire
export const checkSegmentAndAlert = async (
  meetingId: string,
  segmentId: string,
  segmentText: string,
  timestamp: number
): Promise<FactCheckAlert | null> => {
  // Récupérer la config
  const config = getFactCheckConfig(meetingId)

  // Si fact-checking désactivé ou pas de config
  if (!config || !config.enabled) {
    return null
  }

  // Analyser le segment
  const result = await analyzeSegmentWithChatGPT(segmentText, meetingId, config)

  // Si problème détecté et auto-alert activé
  if (result.hasIssue && config.autoAlert) {
    const alert = createFactCheckAlert(meetingId, segmentId, timestamp, segmentText, result)
    return alert
  }

  return null
}
