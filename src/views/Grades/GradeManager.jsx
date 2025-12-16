import { useState, useEffect } from "react";
import Notiflix from "notiflix";
import { classApi, studentApi, termsApi, SubjectsApi, GradeApi } from "../../services/api";
import Modal from "../../Components/ui/Modal";
import ChargeStudentComp from "./ChargeStudentComp";
import StudentTable from "./StudentTable";
import LoadingIndicator from "../../Components/ui/LoadingIndicator";
import GradeForm from "./GradeForm";
import NProgress from "nprogress";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, termsRes] = await Promise.all([
                    classApi.getAll(),
                    termsApi.current(),
                ]);

                setClasses(Array.isArray(classesRes.data?.data) ? classesRes.data.data : []);
                setTerms(Array.isArray(termsRes.data) ? termsRes.data : []);

            } catch (error) {
                console.error("Erreur lors du chargement des classes ou termes :", error);

                setClasses([]);
                setTerms([]);
            }
        };

        fetchData();
    }, []);


    const loadStudents = async () => {
        if (!selectedClass) return;
        setLoading(true);
        setStudents([]);
        const data = {
            selectedClass,
            selectedTerm
        }
        await studentApi.currentStudentsClassWithTerms(data).then(res => setStudents(res.data));
        setLoading(false);
    };

    const openModal = async (student) => {
        try {
            setSelectedStudent(student);
            NProgress.start();

            const data = {
                student_id: student.id,
                selectedClass: selectedClass,
                selectedTerm: selectedTerm,
            };

            const res = await SubjectsApi.GetSujectNotesByClassAndTerm(data);

            setSubjects(res.data);

            const initialGrades = {};
            res.data.forEach(subject => {
                initialGrades[subject.id] = subject.grade ?? "";
            });
            setGrades(initialGrades);

            setModalOpen(true);
        } catch (error) {
            console.error("Erreur lors de l'ouverture du modal:", error);
        } finally {
            NProgress.done();
        }
    };


    const handleGradeChange = (subjectId, value) => {
        setGrades(prev => ({ ...prev, [subjectId]: value }));
    };

    const calculateAverage = () => {
        let total = 0, coefSum = 0;

        subjects.forEach(s => {
            const note = parseFloat(grades[s.id]);
            if (!isNaN(note) && note > 0) {
                total += note * s.coefficient;
                coefSum += s.coefficient;
            }
        });

        return coefSum ? (total / coefSum).toFixed(2) : "-";
    };


    const saveGrades = async() => {
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

        GradeApi.bulk(payload)
            .then(() => {
                Notiflix.Notify.success("Notes enregistrées");
                loadStudents();
                setModalOpen(false);
            })
            .catch((e) => {
                console.log(e);
                Notiflix.Notify.failure("Erreur lors de l'enregistrement")
            });
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
                    selectedClass={selectedClass}
                    selectedTerm={selectedTerm}
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
