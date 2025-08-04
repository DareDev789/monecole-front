import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SelectClasse from "./SelectClasse";

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
            console.log(res.data);
        } catch (err) {
            console.error("Erreur lors du chargement de la classe :", err);
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
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
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

            }
            setNewClass({});
            fetchSubjects();
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
        } finally {
            nProgress.done();
        }
    };


    const RetirerClasse = async (id) => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
        const headers = { Authorization: `Bearer ${token}` };

        try {
            nProgress.start();
            await axios.delete(`${url}class-subjects/remove`, {
                headers,
                data: {
                    class_id: id,
                    subject_id: subject.id
                }
            });
            fetchSubjects();
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        } finally {
            nProgress.done();
        }
    };

    return (
        <div className="p-4 min-h-screen bg-white">
            {subject.name && <h1 className="text-xl mb-2">Matière : <span className="font-bold">{subject.name}</span> <span className="text-sm"><i>( Coeff : {subject.coefficient})</i></span></h1>}
            <hr />

            <div className="mt-4">
                {classes.length > 0 ? (
                    <>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[500px] p-0 border rounded">
                                <div className="divide-y divide-gray-200 bg-blue-50/5 z-0 overflow-y-auto">
                                    <div className="grid grid-cols-[4fr,4fr] px-2 py-1 text-sm font-bold bg-gray-900/20">
                                        <div>Matières</div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="min-w-[500px] p-0 border rounded">
                                    <div className="divide-y divide-gray-200 bg-blue-50/5 z-0 overflow-y-auto">
                                        {classes.map((classe, index) => (
                                            <div key={index} className="grid grid-cols-[4fr,4fr] px-2 py-1 text-sm">
                                                <div className="px-2">
                                                    {classe.name}
                                                </div>

                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                                                        onClick={() => RetirerClasse(classe.id)}
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
                    <p className="text-center text-gray-500 text-sm"><i>Aucune classe n'est associée à cette matière !</i></p>
                )}


                <SelectClasse newClass={newClass} setNewClass={setNewClass} saveClasse={saveClasse} classesChoosed={classes} />
            </div>
        </div>
    );
}
