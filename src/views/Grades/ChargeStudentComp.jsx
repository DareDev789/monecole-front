import { motion } from "framer-motion";

export default function ChargeStudentComp({
  selectedClass,
  setSelectedClass,
  classes = [],
  selectedTerm,
  setSelectedTerm,
  terms = [],
  loadStudents 
}) {
  return (
    <motion.div
      className="flex flex-wrap gap-4 mb-4 items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Sélecteur Classe */}
      <motion.select
        value={selectedClass}
        onChange={e => setSelectedClass(e.target.value)}
        className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        whileFocus={{ scale: 1.02 }}
      >
        <option value="">-- Classe --</option>
        {classes?.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </motion.select>

      {/* Sélecteur Term */}
      <motion.select
        value={selectedTerm}
        onChange={e => setSelectedTerm(e.target.value)}
        className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        whileFocus={{ scale: 1.02 }}
      >
        <option value="">-- Trimestre/Semestre --</option>
        {terms?.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </motion.select>

      {/* Bouton Charger */}
      <motion.button
        onClick={loadStudents}
        className="px-5 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 active:scale-95 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Charger élèves
      </motion.button>
    </motion.div>
  );
}
