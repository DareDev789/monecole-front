import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";

export default function SelectClasse({ newClass, setNewClass, saveClasse, classesChoosed }) {
  const { url } = useContext(UrlContext);
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get(`${url}classes`, { headers });
      setClasses(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des classes :", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [classesChoosed]);

  const handleAdd = () => {
    if (newClass && newClass.id) {
      saveClasse(newClass);
      setNewClass(null);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Ajouter une classe</h2>
      <select
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        value={newClass?.id || ""}
        onChange={(e) => {
          const selectedId = parseInt(e.target.value);
          const selectedClassTemp = classes.find((cls) => cls.id === selectedId);
          setNewClass(selectedClassTemp || null);
        }}
      >
        <option value="" disabled>
          -- Sélectionner une classe disponible --
        </option>
        {classes
          .filter((cls) => !classesChoosed.some((c) => c.id === cls.id))
          .map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
      </select>

      <button
        onClick={handleAdd}
        disabled={!newClass || !newClass.id}
        className={`mt-4 w-full rounded-md px-4 py-2 font-semibold text-white transition ${
          newClass && newClass.id
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Ajouter {newClass?.name || ""}
      </button>
    </div>
  );
}
