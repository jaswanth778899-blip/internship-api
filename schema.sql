CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT NOT NULL,
  location TEXT NOT NULL,
  workMode TEXT NOT NULL CHECK (workMode IN ('Remote', 'Hybrid', 'On-site')),
  stipend INTEGER NOT NULL DEFAULT 0 CHECK (stipend >= 0),
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  applyUrl TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
