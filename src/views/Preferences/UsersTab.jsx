import React, { useEffect, useState } from "react";
import nProgress from "nprogress";
import { usersApi } from '../../services/api';
import Notiflix from "notiflix";
import Pagination from "../../Components/ui/Pagination";
import UserList from "./UserList";
import Modal from "../../Components/ui/Modal";
import UserForm from "./UserForm";
import Button from "../../Components/ui/Button";

const initialFormState = {
    id: null,
    name: "",
    email: "",
    password: "",
    role: "teacher",
    is_active: true,
};

const roles = ['admin', 'staff', 'teacher', 'parent'];

export default function UsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [editing, setEditing] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
    });

    // Chargement de la liste d’utilisateurs
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await usersApi.getAll(page);
            setUsers(res.data.data || res.data);
            setPagination({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
            });
        } catch (err) {
            console.log("Erreur lors du chargement des utilisateurs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const resetForm = () => {
        setEditing(false);
        setForm(initialFormState);
        setShowMap(true);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const startEdit = (user) => {
        console.log(user);
        setForm({ ...user, password: "" });
        setShowMap(true);
        setEditing(true);
    };


    const handlePageChange = (newPage) => {
        fetchUsers(newPage)
    };

    const closePopup = () => {
        setEditing(false);
        setForm(initialFormState);
        setShowMap(false);
    }

    return (
        <div className="bg-white rounded shadow mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
                <Button onClick={() => {
                    setEditing(false);
                    setForm(initialFormState);
                    setShowMap(true);
                }} className='bg-gray-500 hover:bg-gray-600'>
                    Ajouter un utilisateur
                </Button>
            </div>

            <Modal isOpen={showMap}
                setIsOpen={() => closePopup()}
                title={editing ? "Modifier un utilisateur" : "Ajouter un utilisateur"}>
                <UserForm
                    form={form}
                    editing={editing}
                    handleChange={handleChange}
                    fetchUsers={fetchUsers}
                    resetForm={resetForm}
                    loading={loading}
                    roles={roles} />
            </Modal>

            <UserList
                selectedIds={selectedIds}
                loading={loading}
                setSelectedIds={setSelectedIds}
                users={users}
                startEdit={startEdit}
                toggleSelect={toggleSelect} />

            {pagination.total > pagination.per_page && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.current_page}
                        totalPages={Math.ceil(pagination.total / pagination.per_page)}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
