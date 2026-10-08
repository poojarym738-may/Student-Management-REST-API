require("dotenv").config();

const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const { initializeDatabase } = require("./database");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

initializeDatabase();

app.use(express.json());

// Simple home route
app.get("/", (req, res) => {
  res.json({
    message: "Student Management REST API is running",
    documentation: "See README.md and API_DOCUMENTATION.md"
  });
});

// API routes
app.use("/api/students", studentRoutes);

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body."
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});