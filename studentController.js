const { db } = require("../database");

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateStudent(data, requireAll = true) {
  const errors = [];
  const allowed = ["name", "email", "course"];

  for (const key of Object.keys(data)) {
    if (!allowed.includes(key)) {
      errors.push(`Unknown field: ${key}`);
    }
  }

  for (const field of allowed) {
    if (requireAll && (typeof data[field] !== "string" || !data[field].trim())) {
      errors.push(`${field} is required and must be a non-empty string.`);
    } else if (!requireAll && data[field] !== undefined &&
               (typeof data[field] !== "string" || !data[field].trim())) {
      errors.push(`${field} must be a non-empty string when provided.`);
    }
  }

  if (data.email !== undefined && typeof data.email === "string" &&
      data.email.trim() && !validEmail(data.email.trim())) {
    errors.push("email must be a valid email address.");
  }

  return errors;
}

function createStudent(req, res, next) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ success: false, message: "Request body must be a JSON object." });
    }

    const errors = validateStudent(data, true);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const course = data.course.trim();

    const result = db.prepare(
      "INSERT INTO students (name, email, course) VALUES (?, ?, ?)"
    ).run(name, email, course);

    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: "Student created successfully.", data: student });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ success: false, message: "A student with this email already exists." });
    }
    return next(error);
  }
}

function getAllStudents(req, res, next) {
  try {
    const students = db.prepare("SELECT * FROM students ORDER BY id").all();
    return res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    return next(error);
  }
}

function getStudentById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
    }

    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.json({ success: true, data: student });
  } catch (error) {
    return next(error);
  }
}

function updateStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
    }

    const current = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    if (!current) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const data = req.body;
    if (!data || typeof data !== "object" || Array.isArray(data) ||
        Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "Provide at least one field to update." });
    }

    const errors = validateStudent(data, false);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const name = data.name === undefined ? current.name : data.name.trim();
    const email = data.email === undefined ? current.email : data.email.trim().toLowerCase();
    const course = data.course === undefined ? current.course : data.course.trim();

    db.prepare("UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?")
      .run(name, email, course, id);

    const updated = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    return res.json({ success: true, message: "Student updated successfully.", data: updated });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ success: false, message: "A student with this email already exists." });
    }
    return next(error);
  }
}

function deleteStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
    }

    const result = db.prepare("DELETE FROM students WHERE id = ?").run(id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};