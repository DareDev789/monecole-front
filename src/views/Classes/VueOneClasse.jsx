import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import CreateOrSelectMatiere from "./CreateOrSelectMatiere";
import { classApi } from '../../services/api';
import StudentCardSimple from "../ElevesComp/StudentCardSimple";
import Button from "../../Components/ui/Button";
import EmptyState from "../../Components/ui/EmptyState";

export default function VueOneClasse() {
    const { id } = useParams();
    const { url } = useContext(UrlContext);
    const [classe, setClasse] = useState(null);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    const [editedSubjects, setEditedSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({ name: '', coefficient: 1 });

    const fetchClasse = async () => {
        try {
            const res = await classApi.getById(id);
            setClasse(res.data);
            setEditedSubjects(res.data.subjects || []);
            setStudents(res.data.students_current_year || []);
        } catch (err) {
            console.error("Erreur lors du chargement de la classe :", err);
        }
    };

    useEffect(() => {
        const loadClasse = async () => {
            nProgress.start();
            setLoading(true);
            await fetchClasse();
            setLoading(false);
            nProgress.done();
        };

        loadClasse();
    }, [id]); 

    return (
        <div className="p-4 min-h-screen bg-white">
            {!loading ? (
                <>
                    <div className="p-4 bg-gray-900 text-white shadow-md w-full rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div>
                                <h3 className="text-xl font-semibold "><FontAwesomeIcon icon={faTag} className="mr-2" /> {classe.name}</h3>
                                {students.length > 0 ? (
                                    <p className="text-sm text-gray-100 text-left md:text-right "><i>{students.length}{" étudiant(s)"}</i></p>
                                ) : (
                                    <p className="text-sm text-gray-100 text-left md:text-right "><i>Aucun étudiant</i></p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <div className="my-4">
                                    <Button
                                        className="bg-green-600"
                                        onClick={() => navigate(`/view-one-classe/gerer/${id}`)}>
                                        Gérer les matières
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-100 text-md">Droit d'inscription : {classe.registration_fee} Ariary</p>
                        <p className="text-gray-100 text-md">Ecolage : {classe.monthly_fee} Ariary</p>
                        <p className="text-gray-100 text-md">Classe supérieure : {classe.next_class?.name || 'Aucune'}</p>
                    </div>
                    {students.length > 0 ? (
                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-800 my-4">Liste des élèves dans cette classe</h3>
                            <hr />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students?.map(student => (
                                    <StudentCardSimple
                                        key={student.id}
                                        student={student?.student}
                                        enrolledID={student.id}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            title="Aucun etudiant trouvé dans cette classe"
                            description="Commencez par ajouter des étudiants"
                        />
                    )}
                </>
            ) : (
                <div className="flex justify-center w-full py-8">
                    <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
        </div>
    );
}
