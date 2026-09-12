const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function success(message, data = null, extra = {}) {
  return {
    status: "success",
    message,
    data,
    ...extra
  };
}

function failure(message, errors = []) {
  return {
    status: "error",
    message,
    errors
  };
}

function validateInternship(body, isPartial = false) {
  const errors = [];
  const allowedWorkModes = ["Remote", "Hybrid", "On-site"];

  const requiredFields = [
    "title",
    "company",
    "domain",
    "location",
    "workMode",
    "stipend",
    "duration",
    "description",
    "applyUrl"
  ];

  if (!isPartial) {
    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        (typeof body[field] === "string" && body[field].trim() === "")
      ) {
        errors.push(`${field} is required`);
      }
    }
  }

  const stringFields = [
    "title",
    "company",
    "domain",
    "location",
    "duration",
    "description",
    "applyUrl"
  ];

  for (const field of stringFields) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      errors.push(`${field} must be a string`);
    }
  }

  if (
    body.workMode !== undefined &&
    !allowedWorkModes.includes(body.workMode)
  ) {
    errors.push(
      "workMode must be one of: Remote, Hybrid, On-site"
    );
  }

  if (
    body.stipend !== undefined &&
    (!Number.isInteger(body.stipend) || body.stipend < 0)
  ) {
    errors.push("stipend must be a non-negative integer");
  }

  if (body.applyUrl !== undefined && typeof body.applyUrl === "string") {
    try {
      const parsed = new URL(body.applyUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.push("applyUrl must use http or https");
      }
    } catch {
      errors.push("applyUrl must be a valid URL");
    }
  }

  return errors;
}

function getInternshipById(id, callback) {
  db.get(
    "SELECT * FROM internships WHERE id = ?",
    [id],
    callback
  );
}

app.get("/", (req, res) => {
  res.json(
    success("Internship API is running", {
      name: "Internship REST API",
      version: "1.0.0"
    })
  );
});

/**
 * GET /api/internships
 * Supports:
 *   page=1
 *   limit=10
 *   search=frontend
 *   domain=Web Development
 */
app.get("/api/internships", (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const requestedLimit = parseInt(req.query.limit, 10) || 10;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const offset = (page - 1) * limit;

  const search = String(req.query.search || "").trim();
  const domain = String(req.query.domain || "").trim();

  const where = [];
  const params = [];

  if (search) {
    where.push(
      "(title LIKE ? OR company LIKE ? OR location LIKE ? OR description LIKE ?)"
    );
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (domain) {
    where.push("domain = ?");
    params.push(domain);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) AS total FROM internships ${whereClause}`;
  const dataSql = `
    SELECT * FROM internships
    ${whereClause}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  db.get(countSql, params, (countErr, countRow) => {
    if (countErr) {
      return res
        .status(500)
        .json(failure("Failed to count internship records"));
    }

    db.all(dataSql, [...params, limit, offset], (dataErr, rows) => {
      if (dataErr) {
        return res
          .status(500)
          .json(failure("Failed to fetch internship records"));
      }

      const total = countRow.total;
      const totalPages = Math.max(Math.ceil(total / limit), 1);

      return res.json(
        success("Internships fetched successfully", rows, {
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        })
      );
    });
  });
});

app.get("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json(failure("Invalid internship id", ["id must be a positive integer"]));
  }

  getInternshipById(id, (err, row) => {
    if (err) {
      return res
        .status(500)
        .json(failure("Failed to fetch internship"));
    }

    if (!row) {
      return res
        .status(404)
        .json(failure("Internship not found"));
    }

    return res.json(
      success("Internship fetched successfully", row)
    );
  });
});

app.post("/api/internships", (req, res) => {
  const errors = validateInternship(req.body);

  if (errors.length > 0) {
    return res
      .status(400)
      .json(failure("Validation failed", errors));
  }

  const {
    title,
    company,
    domain,
    location,
    workMode,
    stipend,
    duration,
    description,
    applyUrl
  } = req.body;

  const sql = `
    INSERT INTO internships
    (title, company, domain, location, workMode, stipend, duration, description, applyUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title.trim(),
      company.trim(),
      domain.trim(),
      location.trim(),
      workMode,
      stipend,
      duration.trim(),
      description.trim(),
      applyUrl.trim()
    ],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json(failure("Failed to create internship"));
      }

      getInternshipById(this.lastID, (fetchErr, row) => {
        if (fetchErr) {
          return res
            .status(500)
            .json(failure("Internship created but could not be fetched"));
        }

        return res
          .status(201)
          .json(success("Internship created successfully", row));
      });
    }
  );
});

app.put("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json(failure("Invalid internship id", ["id must be a positive integer"]));
  }

  const errors = validateInternship(req.body);

  if (errors.length > 0) {
    return res
      .status(400)
      .json(failure("Validation failed", errors));
  }

  const {
    title,
    company,
    domain,
    location,
    workMode,
    stipend,
    duration,
    description,
    applyUrl
  } = req.body;

  const sql = `
    UPDATE internships
    SET
      title = ?,
      company = ?,
      domain = ?,
      location = ?,
      workMode = ?,
      stipend = ?,
      duration = ?,
      description = ?,
      applyUrl = ?,
      updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      title.trim(),
      company.trim(),
      domain.trim(),
      location.trim(),
      workMode,
      stipend,
      duration.trim(),
      description.trim(),
      applyUrl.trim(),
      id
    ],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json(failure("Failed to update internship"));
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json(failure("Internship not found"));
      }

      getInternshipById(id, (fetchErr, row) => {
        if (fetchErr) {
          return res
            .status(500)
            .json(failure("Internship updated but could not be fetched"));
        }

        return res.json(
          success("Internship updated successfully", row)
        );
      });
    }
  );
});

app.patch("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json(failure("Invalid internship id", ["id must be a positive integer"]));
  }

  const allowedFields = [
    "title",
    "company",
    "domain",
    "location",
    "workMode",
    "stipend",
    "duration",
    "description",
    "applyUrl"
  ];

  const updateKeys = Object.keys(req.body).filter((key) =>
    allowedFields.includes(key)
  );

  if (updateKeys.length === 0) {
    return res
      .status(400)
      .json(failure("No valid fields supplied for update"));
  }

  const errors = validateInternship(req.body, true);

  if (errors.length > 0) {
    return res
      .status(400)
      .json(failure("Validation failed", errors));
  }

  const setParts = [];
  const values = [];

  for (const key of updateKeys) {
    setParts.push(`${key} = ?`);
    const value =
      typeof req.body[key] === "string"
        ? req.body[key].trim()
        : req.body[key];
    values.push(value);
  }

  setParts.push("updatedAt = CURRENT_TIMESTAMP");

  const sql = `
    UPDATE internships
    SET ${setParts.join(", ")}
    WHERE id = ?
  `;

  db.run(sql, [...values, id], function (err) {
    if (err) {
      return res
        .status(500)
        .json(failure("Failed to update internship"));
    }

    if (this.changes === 0) {
      return res
        .status(404)
        .json(failure("Internship not found"));
    }

    getInternshipById(id, (fetchErr, row) => {
      if (fetchErr) {
        return res
          .status(500)
          .json(failure("Internship updated but could not be fetched"));
      }

      return res.json(
        success("Internship updated successfully", row)
      );
    });
  });
});

app.delete("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json(failure("Invalid internship id", ["id must be a positive integer"]));
  }

  db.run(
    "DELETE FROM internships WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json(failure("Failed to delete internship"));
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json(failure("Internship not found"));
      }

      return res.json(
        success("Internship deleted successfully", { id })
      );
    }
  );
});

app.use((req, res) => {
  res
    .status(404)
    .json(failure("Route not found"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json(failure("Internal server error"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
