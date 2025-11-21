import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.DATABASE_PATH || './data/meetings.db'

// Créer le dossier de la base de données s'il n'existe pas
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

export const initDatabase = () => {
  // Table des réunions
  db.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      duration INTEGER DEFAULT 0,
      audio_url TEXT,
      status TEXT DEFAULT 'completed',
      fact_checking_enabled INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Table des segments de transcription
  db.exec(`
    CREATE TABLE IF NOT EXISTS transcript_segments (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      confidence REAL,
      speaker TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    )
  `)

  // Table des documents de référence
  db.exec(`
    CREATE TABLE IF NOT EXISTS reference_documents (
      id TEXT PRIMARY KEY,
      meeting_id TEXT,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      extracted_text TEXT,
      category TEXT,
      metadata TEXT,
      upload_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE SET NULL
    )
  `)

  // Table des alertes de fact-checking
  db.exec(`
    CREATE TABLE IF NOT EXISTS fact_check_alerts (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      segment_id TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      claimed_statement TEXT NOT NULL,
      issue TEXT NOT NULL,
      correct_information TEXT,
      severity TEXT NOT NULL,
      confidence REAL NOT NULL,
      sources TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
      FOREIGN KEY (segment_id) REFERENCES transcript_segments(id) ON DELETE CASCADE
    )
  `)

  // Table de configuration du fact-checking
  db.exec(`
    CREATE TABLE IF NOT EXISTS fact_check_config (
      meeting_id TEXT PRIMARY KEY,
      enabled INTEGER DEFAULT 1,
      sensitivity TEXT DEFAULT 'medium',
      check_numbers INTEGER DEFAULT 1,
      check_dates INTEGER DEFAULT 1,
      check_names INTEGER DEFAULT 1,
      check_financials INTEGER DEFAULT 1,
      auto_alert INTEGER DEFAULT 1,
      min_confidence REAL DEFAULT 0.7,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    )
  `)

  console.log('✅ Base de données initialisée avec fact-checking')
}

export default db
