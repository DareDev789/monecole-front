import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ClassCard({ classe, onEdit, handleDelete }) {
  return (
    <motion.div
      key={classe.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{
        translateY: -4,
        boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
      }}
      className="bg-white shadow rounded-2xl p-6 border border-gray-100 transition-colors duration-200 hover:border-blue-200 overflow-auto"
    >
      {/* Titre */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{classe.name}</h3>

      {/* Nombre d'étudiants */}
      {classe?.students_current_year?.length > 0 ? (
        <p className="text-center text-sm text-gray-500 mb-4 italic">
          {classe.students_current_year.length} étudiant(s)
        </p>
      ) : (
        <p className="text-center text-sm text-gray-400 mb-4 italic">
          Aucun étudiant
        </p>
      )}

      {/* Infos */}
      <div className="space-y-1.5 text-gray-600 text-sm">
        <p>
          <span className="font-medium">Droit d'inscription :</span>{" "}
          {classe.registration_fee} Ariary
        </p>
        <p>
          <span className="font-medium">Ecolage :</span>{" "}
          {classe.monthly_fee} Ariary
        </p>
        <p>
          <span className="font-medium">Classe supérieure :</span>{" "}
          {classe.next_class?.name || "Aucune"}
        </p>
      </div>

      {/* Boutons */}
      <div className="mt-5 flex flex-col sm:flex-row sm:justify-between gap-3">
        <Link
          to={`/view-one-classe/${classe.id}`}
          className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Voir Détails
        </Link>

        <div className="flex gap-2 justify-center sm:justify-end flex-1">
          <button
            className="flex items-center gap-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm hover:bg-gray-900"
            onClick={onEdit}
          >
            <FontAwesomeIcon icon={faEdit} /> Éditer
          </button>
          <button
            className="flex items-center gap-1 bg-red-500 text-white rounded-lg px-3 py-2 text-sm hover:bg-red-600"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} /> Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
