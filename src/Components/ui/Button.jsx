export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-2 px-4 rounded-md text-white text-sm transition ${className}`}
    >
      {children}
    </button>
  );
}