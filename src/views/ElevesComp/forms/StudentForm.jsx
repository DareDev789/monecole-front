import { useForm, Controller } from 'react-hook-form';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import Select from '../../../Components/ui/Select';

export default function StudentForm({ initialData, onSubmit, onCancel }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  const genderOptions = [
    { value: '', label: '-- Choisir --' },
    { value: 'male', label: 'Masculin' },
    { value: 'female', label: 'Féminin' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="first_name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input label="Prénom" required {...field} />
          )}
        />
        <Controller
          name="last_name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input label="Nom" required {...field} />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="birth_date"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input label="Date de Naissance" type="date" required {...field} />
          )}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              label="Genre"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={genderOptions}
              required
            />
          )}
        />
        <Controller
          name="enrollment_date"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input label="Date d'inscription" type="date" {...field} />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="parent_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input label="Parent/Tuteur" {...field} />
          )}
        />
        <Controller
          name="parent_phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input label="Téléphone du Parent" {...field} />
          )}
        />
      </div>

      <Controller
        name="address"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input label="Adresse" {...field} />
        )}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
