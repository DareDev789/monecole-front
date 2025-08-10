import { motion } from "framer-motion";
import Button from "../../Components/ui/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function MatiereCard({ matiere, onEdit, onDelete }) {
  return (
    <motion.div
      className="p-4 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Titre et coefficient */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-gray-800">{matiere.name}</h3>
        <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md">
          Coeff. {matiere.coefficient}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
        >
          <PencilSquareIcon className="w-4 h-4" />
          Éditer
        </Button>

        <Button
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
          size="sm"
          variant="secondary"
          onClick={() => onDelete(matiere.id, matiere.name)}
        >
          <TrashIcon className="w-4 h-4" />
          Retirer
        </Button>
      </div>
    </motion.div>
  );
}
