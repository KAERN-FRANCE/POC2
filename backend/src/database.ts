import Database from 'better-sqlite3'
import path from 'path'

const dbPath = process.env.DATABASE_PATH || './data/meetings.db'
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

  console.log('✅ Base de données initialisée')
}

export default db
