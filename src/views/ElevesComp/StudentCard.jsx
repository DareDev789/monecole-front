import Button from '../../Components/ui/Button';
import Badge from '../../Components/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { studentApi } from '../../services/api';
import Notiflix from 'notiflix';
import { motion } from 'framer-motion';

export default function StudentCard({ student, currentYear, onEdit, onEnroll, loadData }) {
  const enrollment = currentYear?.enrollments?.find(e => e.student_id === student.id);
  const isEnrolled = !!enrollment;
  const classeName = enrollment?.class?.name;

  const onDelete = async (id) => {
    try {
      Notiflix.Confirm.show(
        'Supprimer l\'étudiant',
        `Voulez-vous vraiment supprimer ${student.first_name} ${student.last_name} ? Cette action est irréversible.`,
        'Oui, supprimer',
        'Annuler',
        async () => {
          try {
            await studentApi.delete(id);
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
    <motion.div
      key={student.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ translateY: -4, boxShadow: '0 10px 30px rgba(2,6,23,0.12)' }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300"
    >
      <div className="px-5 py-6">
        {/* Avatar + Nom */}
        <div className="flex items-center space-x-4">
          {student.photo ? (
            <img
              src={student.photo}
              alt={`${student.first_name} ${student.last_name}`}
              className="h-14 w-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(student.birth_date).toLocaleDateString()} • {student.gender === 'male' ? 'M' : 'F'}
            </p>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faPhone} className="mr-2 h-4 w-4 text-gray-400" />
            {student.parent_phone || 'Non renseigné'}
          </div>
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 h-4 w-4 text-gray-400" />
            {student.parent_name || 'Tuteur non renseigné'}
          </div>
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4 text-gray-400" />
            Inscrit le {new Date(student.enrollment_date).toLocaleDateString()}
          </div>
        </div>

        {/* Badge inscription */}
        {currentYear && (
          <div className="mt-5">
            <Badge
              variant={isEnrolled ? 'success' : 'warning'}
              text={
                isEnrolled
                  ? <>Inscrit cette année {classeName && `à ${classeName}`}</>
                  : 'Non inscrit'
              }
            />
          </div>
        )}
      </div>

      {/* Boutons */}
      <div className="bg-gray-50 px-5 py-4 flex flex-wrap justify-end gap-2 border-t border-gray-100">
        {currentYear && !isEnrolled && (
          <Button size="sm" onClick={onEnroll} className='bg-blue-400 hover:bg-blue-600'>
            Inscrire
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="secondary" onClick={onEdit} className='bg-gray-600 hover:bg-gray-800'>
            Éditer
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onDelete(student.id)}
          className="bg-red-500 hover:bg-red-600"
        >
          Supprimer
        </Button>
      </div>
    </motion.div>
  );
}
