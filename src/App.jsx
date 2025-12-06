import React, { useEffect, useRef, useState } from 'react'
import './App.css'

function formatDate(d) {
  return new Date(d).toLocaleString()
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [dark, setDark] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks') || '[]')
    setTasks(saved)
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setDark(darkMode)
    if (darkMode) document.body.classList.add('dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('darkMode', dark)
    document.body.classList.toggle('dark', dark)
  }, [dark])

  function addTask() {
    const text = input.trim()
    if (!text) return alert('Please enter a task ❗')
    const newTask = { id: Date.now(), text, time: formatDate(Date.now()), completed: false }
    setTasks((t) => [newTask, ...t])
    setInput('')
    inputRef.current?.focus()
  }

  function toggleComplete(id) {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  function removeTask(id) {
    setTasks((t) => t.filter((task) => task.id !== id))
  }

  function onKeyPress(e) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="todo-container">
      <div className="header">
        <h2>📝 To-Do List</h2>
        <div className="theme-toggle">
          <input id="dark-mode-toggle" type="checkbox" checked={dark} onChange={() => setDark((d) => !d)} />
          <label htmlFor="dark-mode-toggle" className="toggle-label"></label>
        </div>
      </div>

      <div className="input-section">
        <input
          id="task-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Add a new task..."
        />
        <button id="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <ul id="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''} onClick={() => toggleComplete(task.id)}>
            <div className="task-content">
              <strong>{task.text}</strong>
              <br />
              <small>{task.time}</small>
            </div>
            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeTask(task.id) }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}