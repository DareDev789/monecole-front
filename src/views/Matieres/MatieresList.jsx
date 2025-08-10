import EmptyState from "../../Components/ui/EmptyState";
import Button from "../../Components/ui/Button";
import SubjectCards from "./SubjectCards";
import Notiflix from "notiflix";
import { SubjectsApi } from "../../services/api";

const MatieresList = ({ onEdit, handleDelete, NewSubject, subjects, fetchSubjects }) => {
  const onRemoveClass = async (class_id, subject) => {
    const data = {
      class_id: parseInt(class_id), subject_id: subject.id
    }
    try {
      Notiflix.Confirm.show(
        'Supprimer l\'étudiant',
        `Voulez-vous vraiment retirer ${subject.name} de cette classe ?`,
        'Oui, Retirer',
        'Annuler',
        async () => {
          try {
            await SubjectsApi.retirer(data);
            Notiflix.Notify.success('matière supprimée avec succès');
            fetchSubjects();
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      Notiflix.Notify.failure('Une erreur est survenue');
    }
  }

  return (
    <>
      <div className="">
        <h2 className="font-bold text-2xl mb-3">Liste des matièrers</h2>
        <div className="flex items-end justify-end">
          <Button
            type="button"
            onClick={NewSubject}
            className="bg-gray-800 hover:bg-gray-900"
          >Ajouter une matière</Button>
        </div>

        {subjects?.length === 0 ? (
          <EmptyState
            title="Aucune matière trouvée"
            description={`Essayez d'ajouter vos nouvelle matière.`}
          />
        ) : (
          <SubjectCards
            subjects={subjects}
            onEdit={onEdit}
            onDelete={handleDelete}
            onRemoveClass={onRemoveClass}
          />
        )}
      </div>
    </>
  );
};

export default MatieresList;
