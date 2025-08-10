import { useState, useEffect } from 'react';
import { studentApi, schoolYearApi } from '../../services/api';
import StudentList from './lists/StudentList';
import StudentForm from './forms/StudentForm';
import Modal from '../../Components/ui/Modal';
import Button from '../../Components/ui/Button';
import EnrollmentForm from './forms/EnrollmentForm';
import Notiflix from "notiflix";
import Pagination from '../../Components/ui/Pagination';
import { useParams, useNavigate } from 'react-router-dom';

export default function StudentManager() {
  // const { studentApi, schoolYearApi } = api();
  const [students, setStudents] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
  });


  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const loadData = async (page) => {
    setLoading(true);
    try {
      const [studentsRes, currentYearRes] = await Promise.all([
        studentApi.getAll(page),
        schoolYearApi.getCurrent()
      ]);
      setStudents(studentsRes.data.data);
      setCurrentYear(currentYearRes.data);
      setPagination({
        total: studentsRes.data.total,
        per_page: studentsRes.data.per_page,
        current_page: studentsRes.data.current_page,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (student) => {
    setSelectedStudent(student);
    setIsEnrollFormOpen(true);
  };

  const handlePageChange = (newPage) => {
    navigate(`/gestion-eleves/page/${newPage}`);
  };


  return (
    <>
      {loading ? (
        <div className="flex justify-center w-full py-8">
          <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
            <Button onClick={() => {
              setSelectedStudent(null);
              setIsFormOpen(true);
            }} className='bg-gray-500 hover:bg-gray-600'>
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
            loadData={loadData}
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
          {pagination.total > pagination.per_page && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={Math.ceil(pagination.total / pagination.per_page)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}