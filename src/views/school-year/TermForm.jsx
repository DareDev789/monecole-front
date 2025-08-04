import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const TermForm = ({ terms = [], onChange }) => {
  const [termList, setTermList] = useState(terms);

  const addTerm = () => {
    const newTerm = {
      name: '',
      order: termList.length + 1,
      type: 'semester',
      start_date: '',
      end_date: '',
    };
    setTermList([...termList, newTerm]);
    onChange([...termList, newTerm]);
  };

  const removeTerm = (index) => {
    const updatedTerms = termList.filter((_, i) => i !== index);
    setTermList(updatedTerms);
    onChange(updatedTerms);
  };

  const handleTermChange = (index, field, value) => {
    const updatedTerms = [...termList];
    updatedTerms[index][field] = value;
    setTermList(updatedTerms);
    onChange(updatedTerms);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Termes</h3>
        <button
          type="button"
          onClick={addTerm}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FontAwesomeIcon icon={faPlus} className="-ml-0.5 mr-1 h-4 w-4"/>
          Ajouter un terme
        </button>
      </div>

      {termList.length === 0 && (
        <p className="text-sm text-gray-500">Aucun terme défini</p>
      )}

      {termList.map((term, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Terme {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeTerm(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5"/>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                value={term.name}
                onChange={(e) =>
                  handleTermChange(index, 'name', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ordre
              </label>
              <input
                type="number"
                value={term.order}
                onChange={(e) =>
                  handleTermChange(index, 'order', parseInt(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={term.type}
                onChange={(e) =>
                  handleTermChange(index, 'type', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="semester">Semestre</option>
                <option value="trimester">Trimestre</option>
                <option value="quarter">Quarter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date de début
              </label>
              <input
                type="date"
                value={term.start_date}
                onChange={(e) =>
                  handleTermChange(index, 'start_date', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date de fin
              </label>
              <input
                type="date"
                value={term.end_date}
                onChange={(e) =>
                  handleTermChange(index, 'end_date', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TermForm;