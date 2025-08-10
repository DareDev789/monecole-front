import { motion } from "framer-motion";

export default function GradeForm({ grades, handleGradeChange, subjects, calculateAverage, saveGrades }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      {subjects.length === 0 ? (
        <p className="text-center text-gray-500 italic py-4">
          Aucune matière trouvée pour cette classe.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">Matière</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold border-b">Note</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, index) => (
                  <tr
                    key={s.id}
                    className={`transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                  >
                    <td className="px-6 py-3 border-b">{s.name}</td>
                    <td className="px-6 py-3 border-b text-center">
                      <input
                        type="number"
                        value={grades[s.id] || ""}
                        onChange={e => handleGradeChange(s.id, e.target.value)}
                        min="0"
                        max="20"
                        step="0.01"
                        className="w-24 px-2 py-1 border rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-right font-semibold text-gray-700">
            Moyenne : <span className="text-gray-700">{calculateAverage()}</span>
          </p>

          <div className="text-right">
            <motion.button
              onClick={saveGrades}
              className="px-5 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-900 active:scale-95 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enregistrer
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}
