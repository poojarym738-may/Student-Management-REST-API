# Student Management REST API

A beginner-friendly backend project for managing student records with Node.js, Express.js, and SQLite. It demonstrates REST API design, CRUD operations, input validation, error handling, database integration, and API documentation.

## Features

- Create, list, view, update, and delete student records.
- SQLite database is created automatically when the server starts.
- Required-field and email-format validation.
- Unique email addresses.
- Parameterized SQL queries.
- JSON responses and appropriate HTTP status codes.
- Postman testing instructions.

## Requirements

- Node.js 18 or newer
- npm (included with Node.js)
- Postman (optional, for API testing)

## Run locally

1. Download and extract the project ZIP.
2. Open a terminal/command prompt in the `student-management-rest-api` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Optional: copy `.env.example` to `.env` and change settings if needed.
5. Start the server:

   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in a browser. The API should return a JSON welcome message.

The SQLite file `students.db` is created automatically in the project folder on first run. Do not upload the database file to GitHub.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/students` | Create a student |
| GET | `/api/students` | List all students |
| GET | `/api/students/:id` | Get a student by ID |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for request bodies, response examples, and error codes.

## Example request

Send a `POST` request to `http://localhost:3000/api/students` with **Body → raw → JSON**:

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "course": "BCA"
}
```

## Project structure

```text
student-management-rest-api/
├── controllers/
│   └── studentController.js
├── routes/
│   └── studentRoutes.js
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md
├── database.js
├── package.json
├── README.md
└── server.js
```

## Upload to GitHub

Create an empty repository on GitHub, then run these commands from this project folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Build student management REST API"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `.env`, `node_modules`, or `students.db`.

## Important

This is a starter project. Run it on your own computer, test every endpoint, and make sure you understand the code before submitting it for internship review. Do not claim it is deployed unless you have deployed it to a hosting service.
