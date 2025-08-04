import { useState, useEffect } from 'react';
import { studentApi, schoolYearApi } from '../../services/api';
import StudentList from './lists/StudentList';
import StudentForm from './forms/StudentForm';
import Modal from '../../Components/ui/Modal';
import Button from '../../Components/ui/Button';
import EnrollmentForm from './forms/EnrollmentForm';
import Notiflix from "notiflix";

export default function StudentManager() {
  // const { studentApi, schoolYearApi } = api();
  const [students, setStudents] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, currentYearRes] = await Promise.all([
        studentApi.getAll(),
        schoolYearApi.getCurrent()
      ]);
      setStudents(studentsRes.data.data);
      setCurrentYear(currentYearRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (student) => {
    setSelectedStudent(student);
    setIsEnrollFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
        <Button onClick={() => {
          setSelectedStudent(null);
          setIsFormOpen(true);
        }}>
          Ajouter un Étudiant
        </Button>
      </div>

      <StudentList
        students={students}
        loading={loading}
        currentYear={currentYear}
        onEdit={(student) => {
          setSelectedStudent(student);
          setIsFormOpen(true);
        }}
        onEnroll={handleEnroll}
      />

      <Modal
        isOpen={isFormOpen}
        setIsOpen={() => setIsFormOpen(false)}
        title={selectedStudent ? 'Modifier Étudiant' : 'Nouvel Étudiant'}
      >
        <StudentForm
          initialData={selectedStudent || {}}
          onSubmit={async (data) => {
            if (selectedStudent) {
              await studentApi.update(selectedStudent.id, data);
            } else {
              await studentApi.create(data);
            }
            loadData();
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEnrollFormOpen}
        setIsOpen={() => setIsEnrollFormOpen(false)}
        title={`Inscrire ${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
      >
        <EnrollmentForm
          student={selectedStudent}
          currentYear={currentYear}
          onSubmit={async (data) => {
            try {
              await schoolYearApi.enrollStudent(
                selectedStudent.id,
                data.class_id,
                data.registration_fee_paid
              );
              Notiflix.Notify.success("Inscription réussie !");
              loadData();
              setIsEnrollFormOpen(false);
            } catch (error) {
              console.error(error);
              if (error.response?.data?.message) {
                Notiflix.Notify.failure(error.response.data.message);
              } else if (error.response?.data?.errors) {
                // Affiche les erreurs de validation
                const messages = Object.values(error.response.data.errors)
                  .flat()
                  .join("\n");
                Notiflix.Notify.failure(messages);
              } else {
                Notiflix.Notify.failure("Une erreur s'est produite.");
              }
            }
          }}
          onCancel={() => setIsEnrollFormOpen(false)}
        />
      </Modal>
    </div>
  );
}