import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import { Loader2, Trash2, Edit } from "lucide-react";

export default function AnnualReportManager() {
  const { url } = useContext(UrlContext);
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    enrollment_id: "",
    school_year_id: "",
    final_average: "",
    annual_rank: "",
    total_students: "",
  });
  const [editingReport, setEditingReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));
  const headers = { Authorization: `Bearer ${token}` };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}annual-reports`, { headers });
      setReports(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReport) {
        await axios.put(`${url}annual-reports/${editingReport.id}`, formData, { headers });
      } else {
        await axios.post(`${url}annual-reports`, formData, { headers });
      }
      setFormData({
        enrollment_id: "",
        school_year_id: "",
        final_average: "",
        annual_rank: "",
        total_students: "",
      });
      setEditingReport(null);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (report) => {
    setFormData({ ...report });
    setEditingReport(report);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${url}annual-reports/${id}`, { headers });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bulletins annuels</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 shadow rounded">
        {[
          ["enrollment_id", "ID Inscription"],
          ["school_year_id", "ID Année scolaire"],
          ["final_average", "Moyenne annuelle"],
          ["annual_rank", "Rang annuel"],
          ["total_students", "Total élèves"],
        ].map(([name, label]) => (
          <input
            key={name}
            name={name}
            value={formData[name]}
            onChange={handleInput}
            placeholder={label}
            className="border px-3 py-2 rounded"
            type={name.includes("average") ? "number" : "text"}
          />
        ))}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingReport ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Liste des bulletins</h3>
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
                  <th className="p-2 border">Année</th>
                  <th className="p-2 border">Moyenne</th>
                  <th className="p-2 border">Rang</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 border">{r.enrollment?.student?.first_name} {r.enrollment?.student?.last_name}</td>
                    <td className="p-2 border">{r.enrollment?.class?.name}</td>
                    <td className="p-2 border">{r.school_year?.name}</td>
                    <td className="p-2 border">{r.final_average}</td>
                    <td className="p-2 border">{r.annual_rank}</td>
                    <td className="p-2 border">{r.total_students}</td>
                    <td className="p-2 border flex gap-2 justify-center">
                      <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">
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
