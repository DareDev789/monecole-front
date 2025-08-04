import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import { Loader2, Trash2, Edit, Save } from "lucide-react";

export default function GradeManager() {
    const { url } = useContext(UrlContext);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        student_id: "",
        class_id: "",
        subject_id: "",
        school_year_id: "",
        term_id: "",
        grade: "",
        coefficient: "",
    });
    const [editingGrade, setEditingGrade] = useState(null);

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const headers = { Authorization: `Bearer ${token}` };

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${url}grades`, { headers });
            setGrades(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGrade) {
                await axios.put(`${url}grades/${editingGrade.id}`, formData, { headers });
            } else {
                await axios.post(`${url}grades`, formData, { headers });
            }
            setFormData({
                student_id: "",
                class_id: "",
                subject_id: "",
                school_year_id: "",
                term_id: "",
                grade: "",
                coefficient: "",
            });
            setEditingGrade(null);
            fetchGrades();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (grade) => {
        setFormData({ ...grade });
        setEditingGrade(grade);
    };

    const handleDelete = async (id) => {
        if (!confirm("Confirmer la suppression ?")) return;
        try {
            await axios.delete(`${url}grades/${id}`, { headers });
            fetchGrades();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestion des notes</h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4 bg-white p-4 shadow rounded-lg"
            >
                {[
                    ["student_id", "ID Étudiant"],
                    ["class_id", "ID Classe"],
                    ["subject_id", "ID Matière"],
                    ["school_year_id", "Année scolaire ID"],
                    ["term_id", "Trimestre ID"],
                    ["grade", "Note"],
                    ["coefficient", "Coefficient"],
                ].map(([name, label]) => (
                    <input
                        key={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleInput}
                        placeholder={label}
                        className="border px-3 py-2 rounded"
                        type={name === "grade" || name === "coefficient" ? "number" : "text"}
                        step={name === "grade" || name === "coefficient" ? 0.1 : undefined}
                    />
                ))}
                <button
                    type="submit"
                    className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {editingGrade ? "Mettre à jour" : "Ajouter"}
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Liste des notes</h3>
                {loading ? (
                    <div className="text-center py-6">
                        <Loader2 className="animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Élève</th>
                                    <th className="p-2 border">Classe</th>
                                    <th className="p-2 border">Matière</th>
                                    <th className="p-2 border">Année</th>
                                    <th className="p-2 border">Trimestre</th>
                                    <th className="p-2 border">Note</th>
                                    <th className="p-2 border">Coeff.</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((g) => (
                                    <tr key={g.id}>
                                        <td className="p-2 border">{g.student?.first_name} {g.student?.last_name}</td>
                                        <td className="p-2 border">{g.class?.name}</td>
                                        <td className="p-2 border">{g.subject?.name}</td>
                                        <td className="p-2 border">{g.school_year?.name}</td>
                                        <td className="p-2 border">{g.term?.name}</td>
                                        <td className="p-2 border">{g.grade}</td>
                                        <td className="p-2 border">{g.coefficient}</td>
                                        <td className="p-2 border flex gap-2 justify-center">
                                            <button onClick={() => handleEdit(g)} className="text-blue-600 hover:underline">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:underline">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
