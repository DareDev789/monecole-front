import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TermForm from './TermForm';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const SchoolYearForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const [terms, setTerms] = useState(initialData.terms || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isCurrent = watch('is_current', initialData.is_current || false);

  useEffect(() => {
    if (initialData) {
      for (const key in initialData) {
        if (key !== 'terms') {
          setValue(key, initialData[key]);
        }
      }
      setTerms(initialData.terms || []);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = { ...data, terms };
      const result = await onSubmit(formData);

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitSuccess && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Année scolaire enregistrée avec succès
              </p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCircle} className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {typeof submitError === 'string' 
                  ? submitError 
                  : 'Une erreur est survenue lors de l\'enregistrement'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom de l'année scolaire
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Ce champ est requis' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="flex items-center pt-6">
          <input
            id="is_current"
            type="checkbox"
            {...register('is_current')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="is_current" className="ml-2 block text-sm text-gray-700">
            Année scolaire actuelle
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            id="start_date"
            type="date"
            {...register('start_date', { required: 'Ce champ est requis' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.start_date ? 'border-red-300' : ''
            }`}
          />
          {errors.start_date && (
            <p className="mt-2 text-sm text-red-600">{errors.start_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            id="end_date"
            type="date"
            {...register('end_date', { 
              required: 'Ce champ est requis',
              validate: value => 
                value > watch('start_date') || 'La date de fin doit être après la date de début'
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.end_date ? 'border-red-300' : ''
            }`}
          />
          {errors.end_date && (
            <p className="mt-2 text-sm text-red-600">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <TermForm terms={terms} onChange={setTerms} />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default SchoolYearForm;