# Task Manager

A simple task management application built as a mini project.

- **Frontend:** React (Vite)
- **Backend:** Python (Flask)
- **Storage:** In-memory (Python list) — data resets when backend restarts

## Features

- Add a new task
- Edit an existing task
- Delete a task
- Mark a task as complete / incomplete
- Handles empty task titles and deletion of non-existent tasks

## Project Structure

```
task-management/
├── backend/                # Flask API
│   ├── app.py
│   └── requirements.txt
└── frontend/               # React app (Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## How to Run

You will need **two terminals** — one for the backend and one for the frontend.

### 1. Backend (Python / Flask)

```bash
cd task-management/backend
python3 -m venv venv
source venv/bin/activate          # on Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will start on **http://localhost:5001**.

### 2. Frontend (React / Vite)

```bash
cd task-management/frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**.

Open your browser at http://localhost:3000 and start using the app.

## API Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/tasks`          | Get all tasks            |
| POST   | `/api/tasks`          | Create a new task        |
| PUT    | `/api/tasks/<id>`     | Update a task            |
| DELETE | `/api/tasks/<id>`     | Delete a task            |

### Task object

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false
}
```

## Notes

- Storage is in-memory as required — no database is used.
- Data is lost whenever the backend is restarted.
- CORS is enabled on the backend so the React app can talk to it.
