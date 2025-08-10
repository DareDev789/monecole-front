import { useEffect, useState } from 'react';
import { PaiementApi, enrollmentsApi, classApi } from '../../services/api';
import Button from '../../Components/ui/Button';
import MyFilter from './MyFilter';
import Pagination from '../../Components/ui/Pagination';
import Modal from '../../Components/ui/Modal';
import PaiementEcolage from './PaiementEcolage';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ student_id: '', class_id: '', month: '' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

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

  const fetchStudentsAndClasses = async () => {
    try {
      const [resStudents, resClasses] = await Promise.all([
        enrollmentsApi.getAll({ noPagination: true }),
        classApi.getAll({ noPagination: true })
      ]);
      setStudents(resStudents.data || []);
      setClasses(resClasses.data.data || []);
    } catch (err) {
      console.error('Erreur chargement élèves/classes', err);
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
    fetchStudentsAndClasses();
    fetchPayments(page);
  }, []);

  return (
    <div className="p-6 mx-auto">
      <h2 className="block text-xl font-bold text-gray-700 mb-2" >Gestion des paiments</h2>
      <div className='flex justify-end mb-4'>
        <Button
          type="button"
          onClick={() => setShowPopup(true)}
          className="bg-gray-800 hover:bg-gray-900"
        >
          Ajouter un paiement
        </Button>
      </div>
      <form className="flex space-x-4 mb-4 items-end" onSubmit={handleSubmitFilter}>

        {/* Select élèves */}
        <MyFilter students={students}
          filters={filters}
          handleFilterChange={handleFilterChange} />

        {/* Select classes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" >Classe</label>
          <select
            name="class_id"
            value={filters.class_id}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Toutes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Select mois */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" >Mois</label>
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Tous</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Button className='bg-gray-800 hover:bg-gray-700' type="submit">Rechercher</Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center w-full py-8">
          <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <table className="w-full text-left border rounded my-4">
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
                    <td className="p-2">{months.find(m => m.value === p.month_paid)?.label || p.month_paid}</td>
                    <td className="p-2">{p.payment_date}</td>
                    <td className="p-2">{p.type === 'monthly_fee' ? "Ecolage" : "Droit d'inscription"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination currentPage={page}
            totalPages={lastPage}
            onPageChange={() => handlePageChange(page)} />

          <Modal isOpen={showPopup }
            setIsOpen={()=>setShowPopup(false)}
            title="Ajouter un paiement">
            <PaiementEcolage />
          </Modal>
        </>
      )}
    </div>
  );
}
