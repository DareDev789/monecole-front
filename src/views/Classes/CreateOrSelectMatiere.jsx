import { classApi, SubjectsApi } from '../../services/api';
import Button from "../../Components/ui/Button";
import { useEffect, useState } from 'react';
import MatieresForm from '../Matieres/MatieresForm';
import Select from '../../Components/ui/Select';


export default function CreateOrSelectMatiere({ classe, setShowPopup, loadClasse, isCreate, setIsCreate }) {
    const [matieres, setMatieres] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchMatiere = async () => {
        try {
            setLoading(true);
            const res = await SubjectsApi.getOutOfClass(classe.id);
            setMatieres(res.data || []);
        } catch (err) {
            console.error("Erreur lors du chargement de la classe :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatiere();
    }, []);

    const handleAddSubject = () => {
        const matiereChoisie = matieres.find(m => m.id === Number(selectedSubject));
        if (!matiereChoisie) return;

        saveSubject({
            id: matiereChoisie.id,
            name: matiereChoisie.name,
            coefficient: matiereChoisie.coefficient,
        });
        setSelectedSubject(null);
    };

    const saveSubject = async (data) => {
        setLoading(true);
        const formData = {
            name: data.name,
            coefficient: data.coefficient,
            classes: [
                {
                    id: classe.id,
                    coefficient: data.coefficient,
                },
            ],
        }
        await SubjectsApi.update(data.id, formData);
        await fetchMatiere();
        await loadClasse();
        setLoading(false);
    }

        return (
            <>
                <div className="flex items-center gap-2 my-4 justify-end">
                    <Button
                        className="bg-green-700"
                        onClick={() => setIsCreate(!isCreate)}>
                        {isCreate ? 'Choisir parmi les existantes' : 'Créer une nouvelle'}
                    </Button>
                </div>
                {isCreate ? (
                    <>
                        <MatieresForm
                            initialData={{}}
                            onSubmit={async (data) => {
                                const formData = {
                                    name: data.name,
                                    coefficient: data.coefficient,
                                    classes: [
                                        {
                                            id: classe.id,
                                            coefficient: data.coefficient,
                                        },
                                    ],
                                };

                                await SubjectsApi.create(formData);

                                loadClasse();
                                setShowPopup(false);
                            }}
                            onCancel={() => setShowPopup(false)}
                        />
                    </>
                ) : (
                    <>
                        {loading ? (
                            <div className="flex justify-center w-full py-8">
                                <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <Select
                                        label="Matières"
                                        name="subject"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        options={[
                                            { value: "", label: "Sélectionner une matière" },
                                            ...matieres.map((matiere) => ({
                                                value: matiere.id,
                                                label: matiere.name
                                            }))
                                        ]} />
                                    {selectedSubject && (
                                        <button className="mt-4 px-5 py-1 bg-gray-900 text-white"
                                            onClick={handleAddSubject}>{'>> '}Ajouter</button>
                                    )}
                                </div>
                            </>
                        )}
                    </>

                )}
            </>
        )
    }