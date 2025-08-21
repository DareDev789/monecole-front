import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTag } from "@fortawesome/free-solid-svg-icons";
import { classApi } from '../../services/api';
import StudentCardSimple from "../ElevesComp/StudentCardSimple";
import Button from "../../Components/ui/Button";
import EmptyState from "../../Components/ui/EmptyState";
import PrintableClasse from "./PrintableClasse";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

export default function VueOneClasse() {
    const { id } = useParams();
    const [classe, setClasse] = useState(null);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const fetchClasse = async () => {
        try {
            const res = await classApi.getById(id);
            setClasse(res.data);
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
                    {/* HEADER */}
                    <div className="p-4 bg-gray-900 text-white shadow-md w-full rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div>
                                <h3 className="text-xl font-semibold ">
                                    <FontAwesomeIcon icon={faTag} className="mr-2" />
                                    {classe.name}
                                </h3>
                                {students.length > 0 ? (
                                    <p className="text-sm text-gray-100 text-left md:text-right">
                                        <i>{students.length} étudiant(s)</i>
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-100 text-left md:text-right">
                                        <i>Aucun étudiant</i>
                                    </p>
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

                    {/* LISTE ÉLÈVES */}
                    {students.length > 0 ? (
                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-800 my-4">Liste des élèves</h3>
                            <div className="flex justify-end mb-4">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setShowModal(true)} // ouvre le modal
                                >
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Imprimer la liste
                                </Button>
                            </div>
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
                            title="Aucun étudiant trouvé dans cette classe"
                            description="Commencez par ajouter des étudiants"
                        />
                    )}
                </>
            ) : (
                <div className="flex justify-center w-full py-8">
                    <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 p-6 relative">
                        <h2 className="text-xl font-bold mb-4">Aperçu PDF</h2>

                        <div className="h-[70vh] border rounded">
                            <PDFViewer width="100%" height="100%">
                                <PrintableClasse classe={classe} students={students} />
                            </PDFViewer>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button className="bg-gray-500" onClick={() => setShowModal(false)}>
                                Fermer
                            </Button>
                            <PDFDownloadLink
                                document={<PrintableClasse classe={classe} students={students} />}
                                fileName={`classe_${classe?.name}.pdf`}
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <Button className="bg-blue-300">Préparation...</Button>
                                    ) : (
                                        <Button className="bg-blue-600">Télécharger PDF</Button>
                                    )
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
