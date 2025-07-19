import { Database } from "sqlite3"
import { promisify } from "util"
import path from "path"

// Database connection
const dbPath = path.join(process.cwd(), "save_the_date.db")
const db = new Database(dbPath)

// Promisify database methods
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

export interface SaveTheDateLink {
  id: string
  partner1_name?: string
  partner2_name?: string
  wedding_date: string
  created_at: string
  expires_at: string
  view_count: number
}

// Initialize database
export async function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS save_the_date_links (
      id TEXT PRIMARY KEY,
      partner1_name TEXT,
      partner2_name TEXT,
      wedding_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      view_count INTEGER DEFAULT 0
    )
  `

  await dbRun(createTableSQL)

  // Create indexes
  await dbRun("CREATE INDEX IF NOT EXISTS idx_save_the_date_expires ON save_the_date_links(expires_at)")
  await dbRun("CREATE INDEX IF NOT EXISTS idx_save_the_date_id ON save_the_date_links(id)")
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create a new Save the Date link
export async function createSaveTheDateLink(
  partner1Name?: string,
  partner2Name?: string,
  weddingDate: string,
): Promise<string> {
  const id = generateId()
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 3) // 3 months from now

  await dbRun(
    `INSERT INTO save_the_date_links (id, partner1_name, partner2_name, wedding_date, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, partner1Name, partner2Name, weddingDate, expiresAt.toISOString()],
  )

  return id
}

// Get Save the Date link by ID
export async function getSaveTheDateLink(id: string): Promise<SaveTheDateLink | null> {
  const link = (await dbGet('SELECT * FROM save_the_date_links WHERE id = ? AND expires_at > datetime("now")', [id])) as
    | SaveTheDateLink
    | undefined

  if (link) {
    // Increment view count
    await dbRun("UPDATE save_the_date_links SET view_count = view_count + 1 WHERE id = ?", [id])
    link.view_count += 1
  }

  return link || null
}

// Clean up expired links
export async function cleanupExpiredLinks(): Promise<number> {
  const result = await dbRun('DELETE FROM save_the_date_links WHERE expires_at <= datetime("now")')
  return result.changes || 0
}

// Get all active links (for admin purposes)
export async function getAllActiveLinks(): Promise<SaveTheDateLink[]> {
  return (await dbAll(
    'SELECT * FROM save_the_date_links WHERE expires_at > datetime("now") ORDER BY created_at DESC',
  )) as SaveTheDateLink[]
}
