import { useState } from "react";
import { motion } from "framer-motion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import EmptyState from "../../Components/ui/EmptyState";
import Modal from "../../Components/ui/Modal";
import ClassBulletinsPDF from "./BulletinPDF";
import { GradeApi } from "../../services/api";
import Notiflix from "notiflix";
import PrintBulletinsPDF from "./PrintBulletinsPDF";
import { pdf } from "@react-pdf/renderer";
import nProgress from "nprogress";

export default function StudentTable({ students, openModal, selectedClass, selectedTerm }) {

    const sortedStudents = [...students].sort((a, b) => {
        const getName = (s) =>
            `${s.student?.first_name || s.first_name || ""} ${s.student?.last_name || s.last_name || ""}`.toLowerCase();
        return getName(a).localeCompare(getName(b));
    });

    const hasAnyAverage = students.some(s => Number(s?.average) > 0);

    /* 🔥 STATES LOCAUX */
    const [modalOpen, setModalOpen] = useState(false);
    const [bulletinData, setBulletinData] = useState(null);
    const [annee_scolaire, setAnnee_scolaire] = useState('');
    const [loadingBulletins, setLoadingBulletins] = useState(false);

    /* 🔥 FETCH BACKEND */
    const onPrintBulletins = async () => {
        try {
            setLoadingBulletins(true);
            const data = {
                class_id: selectedClass,
                term_id: selectedTerm,
            };
            const res = await GradeApi.getClassBulletins(data);
            setBulletinData(res?.data || []);
            setModalOpen(true);
        } catch (e) {
            console.error(e);
            Notiflix.Notify.failure("Erreur lors du chargement des bulletins");
        } finally {
            setLoadingBulletins(false);
        }
    };

    const handleBulletins = async () => {
        nProgress.start();
        const blob = await pdf(
            <PrintBulletinsPDF students={bulletinData.students}
                className={bulletinData.class_name}
                termName={bulletinData.term_name}
                annee_scolaire={bulletinData?.annee_scolaire || ''}
                birth={bulletinData?.birth || ''}
                 />
        ).toBlob();
        nProgress.done();

        const url = URL.createObjectURL(blob);
        const win = window.open(url);
        win.onload = () => {
            win.print();
        };
    };

    return (
        <motion.div
            className="overflow-x-auto shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* MODAL BULLETINS */}
            <Modal
                isOpen={modalOpen}
                setIsOpen={() => { setModalOpen(false); setBulletinData(null); setLoadingBulletins(false) }}
                title="Bulletins de notes"
            >
                <div className="w-full max-h-[75vh] p-2 relative overflow-auto">
                    {bulletinData && (
                        <ClassBulletinsPDF
                            students={bulletinData.students}
                            className={bulletinData.class_name}
                            termName={bulletinData.term_name}
                        />
                    )}
                </div>
                <button
                    onClick={handleBulletins}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg shadow"
                >
                    Imprimer
                </button>
            </Modal>

            {/* BOUTON IMPRESSION */}
            {hasAnyAverage && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onPrintBulletins}
                        disabled={loadingBulletins}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                        {loadingBulletins
                            ? "Chargement..."
                            : "Imprimer les bulletins"}
                    </button>
                </div>
            )}

            {/* TABLEAU */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-blue-50">
                        <th className="px-6 py-3 text-left">Nom</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.length === 0 ? (
                        <tr>
                            <td colSpan="2" className="py-6">
                                <EmptyState
                                    title="Aucun étudiant trouvé"
                                    description="Commencez par ajouter un nouvel étudiant"
                                />
                            </td>
                        </tr>
                    ) : (
                        sortedStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3">
                                    {s.student?.first_name || s.first_name}{" "}
                                    {s.student?.last_name || s.last_name}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() => openModal(s)}
                                        className={`${s?.average ? "bg-green-500" : "bg-gray-600"
                                            } px-4 py-2 text-white rounded`}
                                    >
                                        <PencilSquareIcon className="w-4 h-4 inline" />
                                        Notes {s?.average && `| Moy: ${s.average}`}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </motion.div>
    );
}
