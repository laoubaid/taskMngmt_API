

export default function Button({ onClick, text, icon }) {

    return (
        <button 
            onClick={onClick}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
            {/* Render the icon if provided, otherwise nothing */}
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            <span>{text}</span>
        </button>
    );
}