import { useState, useEffect } from 'react';
import { useApi } from '../../services/api'; 
import ClassList from './lists/ClassList';
import ClassForm from './forms/ClassForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ClassManager() {
  const { classApi } = useApi();
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
      setClasses(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Classes</h2>
        <Button onClick={() => {
          setEditingClass(null);
          setIsFormOpen(true);
        }}>
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
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
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
  );
}