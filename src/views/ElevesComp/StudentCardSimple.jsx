import Button from '../../Components/ui/Button';
import Badge from '../../Components/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { enrollmentsApi } from '../../services/api';
import Notiflix from 'notiflix';
import { useStudent } from "../../Contextes/StudentContext";

export default function StudentCardSimple({ student, enrolledID, className }) {
  const { selectedStudent, setSelectedStudent, selectedClassName, setSelectedClassName } = useStudent();

  const onDelete = async (id) => {
    try {
      Notiflix.Confirm.show(
        'Retirer l\'étudiant de cette classe',
        `Voulez-vous vraiment retirer ${student.first_name} ${student.last_name} de cette classe ?`,
        'Oui, supprimer',
        'Annuler',
        async () => {
          try {
            await enrollmentsApi.delete(id);
            Notiflix.Notify.success('Étudiant supprimé avec succès');
            loadData();
          } catch (error) {
            Notiflix.Notify.failure('Échec de la suppression de l\'étudiant');
          }
        }
      );
    } catch (error) {
      Notiflix.Notify.failure('Une erreur est survenue');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-3">
          {student.photo ? (
            <img
              src={student.photo}
              alt={`${student.first_name} ${student.last_name}`}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium cursor-pointer"  onClick={()=> {setSelectedStudent(student); setSelectedClassName(className);}}>
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(student.birth_date).toLocaleDateString()} • {student.gender === 'male' ? 'M' : 'F'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-6 flex justify-end space-x-2">
        <Button className='bg-red-600' size="sm" variant="secondary" onClick={() => onDelete(enrolledID)}>
          Retirer
        </Button>
      </div>
    </div>
  );
}