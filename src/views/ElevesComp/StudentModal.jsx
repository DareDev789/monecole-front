import { useStudent } from "../../Contextes/StudentContext";
import Modal from "../../Components/ui/Modal";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faEnvelope,
    faPhone,
    faUser,
    faMapMarkerAlt,
    faPrint,
    faPlus,
    faTrash,
    faSave
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { studentApi } from "../../services/api";
import PrintCertificat from './PrintCertificat';
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Button from "../../Components/ui/Button";

export default function StudentModal() {
    const { selectedStudent, setSelectedStudent } = useStudent();
    console.log(selectedStudent);
    const [metas, setMetas] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showModalCert, setShowModalCert] = useState(false);
    const [showModalAtt, setShowModalAtt] = useState(false);

    useEffect(() => {
        if (selectedStudent) {
            setMetas(selectedStudent.meta || []);
            setIsDirty(false);
        }
    }, [selectedStudent]);

    if (!selectedStudent) return null;

    const addMeta = () => {
        const hasEmpty = metas.some(m => !m.key.trim() || !m.value.trim());
        if (hasEmpty) {
            alert("Veuillez remplir toutes les informations avant d'ajouter une nouvelle.");
            return;
        }
        setMetas([...metas, { key: "", value: "" }]);
        setIsDirty(true);
    };

    // ✏️ Modifier une meta
    const updateMeta = (index, field, value) => {
        const updated = [...metas];
        updated[index][field] = value;
        setMetas(updated);
        setIsDirty(true);
    };

    // 🗑️ Supprimer une meta
    const removeMeta = (index) => {
        const updated = [...metas];
        updated.splice(index, 1);
        setMetas(updated);
        setIsDirty(true);
    };

    const saveMetas = async () => {
        const updatedStudent = {
            ...selectedStudent,
            meta: metas,
        };

        setSelectedStudent(updatedStudent);
        console.log(updatedStudent);
        await studentApi.update(selectedStudent.id, updatedStudent);
        console.log("Metas sauvegardées :", metas);
        alert("Informations mises à jour !");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Modal
                isOpen={!!selectedStudent}
                setIsOpen={() => {setSelectedStudent(null); setShowModalCert(false);}}
                title="Dossier étudiant"
                width="max-w-3xl"
            >
                {selectedStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300"
                    >
                        <div className="px-5 py-6">
                            {/* Avatar + Nom */}
                            <div className="flex items-center space-x-4">
                                {selectedStudent.photo ? (
                                    <img
                                        src={selectedStudent.photo}
                                        alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                                        className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="h-7 w-7 text-gray-500" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {selectedStudent.first_name} {selectedStudent.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Né(e) le {new Date(selectedStudent.birth_date).toLocaleDateString()} •{" "}
                                        {selectedStudent.gender === "male" ? "M" : "F"}
                                    </p>
                                </div>
                            </div>

                            {/* Infos principales */}
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faPhone} className="mr-2 h-4 w-4 text-gray-400" />
                                    {selectedStudent.parent_phone || "Non renseigné"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 h-4 w-4 text-gray-400" />
                                    {selectedStudent.parent_name || "Tuteur non renseigné"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 h-4 w-4 text-gray-400" />
                                    {selectedStudent.address || "Adresse non renseignée"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4 text-gray-400" />
                                    Inscrit le {new Date(selectedStudent.enrollment_date).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Section META (infos personnalisées) */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                    Informations complémentaires
                                </h4>
                                <div className="space-y-2">
                                    {metas.map((meta, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Clé"
                                                value={meta.key}
                                                onChange={(e) => updateMeta(index, "key", e.target.value)}
                                                className="w-1/3 rounded border px-2 py-1 text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Valeur"
                                                value={meta.value}
                                                onChange={(e) => updateMeta(index, "value", e.target.value)}
                                                className="w-2/3 rounded border px-2 py-1 text-sm"
                                            />
                                            <button
                                                onClick={() => removeMeta(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={addMeta}
                                    className="mt-3 flex items-center text-sm text-blue-600 hover:underline"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-1 h-4 w-4" />
                                    Ajouter une information
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                {isDirty && (
                                    <button
                                        onClick={saveMetas}
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                                        Mettre à jour
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModalCert(true)}
                                    className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} className="h-4 w-4" />
                                    Imprimer certificat de scolarité
                                </button>

                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPrint} className="h-4 w-4" />
                                    Imprimer attestation de radiation
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </Modal>

            {showModalCert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 p-6 relative">
                        <h2 className="text-xl font-bold mb-4">Aperçu PDF</h2>

                        <div className="h-[70vh] border rounded">
                            <PDFViewer width="100%" height="100%">
                                <PrintCertificat student={selectedStudent} />
                            </PDFViewer>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button className="bg-gray-500" onClick={() => {setSelectedStudent(selectedStudent); setShowModalCert(false);}}>
                                Fermer
                            </Button>
                            <PDFDownloadLink
                                document={<PrintCertificat student={selectedStudent} />}
                                fileName={`Certificat_scolarite_${selectedStudent.first_name}_${selectedStudent.last_name}.pdf`}
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
        </>
    );
}
