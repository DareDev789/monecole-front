import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { classApi, SubjectsApi } from '../../services/api';
import Button from "../../Components/ui/Button";
import EmptyState from "../../Components/ui/EmptyState";
import MatiereCard from "../Matieres/MatiereCard";
import MatieresForm from "../Matieres/MatieresForm";
import Modal from "../../Components/ui/Modal";
import Notiflix from "notiflix";
import CreateOrSelectMatiere from "./CreateOrSelectMatiere";


export default function MatiereToClassManager() {
    const { id } = useParams();
    const { url } = useContext(UrlContext);
    const [classe, setClasse] = useState(null);
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [editingMatiere, setEditingMatiere] = useState(null);
    const [isCreate, setIsCreate] = useState(true);

    const fetchClasse = async () => {
        try {
            const res = await classApi.getById(id);
            setClasse(res.data);
            setMatieres(res.data.subjects || []);
        } catch (err) {
            console.error("Erreur lors du chargement de la classe :", err);
        }
    };

    const loadClasse = async () => {
        nProgress.start();
        setLoading(true);
        await fetchClasse();
        setLoading(false);
        nProgress.done();
    };

    useEffect(() => {
        loadClasse();
    }, [id]);

    const onRemoveClass = async (class_id, subject_id, name) => {
        const data = {
            class_id: parseInt(class_id), subject_id: subject_id
        }
        try {
            Notiflix.Confirm.show(
                'Supprimer l\'étudiant',
                `Voulez-vous vraiment retirer ${name} de cette classe ?`,
                'Oui, Retirer',
                'Annuler',
                async () => {
                    try {
                        await SubjectsApi.retirer(data);
                        Notiflix.Notify.success('matière supprimée avec succès');
                        loadClasse();
                    } catch (error) {
                        console.log(error)
                        Notiflix.Notify.failure('Échec de la suppression de la matière');
                    }
                }
            );
        } catch (error) {
            Notiflix.Notify.failure('Une erreur est survenue');
        }
    }


    return (
        <>
            <div className="p-4 min-h-screen bg-white">
                {!loading ? (
                    <>
                        <div className="p-4 bg-gray-900 text-white shadow-md w-full rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                <div>
                                    <h3 className="text-xl font-semibold "><FontAwesomeIcon icon={faTag} className="mr-2" /> {classe.name}</h3>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        className="bg-green-700"
                                        onClick={() => {
                                            setEditingMatiere(null);
                                            setShowPopup(true);
                                        }}>
                                        Ajouter des matières
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {matieres.length > 0 ? (
                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-gray-800 my-4">Les matières dans cette classe</h3>
                                <hr />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {matieres?.map(matiere => (
                                        <MatiereCard
                                            key={matiere.id}
                                            matiere={matiere}
                                            onEdit={() => {
                                                setEditingMatiere(matiere);
                                                setShowPopup(false);
                                            }}
                                            onDelete={() => {
                                                onRemoveClass(id, matiere.id, matiere.name);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                title="Aucune matière trouvée dans cette classe"
                                description="Commencez par ajouter des matières"
                            />
                        )}

                        <Modal
                            isOpen={editingMatiere}
                            setIsOpen={() => setEditingMatiere(null)}
                            title={editingMatiere ? 'Modifier matière' : 'Nouvelle matière'}
                        >
                            <MatieresForm
                                initialData={editingMatiere || {}}
                                onSubmit={async (data) => {
                                    const formData = {
                                        name: data.name,
                                        coefficient: data.coefficient,
                                        classes: [
                                            {
                                                id: classe.id,
                                                coefficient: data.coefficient,
                                            },
                                        ],
                                    };

                                    if (editingMatiere) {
                                        await SubjectsApi.update(editingMatiere.id, formData);
                                    } else {
                                        await SubjectsApi.create(formData);
                                    }

                                    loadClasse();
                                    setEditingMatiere(null);
                                }}
                                onCancel={() => setEditingMatiere(null)}
                            />
                        </Modal>

                        <Modal
                            isOpen={showPopup}
                            setIsOpen={() => setShowPopup(false)}
                            title={isCreate ? 'Ajouter une nouvelle matière' : 'Selectionner une matière'}
                        >
                            <CreateOrSelectMatiere classe={classe} setShowPopup={setShowPopup} loadClasse={loadClasse} isCreate={isCreate} setIsCreate={setIsCreate} />
                        </Modal>
                    </>
                ) : (
                    <div className="flex justify-center w-full py-8">
                        <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}
            </div>
        </>
    )
}