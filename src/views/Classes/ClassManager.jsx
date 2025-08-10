import { useState, useEffect } from 'react';
import { classApi } from '../../services/api';
import ClassList from './ClassesList';
import ClassForm from './ClassesForm';
import Modal from '../../Components/ui/Modal';
import Button from '../../Components/ui/Button';


export default function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await classApi.getAll({ with: 'subjects' });
      setClasses(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center w-full py-8">
          <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Classes</h2>
            <Button onClick={() => {
              setEditingClass(null);
              setIsFormOpen(true);
            }} className='bg-gray-700 hover:bg-gray-900'>
              Créer une Classe
            </Button>
          </div>

          <ClassList
            classes={classes}
            loading={loading}
            onEdit={(classItem) => {
              setEditingClass(classItem);
              setIsFormOpen(true);
            }}
            loadClasses={loadClasses}
          />

          <Modal
            isOpen={isFormOpen}
            setIsOpen={() => setIsFormOpen(false)}
            title={editingClass ? 'Modifier Classe' : 'Nouvelle Classe'}
          >
            <ClassForm
              initialData={editingClass || {}}
              onSubmit={async (data) => {
                if (editingClass) {
                  await classApi.update(editingClass.id, data);
                } else {
                  await classApi.create(data);
                }
                loadClasses();
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </Modal>
        </div>
      )}
    </>
  );
}