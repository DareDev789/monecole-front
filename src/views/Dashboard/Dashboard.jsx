import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { classApi, enrollmentsApi, personnelsApi, SubjectsApi } from "../../services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Élèves inscrits", value: 245, icon: "🎓" },
    { label: "Staffs", value: 34, icon: "👩‍🏫" },
    { label: "Classes actives", value: 12, icon: "🏫" },
    { label: "Paiements reçus ce mois", value: "3 400 000 Ar", icon: "💰" }
  ]);

  const [lastStudents, setLastStudents] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classes, enrolledStudent, personnal, matieres] = await Promise.all([
        classApi.getAll(),
        enrollmentsApi.getAll(),
        personnelsApi.getAll(),
        SubjectsApi.getAll(),
      ]);
      setStats([
        { label: "Élèves inscrits", value: enrolledStudent.data.length, icon: "🎓" },
        { label: "Staffs", value: personnal.data.pagination.total, icon: "👩‍🏫" },
        { label: "Classes actives", value: classes.data.total, icon: "🏫" },
        { label: "Matières", value: matieres.data.total, icon: "📚" }
      ]);

      setLastStudents(enrolledStudent.data.slice(0, 3));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center w-full py-8">
            <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </>
      ) : (
        <>
          <div className="p-6 bg-gray-50 min-h-screen space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ label, value, icon }) => (
                <motion.div
                  key={label}
                  className="bg-white rounded-lg shadow p-5 flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-3xl">{icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-xl font-semibold">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Derniers élèves */}
              <motion.div
                className="bg-white rounded-lg shadow p-5 col-span-1 md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-4">Derniers élèves inscrits</h2>
                <ul className="divide-y divide-gray-200">
                  {lastStudents.map((student) => (
                    <li key={student.id} className="py-2 flex justify-between">
                      <span>{student.student.first_name}{" "}{student.student.last_name}</span>
                      <span className="text-gray-500 italic">{student.class.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
