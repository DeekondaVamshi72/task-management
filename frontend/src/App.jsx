import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5001/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [error, setError] = useState('')

  // load tasks on first render
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError('Could not load tasks. Is the backend running?')
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    setError('')

    if (newTitle.trim() === '') {
      setError('Please enter a task title')
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to add task')
        return
      }

      const created = await res.json()
      setTasks([...tasks, created])
      setNewTitle('')
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setError('Could not delete task')
        return
      }
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })
      const updated = await res.json()
      setTasks(tasks.map(t => (t.id === task.id ? updated : t)))
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const saveEdit = async (id) => {
    if (editingTitle.trim() === '') {
      setError('Task title cannot be empty')
      return
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update task')
        return
      }

      const updated = await res.json()
      setTasks(tasks.map(t => (t.id === id ? updated : t)))
      cancelEdit()
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one above!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'task done' : 'task'}>
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />
                  <span className="title">{task.title}</span>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App;
