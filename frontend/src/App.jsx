import './App.css'
import { useState, useEffect } from 'react'

function Button({ onClick }) {
  return (
    <button onClick={onClick}>
      Load Tasks
    </button>
  )
}

function App() {

  const [tasks, setTasks] = useState([])    // holds an array of tasks
  const [page, setPage] = useState(1)

  const loadTasks = async (page) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks?page=${page}&limit=1`)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handlePagesClicks = (page) => {
    if (page < 1)
      return
    setPage(page)
  }

  useEffect(() => {
    loadTasks(page)
  }, [page])

  return (
    <div>
      <h1>Task Manager</h1>
      <Button onClick={() => loadTasks(page)} />
      <button onClick={() => handlePagesClicks(page - 1)}>Previous</button>
      <button onClick={() => handlePagesClicks(page + 1)}>Next</button>
      {tasks.map(task => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>{task.priority}</p>
          <p>{task.completed ? 'Done' : 'Pending'}</p>
        </div>
      ))}
    </div>
  )
}

export default App

