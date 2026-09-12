# API Examples

Base URL:

```text
http://localhost:3000
```

## 1. Health Check

### Request

```http
GET /
```

### Example Response

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

---

## 2. List Internships

```http
GET /api/internships
```

Pagination:

```http
GET /api/internships?page=1&limit=5
```

Search:

```http
GET /api/internships?search=frontend
```

Domain filter:

```http
GET /api/internships?domain=Web%20Development
```

Search + filter + pagination:

```http
GET /api/internships?page=1&limit=5&search=developer&domain=Web%20Development
```

---

## 3. Get One Internship

```http
GET /api/internships/1
```

---

## 4. Create Internship

```http
POST /api/internships
Content-Type: application/json
```

```json
{
  "title": "Backend Developer Intern",
  "company": "CloudCore",
  "domain": "Backend Development",
  "location": "Bengaluru",
  "workMode": "Hybrid",
  "stipend": 15000,
  "duration": "6 Months",
  "description": "Build REST APIs using Node.js and Express.",
  "applyUrl": "https://example.com/apply/backend"
}
```

Successful create status: `201 Created`

---

## 5. Full Update

```http
PUT /api/internships/1
Content-Type: application/json
```

```json
{
  "title": "Frontend Engineer Intern",
  "company": "TechNova",
  "domain": "Web Development",
  "location": "Hyderabad",
  "workMode": "Remote",
  "stipend": 13000,
  "duration": "4 Months",
  "description": "Build responsive web interfaces and reusable components.",
  "applyUrl": "https://example.com/apply/frontend-engineer"
}
```

---

## 6. Partial Update

```http
PATCH /api/internships/1
Content-Type: application/json
```

```json
{
  "stipend": 16000,
  "workMode": "Hybrid"
}
```

---

## 7. Delete Internship

```http
DELETE /api/internships/1
```

---

# Common Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Internship created |
| 400 | Invalid input |
| 404 | Internship or route not found |
| 500 | Server/database error |
