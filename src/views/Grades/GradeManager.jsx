import { useState, useEffect } from "react";
import Notiflix from "notiflix";
import { classApi, studentApi, termsApi, SubjectsApi } from "../../services/api";
import Modal from "../../Components/ui/Modal";
import ChargeStudentComp from "./ChargeStudentComp";
import StudentTable from "./StudentTable";
import LoadingIndicator from "../../Components/ui/LoadingIndicator";
import GradeForm from "./GradeForm";

export default function GradeManager() {
    const [classes, setClasses] = useState([]);
    const [terms, setTerms] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grades, setGrades] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Charger classes et terms
    useEffect(() => {
        classApi.getAll().then(res => setClasses(res.data.data));
        termsApi.current().then(res => setTerms(res.data));
    }, []);

    const loadStudents = async () => {
        if (!selectedClass) return;
        setLoading(true);
        setStudents([]);
        await studentApi.currentStudentsClass(selectedClass).then(res => setStudents(res.data));
        setLoading(false);
    };

    const openModal = (student) => {
        setSelectedStudent(student);
        SubjectsApi.GetSubjectClass(selectedClass).then(res => {
            console.log(res.data);
            setSubjects(res.data);
            // Init notes
            const initialGrades = {};
            res.data.forEach(s => { initialGrades[s.id] = "" });
            setGrades(initialGrades);
            setModalOpen(true);
        });
    };

    const handleGradeChange = (subjectId, value) => {
        setGrades(prev => ({ ...prev, [subjectId]: value }));
    };

    const calculateAverage = () => {
        let total = 0, coefSum = 0;
        subjects.forEach(s => {
            const note = parseFloat(grades[s.id] || 0);
            total += note * s.coefficient;
            coefSum += s.coefficient;
        });
        return coefSum ? (total / coefSum).toFixed(2) : "-";
    };

    const saveGrades = () => {
        const payload = {
            grades: subjects.map(s => ({
                student_id: selectedStudent.id,
                class_id: selectedClass,
                subject_id: s.id,
                term_id: selectedTerm,
                grade: parseFloat(grades[s.id] || 0),
                coefficient: s.coefficient
            }))
        };

        api.post("/grades/bulk", payload)
            .then(() => {
                Notiflix.Notify.success("Notes enregistrées");
                setModalOpen(false);
            })
            .catch(() => Notiflix.Notify.failure("Erreur lors de l'enregistrement"));
    };

    return (
        <div>
            {/* Sélection Classe + Term */}
            <ChargeStudentComp
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                classes={classes}
                selectedTerm={selectedTerm}
                setSelectedTerm={setSelectedTerm}
                terms={terms}
                loadStudents={loadStudents} />
            {loading ? (
                <div className="flex justify-center w-full py-8">
                    <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <StudentTable
                    students={students}
                    openModal={openModal}
                />
            )}


            {/* Modal */}
            <Modal isOpen={modalOpen} setIsOpen={() => setModalOpen(false)} title={`Notes de ${selectedStudent?.first_name} ${selectedStudent?.last_name}`}>
                <GradeForm grades={grades}
                    handleGradeChange={handleGradeChange}
                    subjects={subjects}
                    calculateAverage={calculateAverage}
                    saveGrades={saveGrades} />
            </Modal>
        </div>
    );
}
