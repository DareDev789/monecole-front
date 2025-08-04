export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}