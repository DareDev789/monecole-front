import { useEffect, useState } from "react";
import MatieresForm from "./MatieresForm";
import MatieresList from "./MatieresList";
import { SubjectsApi } from '../../services/api'
import nProgress from "nprogress";
import Pagination from '../../Components/ui/Pagination';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from "../../Components/ui/Modal";
import Notiflix from "notiflix";

export default function MatieresManager() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [subjects, setSubject] = useState([]);

    const [loading, setLoading] = useState(true);
    const { page } = useParams();
    const navigate = useNavigate();
    const currentPage = parseInt(page) || 1;

    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
    });

    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setShowMap(true);
    };

    const fetchSubjects = async (currentPage) => {
        try {
            nProgress.start();
            setLoading(true);
            const res = await SubjectsApi.getAll(currentPage);
            setSubject(res.data.data || []);
            setPagination({
                total: res.data.total,
                per_page: res.data.per_page,
                current_page: res.data.current_page,
            });
        } catch (err) {
            console.error("Erreur lors du chargement des classes :", err);
        } finally {
            nProgress.done();
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleDelete = async (id) => {
        try {
            Notiflix.Confirm.show(
                'Supprimer la matière',
                `Voulez-vous vraiment supprimer cette matière ?`,
                'Oui, Supprimer',
                'Annuler',
                async () => {
                    try {
                        nProgress.start();
                        await SubjectsApi.delete(id);
                        Notiflix.Notify.success('matière supprimée avec succès');
                        fetchSubjects();
                    } catch (error) {
                        console.log(error)
                        Notiflix.Notify.failure('Échec de la suppression de la matière');
                    } finally {
                        nProgress.done();
                    }
                }
            );
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const NewSubject = () => {
        setSelectedSubject(null);
        setShowMap(true);
    }

    const closePopup = () => {
        setSelectedSubject(null);
        setShowMap(false);
    }

    const handlePageChange = (newPage) => {
        navigate(`/matieres/page/${newPage}`);
    };


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
                    <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">
                        <MatieresList key={refreshKey} onEdit={handleEdit} handleDelete={handleDelete} NewSubject={NewSubject} subjects={subjects} fetchSubjects={fetchSubjects} />
                        {pagination.total > pagination.per_page && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={pagination.current_page}
                                    totalPages={Math.ceil(pagination.total / pagination.per_page)}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                        <Modal isOpen={showMap}
                            setIsOpen={() => closePopup()}
                            title={selectedSubject ? "Modifier la matière" : "Ajouter une matière"}>
                            <MatieresForm
                                initialData={selectedSubject || {}}
                                onSubmit={async (data) => {
                                    const formData = {
                                        name: data.name,
                                        coefficient: data.coefficient,
                                        classes: [],
                                    };

                                    if (selectedSubject) {
                                        await SubjectsApi.update(selectedSubject.id, formData);
                                    } else {
                                        await SubjectsApi.create(formData);
                                    }

                                    fetchSubjects();
                                    closePopup();
                                }}
                                onCancel={() => closePopup()} />
                        </Modal>
                    </div>
                </>
            )}
        </>
    )
}