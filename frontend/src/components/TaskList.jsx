import '../App.css'
import { useState, useEffect } from 'react'
import Button from './Button'
import Task from './Task'

export default function TaskList() {

    const [tasks, setTasks] = useState([])        // holds an array of tasks
    const [page, setPage] = useState(1)

    const loadTasks = async (page) => {
        try {
            const response = await fetch(`http://localhost:8000/tasks?page=${page}&limit=3`)

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    const handlePagesClicks = (page, add) => {
        if (page + add < 1)
            return
        if (!tasks.length && add > 0)
            return
        setPage(page + add)
    }

    useEffect(() => {
        loadTasks(page)
    }, [page])

    return (
        <div className="w-2/3 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Task Manager</h1>

            <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Button 
                    text="Reload Tasks" 
                    onClick={loadTasks} 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                        </svg>
                    } 
                />
                <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    <button 
                        className="px-4 py-1.5 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
                        onClick={() => handlePagesClicks(page, -1)}
                    >
                        Previous
                    </button>
                    <div className="w-[1px] bg-gray-200 mx-1"></div>
                    <button 
                        className="px-4 py-1.5 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
                        onClick={() => handlePagesClicks(page, 1)}
                    >
                        Next
                    </button>
                </div>
                <span className="text-sm text-gray-500 font-medium ml-2">Page {page}</span>
            </div>
            <Button 
                text="AI tools" 
                icon={
                    <svg fill="#6B7289" width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="Layer 2" id="Layer_2">
                            <path d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z"/>
                            <path d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z"/>
                            <path d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z"/>
                        </g>
                    </svg>
                } 
            />
        </div>
            <div className="space-y-4">
                {tasks.length > 0 ? (
                    tasks.map(t => <Task key={t.id} task={t} />)
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No more tasks found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
