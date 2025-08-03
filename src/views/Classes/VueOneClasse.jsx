import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CreateOrSelectMatiere from "./CreateOrSelectMatiere";

export default function VueOneClasse() {
    const { id } = useParams();
    const { url } = useContext(UrlContext);
    const [classe, setClasse] = useState({
        name: '',
        registration_fee: '',
        monthly_fee: '',
        subjects: [],
        next_class: {},
        id: null,
    });

    const [editedSubjects, setEditedSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({ name: '', coefficient: 1 });

    const fetchClasse = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const res = await axios.get(`${url}classes/${id}`, { headers });
            setClasse(res.data);
            setEditedSubjects(res.data.subjects || []);
        } catch (err) {
            console.error("Erreur lors du chargement de la classe :", err);
        }
    };


    useEffect(() => {
        const loadClasse = async () => {
            nProgress.start();
            await fetchClasse();
            nProgress.done();
        };

        loadClasse();
    }, [id]);


    const updateField = (index, field, value) => {
        const updated = [...editedSubjects];
        updated[index][field] = value;
        setEditedSubjects(updated);
    };

    const saveSubject = async (subject) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { Authorization: `Bearer ${token}` };

        try {
            nProgress.start();
            if (subject.id) {
                await axios.put(`${url}subjects/${subject.id}`, {
                    name: subject.name,
                    coefficient: subject.coefficient,
                    classes: [
                        {
                            id: classe.id,
                            coefficient: subject.coefficient,
                        },
                    ],
                }, { headers });
            } else {
                await axios.post(`${url}subjects`, {
                    name: subject.name,
                    coefficient: subject.coefficient,
                    classes: [
                        {
                            id: classe.id,
                            coefficient: subject.coefficient,
                        },
                    ],
                }, { headers });

                setNewSubject({ name: '', coefficient: 1 });
            }

            fetchClasse();
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
        } finally {
            nProgress.done();
        }
    };


    const deleteSubject = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = { Authorization: `Bearer ${token}` };

        try {
            nProgress.start();
            await axios.delete(`${url}class-subjects/remove`, {
            headers,
            data: {
                class_id: classe.id,
                subject_id: id
            }
        });
            fetchClasse();
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        } finally {
            nProgress.done();
        }
    };

    return (
        <div className="p-4 min-h-screen bg-white">
            <h1 className="text-xl mb-2">Classe : <span className="font-bold">{classe.name}</span></h1>
            <hr />
            <p className="text-sm text-gray-600">Droit d'inscription : {classe.registration_fee} Ar</p>
            <p className="text-sm text-gray-600">Ecolage : {classe.monthly_fee} Ar</p>
            <p className="text-sm text-gray-600">Classe supérieure : {classe.next_class?.name || 'Aucune'}</p>

            <div className="mt-4">
                {editedSubjects.length > 0 ? (
                    <>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[500px] p-0 border rounded">
                                <div className="divide-y divide-gray-200 bg-blue-50/5 z-0 overflow-y-auto">
                                    <div className="grid grid-cols-[4fr,2fr,4fr] px-2 py-1 text-sm font-bold bg-gray-900/20">
                                        <div>Matières</div>
                                        <div>Coefficient</div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="min-w-[500px] p-0 border rounded">
                                    <div className="divide-y divide-gray-200 bg-blue-50/5 z-0 overflow-y-auto">
                                        {editedSubjects.map((matiere, index) => (
                                            <div key={index} className="grid grid-cols-[4fr,2fr,4fr] px-2 py-1 text-sm">
                                                <div className="px-2">
                                                    <input
                                                        type="text"
                                                        className="border-none w-full px-2 py-1 text-sm capitalize"
                                                        value={matiere.name}
                                                        onChange={(e) => updateField(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="px-2">
                                                    <input
                                                        type="number"
                                                        step={0.5}
                                                        className="border-none w-full px-2 py-1 text-sm"
                                                        value={matiere.coefficient}
                                                        onChange={(e) => updateField(index, 'coefficient', e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="bg-green-600 text-white text-sm px-2 py-1 rounded"
                                                        onClick={() => saveSubject(matiere)}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                                                        onClick={() => deleteSubject(matiere.id)}
                                                    >
                                                        Retirer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 text-sm"><i>Aucune matière n'est associée à cette classe !</i></p>
                )}


                <CreateOrSelectMatiere setNewSubject={setNewSubject} newSubject={newSubject} saveSubject={saveSubject} matieresChoosed={editedSubjects}/>
            </div>
        </div>
    );
}
