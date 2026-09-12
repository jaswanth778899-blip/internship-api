const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "internships.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

const schema = `
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
`;

const seedRecords = [
  {
    title: "Frontend Developer Intern",
    company: "TechNova",
    domain: "Web Development",
    location: "Hyderabad",
    workMode: "Remote",
    stipend: 12000,
    duration: "3 Months",
    description: "Build responsive user interfaces using HTML, CSS and JavaScript.",
    applyUrl: "https://example.com/apply/frontend"
  },
  {
    title: "Data Analyst Intern",
    company: "DataSphere",
    domain: "Data Analytics",
    location: "Mumbai",
    workMode: "Hybrid",
    stipend: 14000,
    duration: "5 Months",
    description: "Analyze datasets and create reports and dashboards.",
    applyUrl: "https://example.com/apply/data-analyst"
  },
  {
    title: "UI UX Design Intern",
    company: "PixelWorks",
    domain: "UI/UX",
    location: "Pune",
    workMode: "On-site",
    stipend: 10000,
    duration: "4 Months",
    description: "Create wireframes, prototypes and user-friendly design systems.",
    applyUrl: "https://example.com/apply/ui-ux"
  }
];

db.serialize(() => {
  db.run(schema, (err) => {
    if (err) {
      console.error("Failed to create internships table:", err.message);
      return;
    }

    db.get("SELECT COUNT(*) AS count FROM internships", (countErr, row) => {
      if (countErr) {
        console.error("Failed to count internship records:", countErr.message);
        return;
      }

      if (row.count === 0) {
        const statement = db.prepare(`
          INSERT INTO internships
          (title, company, domain, location, workMode, stipend, duration, description, applyUrl)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const item of seedRecords) {
          statement.run(
            item.title,
            item.company,
            item.domain,
            item.location,
            item.workMode,
            item.stipend,
            item.duration,
            item.description,
            item.applyUrl
          );
        }

        statement.finalize(() => {
          console.log("Sample internship records inserted");
        });
      }
    });
  });
});

module.exports = db;
