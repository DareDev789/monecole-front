import { faCalendar, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const SchoolYearCard = ({ schoolYear, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {schoolYear.name}
            {schoolYear.is_current && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Actuelle
              </span>
            )}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendar} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            <p>
              Du {format(parseISO(schoolYear.start_date), 'PPP', { locale: fr })} au{' '}
              {format(parseISO(schoolYear.end_date), 'PPP', { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(schoolYear)}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon icon={faPencil} className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(schoolYear.id)}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Termes</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {schoolYear.terms && schoolYear.terms.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {schoolYear.terms.map((term) => (
                    <li key={term.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{term.name}</p>
                          <p className="text-sm text-gray-500">
                            {term.type} (ordre: {term.order})
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(parseISO(term.start_date), 'PP', { locale: fr })} -{' '}
                          {format(parseISO(term.end_date), 'PP', { locale: fr })}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun terme défini</p>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SchoolYearCard;