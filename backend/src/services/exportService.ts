// @ts-ignore - PDFKit doesn't have types
import PDFDocument from 'pdfkit'
import { Meeting } from '../types'

// Formater la durée en format lisible
const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) {
    return `${h}h ${m}m ${s}s`
  }
  if (m > 0) {
    return `${m}m ${s}s`
  }
  return `${s}s`
}

// Formater le timestamp en format lisible
const formatTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const s = seconds % 60
  const m = minutes % 60

  if (hours > 0) {
    return `${hours}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Exporter en TXT
export const exportToTxt = (meeting: Meeting): string => {
  let content = ''

  // En-tête
  content += `==============================================\n`
  content += `${meeting.title}\n`
  content += `==============================================\n\n`
  content += `Date: ${new Date(meeting.date).toLocaleString('fr-FR')}\n`
  content += `Durée: ${formatDuration(meeting.duration)}\n`
  content += `Segments: ${meeting.transcript.length}\n\n`
  content += `==============================================\n\n`

  // Transcription
  if (meeting.transcript.length === 0) {
    content += 'Aucune transcription disponible.\n'
  } else {
    for (const segment of meeting.transcript) {
      content += `[${formatTimestamp(segment.timestamp)}] ${segment.text}\n\n`
    }
  }

  content += `\n==============================================\n`
  content += `Généré le ${new Date().toLocaleString('fr-FR')}\n`

  return content
}

// Exporter en PDF
export const exportToPdf = (meeting: Meeting): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      })

      const buffers: Buffer[] = []

      doc.on('data', (buffer: Buffer) => buffers.push(buffer))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      // En-tête
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(meeting.title, { align: 'center' })
        .moveDown(0.5)

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Date: ${new Date(meeting.date).toLocaleString('fr-FR')}`, { align: 'center' })
        .text(`Durée: ${formatDuration(meeting.duration)}`, { align: 'center' })
        .text(`Segments: ${meeting.transcript.length}`, { align: 'center' })
        .moveDown(2)

      // Ligne de séparation
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke()
        .moveDown(1)

      // Transcription
      if (meeting.transcript.length === 0) {
        doc.fontSize(12).font('Helvetica-Oblique').text('Aucune transcription disponible.')
      } else {
        doc.fontSize(11).font('Helvetica')

        for (const segment of meeting.transcript) {
          // Timestamp
          doc
            .font('Helvetica-Bold')
            .fillColor('#666666')
            .text(`[${formatTimestamp(segment.timestamp)}]`, { continued: true })
            .font('Helvetica')
            .fillColor('#000000')
            .text(` ${segment.text}`)
            .moveDown(0.5)

          // Vérifier si on a besoin d'une nouvelle page
          if (doc.y > doc.page.height - 100) {
            doc.addPage()
          }
        }
      }

      // Pied de page
      doc
        .fontSize(10)
        .font('Helvetica-Oblique')
        .fillColor('#999999')
        .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 50, doc.page.height - 50, {
          align: 'center',
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
