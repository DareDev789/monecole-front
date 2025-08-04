import { useContext, useEffect, useState } from "react"
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";


export default function CreateOrSelectMatiere({ setNewSubject, newSubject, saveSubject, matieresChoosed }) {
    const [isCreate, setIsCreate] = useState(false);
    const { url } = useContext(UrlContext);
    const [matieres, setMatieres] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const fetchMatieres = async () => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const res = await axios.get(`${url}subjects`, { headers });
            setMatieres(res.data.data || []);
        } catch (err) {
            console.error("Erreur lors du chargement des classes :", err);
        }
    };

    useEffect(() => {
        fetchMatieres();
    }, [matieresChoosed]);


    return (
        <>
            <div className="flex items-center gap-2 mt-8">
                <button disabled={isCreate} onClick={() => setIsCreate(true)} className={`${isCreate ? "bg-gray-300 text-gray-900" : "bg-gray-900 text-white"} text-sm px-5 py-1`}>Créer une nouvelle</button>
                <button disabled={!isCreate} onClick={() => setIsCreate(false)} className={`${isCreate ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-900"} text-sm px-5 py-1`}>Choisir parmi les existantes</button>
            </div>
            {isCreate ? (
                <>
                    <h2 className="text-md font-semibold mt-6 mb-2">Nouvelle matière pour cette classe ? </h2>
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            className="border px-2 py-1"
                            placeholder="Nom de la matière"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                        />
                        <input
                            type="number"
                            className="border px-2 py-1 w-24"
                            value={newSubject.coefficient}
                            onChange={(e) => setNewSubject({ ...newSubject, coefficient: e.target.value })}
                        />
                        <button
                            className="bg-blue-600 text-white px-2 py-1 rounded"
                            onClick={() => saveSubject(newSubject)}
                        >
                            Ajouter
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-md font-semibold mt-6 mb-2">Choisir une matière existante</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Matières
                        </label>
                        <select
                            className="border px-3 py-2 text-sm rounded w-full"
                            onChange={(e) => {
                                const selectedSubjectTemp = matieres.find(cls => cls.id === parseInt(e.target.value));
                                setSelectedSubject(selectedSubjectTemp);
                            }}
                        >
                            <option value="">-- Choisir une matière --</option>
                            {matieres
                                .filter(cls => !matieresChoosed.some(c => c.id === cls.id))
                                .map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}{' (Coef : '}{cls.coefficient}{'}'}
                                    </option>
                                ))}
                        </select>
                        {selectedSubject && (
                            <button className="mt-4 px-5 py-1 bg-gray-900 text-white"
                                onClick={() => {
                                    saveSubject({ ...newSubject, id: selectedSubject.id, name: selectedSubject.name, coefficient: selectedSubject.coefficient });
                                    setSelectedSubject(null)
                                }}>{'>> '}Ajouter {selectedSubject.name}</button>
                        )}
                    </div>
                </>

            )}
        </>
    )
}