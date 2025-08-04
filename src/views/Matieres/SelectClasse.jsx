import { useContext, useEffect, useState } from "react"
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";

export default function SelectClasse({ newClass, setNewClass, saveClasse, classesChoosed }) {
    const { url } = useContext(UrlContext);
    const [classes, setClasses] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState(null);

    const fetchClasses = async () => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
        const headers = {
            Authorization: `Bearer ${token}`,
        };

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
    return (
        <>
            <h2 className="text-md font-semibold mt-6 mb-2">Choisir une classe</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classes
                </label>
                <select
                    className="border px-3 py-2 text-sm rounded w-full"
                    onChange={(e) => {
                        const selectedClassTemp = classes.find(cls => cls.id === parseInt(e.target.value));
                        setNewClass(selectedClassTemp);
                    }}
                >
                    <option value="">-- Choisir une matière --</option>
                    {classes
                        .filter(cls => !classesChoosed.some(c => c.id === cls.id))
                        .map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                </select>
                {newClass && (
                    <button className="mt-4 px-5 py-1 bg-gray-900 text-white"
                        onClick={() => {
                            saveClasse({ ...newClass, id: newClass.id, name: newClass.name });
                            setNewClass(null)
                        }}>{'>> '}Ajouter {newClass.name}</button>
                )}
            </div>
        </>
    )
}