# Internship REST API with Persistent Data

A beginner-friendly REST API built with **Node.js**, **Express**, and **SQLite** for storing and managing internship records.

This project includes:

- Internship data model
- SQLite persistence
- Seed data
- List endpoint
- Detail endpoint
- Create endpoint
- Full update endpoint
- Partial update endpoint
- Delete endpoint
- Input validation
- Pagination
- Search
- Domain filtering
- Consistent JSON response format
- Predictable HTTP status codes
- API usage examples

---

## Tech Stack

- Node.js
- Express
- SQLite
- sqlite3
- CORS

---

## Project Structure

```text
internship-api/
├── .gitignore
├── API_EXAMPLES.md
├── README.md
├── database.js
├── package.json
├── schema.sql
├── seed.sql
└── server.js
```

The SQLite database file `internships.db` is created automatically the first time the project runs.

---

## Internship Data Model

Each internship contains:

```json
{
  "id": 1,
  "title": "Frontend Developer Intern",
  "company": "TechNova",
  "domain": "Web Development",
  "location": "Hyderabad",
  "workMode": "Remote",
  "stipend": 12000,
  "duration": "3 Months",
  "description": "Build responsive user interfaces using HTML, CSS and JavaScript.",
  "applyUrl": "https://example.com/apply/frontend",
  "createdAt": "2026-09-12 10:00:00",
  "updatedAt": "2026-09-12 10:00:00"
}
```

### Validation Rules

- `title` is required
- `company` is required
- `domain` is required
- `location` is required
- `workMode` must be `Remote`, `Hybrid`, or `On-site`
- `stipend` must be a non-negative integer
- `duration` is required
- `description` is required
- `applyUrl` must be a valid HTTP/HTTPS URL

---

## API Response Format

### Success

```json
{
  "status": "success",
  "message": "Internships fetched successfully",
  "data": []
}
```

### Validation/Error

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "title is required"
  ]
}
```

---

# Setup Instructions

## 1. Install Node.js

Install a recent version of Node.js.

Check:

```powershell
node -v
```

On Windows PowerShell, if `npm` is blocked by execution policy, you can use:

```powershell
npm.cmd -v
```

---

## 2. Open the Project Folder

```powershell
cd internship-api
```

---

## 3. Install Dependencies

Normal terminal:

```bash
npm install
```

Windows PowerShell alternative:

```powershell
npm.cmd install
```

---

## 4. Start the Server

Normal terminal:

```bash
npm start
```

Windows PowerShell alternative:

```powershell
npm.cmd start
```

Expected output:

```text
Server running at http://localhost:3000
Connected to SQLite database
Sample internship records inserted
```

`Sample internship records inserted` appears only when the database is empty.

---

## 5. Test the API

Open:

```text
http://localhost:3000
```

Expected response:

```json
{
  "status": "success",
  "message": "Internship API is running",
  "data": {
    "name": "Internship REST API",
    "version": "1.0.0"
  }
}
```

List internships:

```text
http://localhost:3000/api/internships
```

---

# API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API health check |
| GET | `/api/internships` | List internships |
| GET | `/api/internships/:id` | Get one internship |
| POST | `/api/internships` | Create internship |
| PUT | `/api/internships/:id` | Replace internship |
| PATCH | `/api/internships/:id` | Partially update internship |
| DELETE | `/api/internships/:id` | Delete internship |

---

# Pagination

Example:

```text
GET /api/internships?page=1&limit=5
```

Example response:

```json
{
  "status": "success",
  "message": "Internships fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 3,
    "totalPages": 1
  }
}
```

Maximum allowed `limit` is `100`.

---

# Search and Filter

Search by title, company, location, or description:

```text
GET /api/internships?search=frontend
```

Filter by domain:

```text
GET /api/internships?domain=Web%20Development
```

Combine them:

```text
GET /api/internships?page=1&limit=5&search=developer&domain=Web%20Development
```

---

# HTTP Status Codes

| Code | Use |
|---|---|
| 200 | Successful GET, PUT, PATCH, DELETE |
| 201 | Successful POST |
| 400 | Invalid ID or validation error |
| 404 | Internship or route not found |
| 500 | Unexpected server/database error |

---

# Database Files

`schema.sql` contains the SQLite-compatible table schema.

`seed.sql` contains fictional sample internship records.

The application also automatically creates the same table and inserts seed records when the database is empty.

---

# GitHub Submission

1. Create a new public GitHub repository.
2. Upload all files from this folder.
3. Do **not** upload `node_modules`.
4. Do **not** upload `internships.db`.
5. Copy your public GitHub repository URL.
6. Submit that single repository link as the proof link.

The repository already contains setup instructions, schema, seed data, and API examples, so one GitHub link is enough.

---

## Example Git Commands

```bash
git init
git add .
git commit -m "Build internship REST API with SQLite persistence"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

---

## Assignment Checklist

- [x] Internship data model defined
- [x] Consistent API response format
- [x] List endpoint
- [x] Detail endpoint
- [x] Create endpoint
- [x] Update endpoint
- [x] Delete endpoint
- [x] Input validation
- [x] Predictable HTTP status codes
- [x] Pagination
- [x] SQLite persistent storage
- [x] Database schema
- [x] Seed data
- [x] Setup instructions
- [x] API examples
- [x] GitHub-ready repository structure
