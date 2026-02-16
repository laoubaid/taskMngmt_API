import { useState } from "react";
import Button from "./Button";

export default function Task({ task }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [estimate, setEstimate] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/tasks/estimation/${task.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    additional_context: context,
                    complexity_level: "medium" // You can add a dropdown for this later
                }),
            });
            const data = await response.json();
            setEstimate(data);
        } catch (err) {
            console.error("AI Estimation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    text="AI estimates" 
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
            
            <p className="text-gray-600 mb-4">{task.description || "No description provided."}</p>
            
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <p className="text-sm font-medium text-gray-500">
                        {task.completed ? 'Done' : 'Pending'}
                    </p>
                </div>
                <span className={`text-xs uppercase px-2 py-1 rounded-full font-bold ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-blue-100 text-blue-600'
                }`}>
                    {task.priority}
                </span>
            </div>

            {/* POP-UP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Time Estimate</h3>
                            
                            {!estimate ? (
                                // SHOW FORM
                                <>
                                    <p className="text-sm text-gray-500 mb-4">Provide extra context for a more accurate prediction.</p>
                                    <textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        placeholder="e.g., I need to setup the environment first..."
                                        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                    />
                                </>
                            ) : (
                                // SHOW RESULT
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 animate-in slide-in-from-bottom-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-3xl font-bold text-blue-700">{estimate.estimated_minutes}m</span>
                                        <span className="text-xs font-bold text-blue-500 bg-white px-2 py-1 rounded-full border border-blue-200">
                                            {Math.round(estimate.confidence_score * 100)}% Confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-800 italic">"{estimate.explanation}"</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEstimate(null); // reset for next time
                                    setContext("");
                                }}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                            >
                                {estimate ? "Close" : "Cancel"}
                            </button>
                            
                            {!estimate && (
                                <button 
                                    onClick={handleGenerate}
                                    disabled={loading || !context}
                                    className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : "Generate"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}