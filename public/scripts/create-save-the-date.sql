-- Create table for Save the Date links
CREATE TABLE IF NOT EXISTS save_the_date_links (
    id TEXT PRIMARY KEY,
    partner1_name TEXT,
    partner2_name TEXT,
    wedding_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    view_count INTEGER DEFAULT 0
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_save_the_date_expires ON save_the_date_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_save_the_date_id ON save_the_date_links(id);
