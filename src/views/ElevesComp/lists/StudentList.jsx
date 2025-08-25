import StudentCard from '../StudentCard';
import EmptyState from '../../../Components/ui/EmptyState';
import LoadingIndicator from '../../../Components/ui/LoadingIndicator';

export default function StudentList({ students, loading, currentYear, onEdit, onEnroll, loadData }) {
  if (loading) return <LoadingIndicator />;
  if (students?.length === 0) {
    return (
      <EmptyState
        title="Aucun étudiant trouvé"
        description="Commencez par ajouter un nouvel étudiant"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-screen">
      {students?.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          currentYear={currentYear}
          onEdit={() => onEdit(student)}
          onEnroll={() => onEnroll(student)}
          loadData={loadData}
        />
      ))}
    </div>
  );
}