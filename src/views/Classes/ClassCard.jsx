import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function ClassCard({ classe, onEdit, handleDelete }) {
    return (
        <>
            <div key={classe.id} className="bg-white shadow rounded-2xl p-6 border hover:shadow-lg transition mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{classe.name}</h3>
                <p className="text-gray-500">Droit d'inscription : {classe.registration_fee} Ariary</p>
                <p className="text-gray-500">Ecolage : {classe.monthly_fee} Ariary</p>
                <p className="text-gray-500">Classe supérieure : {classe.next_class?.name || 'Aucune'}</p>
                <div className="mt-4">
                    <Link to={`/view-one-classe/${classe.id}`} className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">
                        Voir Détails
                    </Link>
                    <div className="mt-4">

                        <button
                            className="bg-gray-800 text-white rounded px-3 py-1 mx-1"
                            onClick={onEdit}
                        >
                            <FontAwesomeIcon icon={faEdit} /> Editer
                        </button>
                        <button
                            className="bg-red-500 text-white rounded px-3 py-1 mx-1"
                            onClick={handleDelete}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}