
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export default function TaskForm() {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'low',
        due_date: null
    });

    const createTask = async (e) => {

        e.preventDefault();

        const url = `${API_URL}/tasks`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 2. Stringify the state object for the body
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error(`${response.status}: failed to create the task !!!`)
            }

            setFormData({ title: '', description: '', priority: 'low', due_date: null });  // clearing the form data
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-1/3 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>

            {/* 3. Use onSubmit instead of onClick on the button */}
            <form onSubmit={createTask} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        type="text"
                        placeholder="What needs to be done?"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add some details..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            name="due_date"
                            value={formData.due_date || ''}
                            onChange={handleChange}
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}