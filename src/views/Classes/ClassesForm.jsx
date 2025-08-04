// components/school/forms/ClassesForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../Components/ui/Input';
import Select from '../../Components/ui/Select';
import Button from '../../Components/ui/Button';
import LoadingIndicator from '../../Components/ui/LoadingIndicator';
import { classApi } from '../../services/api';

export default function ClassForm({ initialData = {}, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      registration_fee: '',
      monthly_fee: '',
      next_class_id: '',
      ...initialData,
    },
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classApi.getAll();
        setClasses(res.data.data.filter(c => c.id !== initialData?.id));
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [initialData?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nom de la classe"
        name="name"
        type="text"
        required
        value={watch('name')}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        label="Frais d'inscription"
        name="registration_fee"
        type="number"
        required
        value={watch('registration_fee')}
        onChange={handleChange}
        error={errors.registration_fee}
      />

      <Input
        label="Frais mensuels"
        name="monthly_fee"
        type="number"
        required
        value={watch('monthly_fee')}
        onChange={handleChange}
        error={errors.monthly_fee}
      />

      <Select
        label="Classe suivante (optionnel)"
        name="next_class_id"
        value={watch('next_class_id') || ''}
        onChange={handleChange}
        options={[
          { value: '', label: 'Aucune' },
          ...classes.map((c) => ({
            value: c.id,
            label: c.name,
          })),
        ]}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData?.id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
