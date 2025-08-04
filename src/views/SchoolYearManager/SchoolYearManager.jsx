import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";

export default function SchoolYearManager() {
    const [schoolYears, setSchoolYears] = useState([]);
    const [form, setForm] = useState({ name: '', start_date: '', end_date: '' });
    const [editingId, setEditingId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const token = JSON.parse(localStorage.getItem('token'));
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSchoolYears = async () => {
        const res = await axios.get('/api/school-years', { headers });
        setSchoolYears(res.data);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await axios.put(`/api/school-years/${editingId}`, form, { headers });
        } else {
            await axios.post('/api/school-years', form, { headers });
        }
        fetchSchoolYears();
        resetForm();
    };

    const handleEdit = (year) => {
        setForm({ name: year.name, start_date: year.start_date, end_date: year.end_date });
        setEditingId(year.id);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Supprimer cette année scolaire ?")) {
            await axios.delete(`/api/school-years/${id}`, { headers });
            fetchSchoolYears();
        }
    };

    const resetForm = () => {
        setForm({ name: '', start_date: '', end_date: '' });
        setEditingId(null);
        setIsOpen(false);
    };

    useEffect(() => {
        fetchSchoolYears();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Gestion des années scolaires</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>Ajouter</Button>
                    </DialogTrigger>
                    <DialogContent className="space-y-4">
                        <DialogTitle>{editingId ? "Modifier" : "Nouvelle année scolaire"}</DialogTitle>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
                            <Input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
                            <Input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
                            <Button type="submit">{editingId ? "Modifier" : "Créer"}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <table className="w-full text-left border rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Début</th>
                        <th className="p-2">Fin</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schoolYears.map((year) => (
                        <tr key={year.id} className="border-t">
                            <td className="p-2">{year.name}</td>
                            <td className="p-2">{year.start_date}</td>
                            <td className="p-2">{year.end_date}</td>
                            <td className="p-2 space-x-2">
                                <Button size="sm" onClick={() => handleEdit(year)}>Modifier</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(year.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
