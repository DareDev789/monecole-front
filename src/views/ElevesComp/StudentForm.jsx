import { useForm } from 'react-hook-form';
import Input from '../../Components/ui/Input';
import FileUpload from '../../components/ui/FileUpload';
import Button from '../../Components/ui/Button';

export default function StudentForm({ initialData, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          name="first_name"
          register={register}
          required
          error={errors.first_name}
        />
        <Input
          label="Nom"
          name="last_name"
          register={register}
          required
          error={errors.last_name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Date de Naissance"
          name="birth_date"
          type="date"
          register={register}
          required
          error={errors.birth_date}
        />
        <Input
          label="Genre"
          name="gender"
          as="select"
          register={register}
          options={[
            { value: 'male', label: 'Masculin' },
            { value: 'female', label: 'Féminin' }
          ]}
        />
        <Input
          label="Date d'Inscription"
          name="enrollment_date"
          type="date"
          register={register}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Parent/Tuteur"
          name="parent_name"
          register={register}
        />
        <Input
          label="Téléphone du Parent"
          name="parent_phone"
          register={register}
        />
      </div>

      <Input
        label="Adresse"
        name="address"
        as="textarea"
        register={register}
        rows={3}
      />

      <FileUpload
        label="Photo"
        name="photo"
        register={register}
        accept="image/*"
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