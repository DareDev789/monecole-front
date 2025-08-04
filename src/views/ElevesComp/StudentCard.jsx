import Button from '../../Components/ui/Button';
import Badge from '../../Components/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

export default function StudentCard({ student, currentYear, onEdit, onEnroll }) {
  const isEnrolled = currentYear?.enrollments?.some(e => e.student_id === student.id);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
            <h3 className="text-lg font-medium">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(student.birth_date).toLocaleDateString()} • {student.gender === 'male' ? 'M' : 'F'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faPhone} className="flex-shrink-0 mr-2 h-4 w-4" />
            {student.parent_phone || 'Non renseigné'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faEnvelope} className="flex-shrink-0 mr-2 h-4 w-4" />
            {student.parent_name || 'Tuteur non renseigné'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendar} className="flex-shrink-0 mr-2 h-4 w-4" />
            Inscrit le {new Date(student.enrollment_date).toLocaleDateString()}
          </div>
        </div>

        {currentYear && (
          <div className="mt-4">
            <Badge 
              variant={isEnrolled ? 'success' : 'warning'}
              text={isEnrolled ? 'Inscrit cette année' : 'Non inscrit'}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-2">
        {currentYear && !isEnrolled && (
          <Button size="sm" onClick={onEnroll}>
            Inscrire
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Éditer
        </Button>
      </div>
    </div>
  );
}