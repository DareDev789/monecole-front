import Button from './Button';



export default function EmptyState({
  title = 'Aucun élément trouvé',
  description = 'Essayez de modifier vos critères de recherche ou de créer un nouvel élément',
  action
}) {

  return (
    <div className={"flex flex-col items-center justify-center p-8 text-center"}>
      
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>
      {action && (
        <div className="mt-6">
          <Button
            onClick={action}
            variant={color === 'danger' ? 'danger' : 'primary'}
            size="md"
          >
            {actionLabel}
          </Button>
        </div> 
      )}
    </div>
  );
}