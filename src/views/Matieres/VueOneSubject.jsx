import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import SelectClasse from "./SelectClasse";
import { motion, AnimatePresence } from "framer-motion";
import { SubjectsApi } from "../../services/api";

export default function VueOneSubject() {
    const { id } = useParams();
    const { url } = useContext(UrlContext);
    const [subject, setSubject] = useState({
        name: '',
        coefficient: '',
        classes: [],
        id: null,
    });

    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({});

    const fetchSubjects = async () => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const res = await axios.get(`${url}subjects/${id}`, { headers });
            setSubject(res.data);
            setClasses(res.data.classes || []);
        } catch (err) {
            console.error("Erreur lors du chargement de la matière :", err);
        }
    };

    useEffect(() => {
        const loadSubject = async () => {
            nProgress.start();
            await fetchSubjects();
            nProgress.done();
        };
        loadSubject();
    }, [id]);

    const saveClasse = async (classe) => {
        try {
            nProgress.start();

            if (subject.id) {
                const updatedClasses = [
                    ...classes
                        .filter(c => c.id !== classe.id)
                        .map(c => ({
                            id: c.id,
                            coefficient: c.coefficient ?? subject.coefficient,
                        })),
                    { id: classe.id, coefficient: subject.coefficient }
                ];
                const data = {
                    name: subject.name,
                    coefficient: subject.coefficient,
                    classes: updatedClasses,
                };

                await SubjectsApi.update(subject.id, data);

                setNewClass({});
                fetchSubjects();
            }
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
        } finally {
            nProgress.done();
        }
    };


    const RetirerClasse = async (classId) => {
        try {
            nProgress.start();
            const data = {
                class_id: classId,
                subject_id: subject.id,
            };
            await SubjectsApi.retirer(data);
            fetchSubjects();
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        } finally {
            nProgress.done();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Titre matière */}
            {subject.name && (
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold text-gray-900 mb-6"
                >
                    Matière : <span className="text-indigo-900">{subject.name}</span>{" "}
                    <span className="text-sm text-gray-500">(Coeff : {subject.coefficient})</span>
                </motion.h1>
            )}

            {/* Liste des classes */}
            <section className="bg-white rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Classes associées</h2>
                <AnimatePresence>
                    {classes.length > 0 ? (
                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 max-h-96 overflow-auto"
                        >
                            {classes.map((classe) => (
                                <motion.li
                                    key={classe.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex justify-between items-center bg-indigo-50 rounded-lg p-4 shadow-sm"
                                >
                                    <span className="font-medium text-indigo-900">{classe.name}</span>
                                    <button
                                        onClick={() => RetirerClasse(classe.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 py-1 transition"
                                        aria-label={`Retirer la classe ${classe.name}`}
                                        title={`Retirer la classe ${classe.name}`}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                </motion.li>
                            ))}
                        </motion.ul>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 italic text-center"
                        >
                            Aucune classe n'est associée à cette matière.
                        </motion.p>
                    )}
                </AnimatePresence>
            </section>

            {/* Ajout nouvelle classe */}
            <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="text-indigo-600" />
                    Ajouter une classe
                </h2>
                <SelectClasse
                    newClass={newClass}
                    setNewClass={setNewClass}
                    saveClasse={saveClasse}
                    classesChoosed={classes}
                />
            </section>
        </div>
    );
}
