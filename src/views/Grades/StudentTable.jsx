import { motion } from "framer-motion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import EmptyState from "../../Components/ui/EmptyState";

export default function StudentTable({ students, openModal }) {
    return (
        <motion.div
            className="overflow-x-auto shadow-md rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                        <th className="px-6 py-3 text-left text-sm font-semibold border-b">Nom</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="2" className="text-center py-4 text-gray-500 italic">
                                <EmptyState
                                    title="Aucun étudiant trouvé"
                                    description="Commencez par ajouter un nouvel étudiant"
                                />
                            </td>
                        </tr>
                    ) : (
                        students.map((s, index) => (
                            <motion.tr
                                key={s.id}
                                className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                whileHover={{ scale: 1.01 }}
                            >
                                <td className="px-6 py-3 border-b text-sm text-gray-800">
                                    {s.first_name} {s.last_name}
                                </td>
                                <td className="px-6 py-3 border-b text-center">
                                    <motion.button
                                        onClick={() => openModal(s)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg shadow hover:bg-gray-700 active:scale-95 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Saisir notes
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </motion.div>
    );
}
