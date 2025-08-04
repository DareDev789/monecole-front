import { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../../Components/ui/Input';
import Button from '../../Components/ui/Button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../Components/ui/dialog';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    enrollment_id: '',
    type: '',
    amount: '',
    month_paid: '',
    payment_date: '',
    payment_method: '',
    note: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const tokenString = localStorage.getItem("token");
  let token = JSON.parse(tokenString);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPayments = async () => {
    const res = await axios.get('/api/payments', { headers });
    setPayments(res.data.data || []);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/payments/${editingId}`, form, { headers });
    } else {
      await axios.post('/api/payments', form, { headers });
    }
    fetchPayments();
    resetForm();
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditingId(p.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce paiement ?')) {
      await axios.delete(`/api/payments/${id}`, { headers });
      fetchPayments();
    }
  };

  const resetForm = () => {
    setForm({
      enrollment_id: '',
      type: '',
      amount: '',
      month_paid: '',
      payment_date: '',
      payment_method: '',
      note: '',
    });
    setEditingId(null);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Paiements</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={resetForm}>
              Ajouter
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editingId ? 'Modifier' : 'Nouveau paiement'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input name="enrollment_id" placeholder="ID inscription" value={form.enrollment_id} onChange={handleChange} required />
              <Input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
              <Input name="amount" type="number" placeholder="Montant" value={form.amount} onChange={handleChange} required />
              <Input name="month_paid" type="number" min="1" max="12" placeholder="Mois payé (1-12)" value={form.month_paid} onChange={handleChange} required />
              <Input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} required />
              <Input name="payment_method" placeholder="Méthode" value={form.payment_method} onChange={handleChange} required />
              <Input name="note" placeholder="Note (optionnelle)" value={form.note} onChange={handleChange} />
              <Button type="submit">{editingId ? 'Mettre à jour' : 'Créer'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full text-left border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Étudiant</th>
            <th className="p-2">Classe</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Mois</th>
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.enrollment?.student?.first_name} {p.enrollment?.student?.last_name}</td>
              <td className="p-2">{p.enrollment?.class?.name}</td>
              <td className="p-2">{p.amount}</td>
              <td className="p-2">{p.month_paid}</td>
              <td className="p-2">{p.payment_date}</td>
              <td className="p-2">{p.type}</td>
              <td className="p-2 space-x-2">
                <Button size="sm" onClick={() => handleEdit(p)}>Modifier</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
