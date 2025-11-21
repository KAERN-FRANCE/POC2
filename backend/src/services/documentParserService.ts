import fs from 'fs'
import path from 'path'

// Note: Pour une implémentation complète, installer ces packages :
// npm install pdf-parse xlsx csv-parser

interface ParsedDocument {
  text: string
  metadata?: Record<string, any>
}

// Parser pour fichiers texte
export const parseTextFile = async (filePath: string): Promise<ParsedDocument> => {
  const content = fs.readFileSync(filePath, 'utf-8')
  return {
    text: content,
    metadata: {
      lines: content.split('\n').length,
    },
  }
}

// Parser pour fichiers CSV
export const parseCsvFile = async (filePath: string): Promise<ParsedDocument> => {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Convertir le CSV en texte structuré
  let text = 'DONNÉES CSV:\n\n'

  if (lines.length > 0) {
    const headers = lines[0].split(',')
    text += `Colonnes: ${headers.join(', ')}\n\n`

    // Ajouter les lignes de données
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',')
        text += `Ligne ${i}:\n`
        headers.forEach((header, idx) => {
          text += `  ${header.trim()}: ${values[idx]?.trim() || 'N/A'}\n`
        })
        text += '\n'
      }
    }
  }

  return {
    text,
    metadata: {
      rows: lines.length - 1,
      type: 'csv',
    },
  }
}

// Parser pour fichiers JSON
export const parseJsonFile = async (filePath: string): Promise<ParsedDocument> => {
  const content = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(content)

  // Convertir le JSON en texte lisible
  const text = `DONNÉES JSON:\n\n${JSON.stringify(data, null, 2)}`

  return {
    text,
    metadata: {
      type: 'json',
    },
  }
}

// Parser pour fichiers PDF (simulation - nécessite pdf-parse en production)
export const parsePdfFile = async (filePath: string): Promise<ParsedDocument> => {
  try {
    // En production, utiliser pdf-parse:
    // const pdfParse = require('pdf-parse')
    // const dataBuffer = fs.readFileSync(filePath)
    // const data = await pdfParse(dataBuffer)
    // return { text: data.text, metadata: { pages: data.numpages } }

    // Pour l'instant, retourner un placeholder
    return {
      text: `[Document PDF: ${path.basename(filePath)}]\n\nPour extraire le contenu des PDF, installez le package 'pdf-parse':\nnpm install pdf-parse\n\nLe contenu sera alors automatiquement extrait.`,
      metadata: {
        type: 'pdf',
        requiresPackage: 'pdf-parse',
      },
    }
  } catch (error) {
    throw new Error(`Erreur lors du parsing du PDF: ${error}`)
  }
}

// Parser pour fichiers Excel (simulation - nécessite xlsx en production)
export const parseExcelFile = async (filePath: string): Promise<ParsedDocument> => {
  try {
    // En production, utiliser xlsx:
    // const XLSX = require('xlsx')
    // const workbook = XLSX.readFile(filePath)
    // let text = 'DONNÉES EXCEL:\n\n'
    // workbook.SheetNames.forEach(sheetName => {
    //   const sheet = workbook.Sheets[sheetName]
    //   const data = XLSX.utils.sheet_to_json(sheet)
    //   text += `\n--- Feuille: ${sheetName} ---\n`
    //   text += JSON.stringify(data, null, 2)
    // })
    // return { text, metadata: { sheets: workbook.SheetNames.length } }

    // Pour l'instant, retourner un placeholder
    return {
      text: `[Document Excel: ${path.basename(filePath)}]\n\nPour extraire le contenu des fichiers Excel, installez le package 'xlsx':\nnpm install xlsx\n\nLe contenu sera alors automatiquement extrait.`,
      metadata: {
        type: 'excel',
        requiresPackage: 'xlsx',
      },
    }
  } catch (error) {
    throw new Error(`Erreur lors du parsing de Excel: ${error}`)
  }
}

// Parser universel basé sur l'extension
export const parseDocument = async (filePath: string): Promise<ParsedDocument> => {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.txt':
    case '.md':
      return parseTextFile(filePath)

    case '.csv':
      return parseCsvFile(filePath)

    case '.json':
      return parseJsonFile(filePath)

    case '.pdf':
      return parsePdfFile(filePath)

    case '.xlsx':
    case '.xls':
      return parseExcelFile(filePath)

    default:
      // Pour les types inconnus, essayer de lire comme texte
      try {
        return parseTextFile(filePath)
      } catch (error) {
        throw new Error(`Type de fichier non supporté: ${ext}`)
      }
  }
}

// Extraire les informations clés d'un document (chiffres, dates, etc.)
export const extractKeyInformation = (text: string): Record<string, any> => {
  const info: Record<string, any> = {}

  // Extraire les nombres (avec ou sans unités)
  const numbers = text.match(/\d+(?:\.\d+)?(?:\s*(?:€|%|M€|k€|millions?|milliards?))?/gi)
  if (numbers && numbers.length > 0) {
    info.numbers = numbers.slice(0, 20) // Limiter à 20 pour ne pas surcharger
  }

  // Extraire les dates (formats variés)
  const dates = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/gi)
  if (dates && dates.length > 0) {
    info.dates = dates.slice(0, 10)
  }

  // Extraire les pourcentages
  const percentages = text.match(/\d+(?:\.\d+)?%/gi)
  if (percentages && percentages.length > 0) {
    info.percentages = percentages.slice(0, 10)
  }

  return info
}
