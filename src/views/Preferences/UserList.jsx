import Notiflix from "notiflix";
import { usersApi } from "../../services/api";
import nProgress from "nprogress";
import { useEffect } from "react";
import EmptyState from "../../Components/ui/EmptyState";

export default function UserList({ selectedIds, loading, setSelectedIds, users, startEdit, fetchUsers, pagination, toggleSelect }) {

    const handleDeleteMany = () => {
        Notiflix.Confirm.show(
            "Suppression",
            `Voulez-vous supprimer <strong>${selectedIds.length}</strong> utilisateur(s) ?`,
            "Oui, supprimer",
            "Annuler",
            async () => {
                nProgress.start();
                try {
                    await usersApi.DeleteMany(selectedIds);
                    Notiflix.Notify.success("Utilisateurs supprimés");
                    setSelectedIds([]);
                    fetchUsers(pagination.current_page);
                } catch {
                    Notiflix.Notify.failure("Erreur lors de la suppression multiple");
                } finally {
                    nProgress.done();
                }
            }
        );
    };

    const handleDelete = (id) => {
        Notiflix.Confirm.show(
            "Suppression",
            "Voulez-vous vraiment supprimer cet utilisateur ?",
            "Oui, supprimer",
            "Annuler",
            async () => {
                nProgress.start();
                try {
                    await usersApi.delete(id);
                    Notiflix.Notify.success("Utilisateur supprimé");
                    fetchUsers(pagination.current_page);
                } catch {
                    Notiflix.Notify.failure("Erreur lors de la suppression");
                } finally {
                    nProgress.done();
                }
            }
        );
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md w-full transition-all duration-300">
            {selectedIds.length > 0 && (
                <button
                    className="mb-4 bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2 rounded-lg shadow-md animate-pulse"
                    onClick={handleDeleteMany}
                    disabled={loading}
                >
                    Supprimer {selectedIds.length} sélectionné(s)
                </button>
            )}

            {loading ? (
                <div className="flex justify-center w-full py-8">
                    <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : users.length === 0 ? (
                <EmptyState
                    title="Aucun utilisateur trouvé"
                    description={`Commencez par ajouter un utilisateur.`}
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                                <th className="p-3 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            e.target.checked
                                                ? setSelectedIds(users.map((u) => u.id))
                                                : setSelectedIds([])
                                        }
                                        checked={users.length > 0 && selectedIds.length === users.length}
                                    />
                                </th>
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Rôle</th>
                                <th className="p-3 text-center">Actif</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(u.id)}
                                            onChange={() => toggleSelect(u.id)}
                                        />
                                    </td>
                                    <td className="p-3 font-medium">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3 capitalize">{u.role}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {u.is_active ? "Oui" : "Non"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-3">
                                        <button
                                            onClick={() => startEdit(u)}
                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                            disabled={loading}
                                        >
                                            ✏ Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            disabled={loading}
                                        >
                                            🗑 Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
