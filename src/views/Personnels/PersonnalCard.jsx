import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function PersonnalCard({ employe, selected, toggleSelect, onEdit, handleDelete }) {
  return (
    <motion.div
      key={employe.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      className="flex justify-between items-start border border-gray-100 p-5 rounded-2xl bg-white shadow-sm"
    >
      {/* Left side - Infos */}
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-3 w-4 h-4 accent-indigo-600"
            checked={selected.includes(employe.id)}
            onChange={() => toggleSelect(employe.id)}
          />
          <h3 className="font-semibold text-lg text-gray-900">
            {employe.first_name} {employe.last_name}
          </h3>
        </div>
        <p className="text-sm text-gray-500">{employe.position}</p>
        <p className="text-sm text-gray-500">{employe.email}</p>
        <p className="text-xs text-gray-400 mt-1">Embauché le {employe.hire_date}</p>
      </div>

      {/* Right side - Actions */}
      <div className="flex flex-col space-y-2">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-full py-1 p-2 shadow-sm"
          onClick={() => onEdit(employe)}
          title="Modifier"
        >
          <FontAwesomeIcon icon={faEdit} className="text-sm"/>
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-full py-1 p-2 shadow-sm"
          onClick={() => handleDelete(employe.id)}
          title="Supprimer"
        >
          <FontAwesomeIcon icon={faTrash} className="text-sm"/>
        </button>
      </div>
    </motion.div>
  );
}
