import { useEffect, useState } from 'react';
import { PaiementApi } from '../../services/api';
import Input from '../../Components/ui/Input';
import Button from '../../Components/ui/Button';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ student_id: '', class_id: '', month: '' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchPayments = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page: pageNumber };
      const res = await PaiementApi.getAll(params);
      setPayments(res.data.data || []);
      setPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      alert('Erreur lors de la récupération des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    fetchPayments(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      fetchPayments(newPage);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, []);

  return (
    <div className="p-6 mx-auto">
      <form className="flex space-x-4 mb-4" onSubmit={handleSubmitFilter}>
        <Input
          label="Filtrer par élève (ID)"
          name="student_id"
          value={filters.student_id}
          onChange={handleFilterChange}
        />
        <Input
          label="Filtrer par classe (ID)"
          name="class_id"
          value={filters.class_id}
          onChange={handleFilterChange}
        />
        <Input
          label="Filtrer par mois (ex: 1-12)"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
        />
        <Button className='bg-gray-800 hover:bg-gray-700' type="submit">Rechercher</Button>
      </form>

      {loading ? (
        <div className="flex justify-center w-full py-8">
          <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <table className="w-full text-left border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Étudiant</th>
                <th className="p-2">Classe</th>
                <th className="p-2">Montant (Ariary)</th>
                <th className="p-2">Mois</th>
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">Aucun paiement trouvé.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.enrollment?.student?.first_name} {p.enrollment?.student?.last_name}</td>
                    <td className="p-2">{p.enrollment?.class?.name}</td>
                    <td className="p-2">{p.amount}</td>
                    <td className="p-2">{p.month_paid}</td>
                    <td className="p-2">{p.payment_date}</td>
                    <td className="p-2">{p.type === 'monthly_fee' ? "Ecolage" : "Droit d'inscription"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination simple */}
          <div className="mt-4 flex justify-center space-x-4">
            <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Précédent</Button>
            <span>Page {page} / {lastPage}</span>
            <Button disabled={page === lastPage} onClick={() => handlePageChange(page + 1)}>Suivant</Button>
          </div>
        </>
      )}
    </div>
  );
}
