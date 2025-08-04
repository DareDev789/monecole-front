// components/school/forms/EnrollmentForm.jsx
import { useEffect, useState } from 'react';
import { classApi } from '../../../services/api';
import Input from '../../../Components/ui/Input';
import Select from '../../../Components/ui/Select';
import Button from '../../../Components/ui/Button';
import LoadingIndicator from '../../../Components/ui/LoadingIndicator';
import { useForm, Controller } from 'react-hook-form';

export default function EnrollmentForm({ student, currentYear, onSubmit, onCancel }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            registration_fee_paid: false,
            class_id: selectedClass ? parseInt(selectedClass) : null,
        }
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await classApi.getAll();
                setClasses(response.data.data);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleClassChange = (classId) => {
        const selected = classes.find(c => c.id === parseInt(classId));
        setSelectedClass(selected);
    };

    if (loading) return <LoadingIndicator />;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Étudiant</h4>
                <p className="text-sm text-gray-500">
                    {student.first_name} {student.last_name}
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Année Scolaire</h4>
                <p className="text-sm text-gray-500">
                    {currentYear.name} ({new Date(currentYear.start_date).getFullYear()})
                </p>
            </div>
            <Controller
                name="class_id"
                control={control}
                rules={{ required: "La classe est requise" }}
                render={({ field, fieldState }) => (
                    <Select
                        label="Classe"
                        name={field.name}
                        value={field.value}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value); 
                            handleClassChange(value);
                        }}
                        options={[
                            { value: "", label: "Sélectionner une classe" },
                            ...classes.map((classItem) => ({
                                value: classItem.id,
                                label: classItem.name
                            }))
                        ]}
                        error={fieldState.error?.message}
                        required
                    />
                )}
            />


            <Controller
                name="registration_fee_paid"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="registration_fee_paid"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="registration_fee_paid" className="text-sm">
                            Frais d'inscription payés
                        </label>
                    </div>
                )}
            />


            {selectedClass && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600">Frais d'Inscription</p>
                        <p className="font-medium">
                            {selectedClass.registration_fee?.toLocaleString('fr-FR')} MGA
                        </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600">Frais Mensuels</p>
                        <p className="font-medium">
                            {selectedClass.monthly_fee?.toLocaleString('fr-FR')} MGA/mois
                        </p>
                    </div>
                </div>
            )}



            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit">
                    Enregistrer l'Inscription
                </Button>
            </div>
        </form>
    );
}