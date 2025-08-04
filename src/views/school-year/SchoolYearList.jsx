import { useState } from 'react';
import SchoolYearCard from './SchoolYearCard';
import SchoolYearForm from './SchoolYearForm';
import Modal from '../../Components/ui/Modal';
import Button from '../../Components/ui/Button';

const SchoolYearList = ({ schoolYears, loading, error, onCreate, onUpdate, onDelete }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);

  const handleCreate = async (data) => {
    await onCreate(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data) => {
    await onUpdate(currentSchoolYear.id, data);
    setIsFormOpen(false);
    setCurrentSchoolYear(null);
  };

  const handleEdit = (schoolYear) => {
    setCurrentSchoolYear(schoolYear);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette année scolaire ?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Gestion des années scolaires
        </h2>
        <Button
          onClick={() => {
            setCurrentSchoolYear(null);
            setIsFormOpen(true);
          }}
        >
          Ajouter une année scolaire
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors du chargement des années scolaires
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {schoolYears?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune année scolaire trouvée</p>
            </div>
          ) : (
            schoolYears?.map((schoolYear) => (
              <SchoolYearCard
                key={schoolYear.id}
                schoolYear={schoolYear}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        setIsOpen={() => setIsFormOpen(false)}
        title={currentSchoolYear ? 'Modifier année scolaire' : 'Ajouter une année scolaire'} 
      >
        <SchoolYearForm
          initialData={currentSchoolYear || {}}
          onSubmit={currentSchoolYear ? handleUpdate : handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default SchoolYearList;