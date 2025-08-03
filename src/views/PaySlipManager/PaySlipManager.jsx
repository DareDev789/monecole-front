import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export default function PaySlipManager() {
  const [paySlips, setPaySlips] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    month: "",
    year: "",
    base_salary: "",
    bonus: "",
    deduction: "",
    total_paid: "",
    payment_date: "",
    note: "",
  });

  useEffect(() => {
    fetchPaySlips();
  }, []);

  const fetchPaySlips = async () => {
    try {
      const res = await axios.get("/api/pay-slips");
      setPaySlips(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`/api/pay-slips/${editing.id}`, form);
      } else {
        await axios.post("/api/pay-slips", form);
      }
      setOpen(false);
      setEditing(null);
      fetchPaySlips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (paySlip) => {
    setForm({ ...paySlip });
    setEditing(paySlip);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce bulletin ?")) return;
    try {
      await axios.delete(`/api/pay-slips/${id}`);
      fetchPaySlips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bulletins de paie</h2>
        <Button onClick={() => setOpen(true)}>Ajouter</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Mois</TableHead>
            <TableHead>Année</TableHead>
            <TableHead>Total payé</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paySlips.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.employee?.name}</TableCell>
              <TableCell>{p.month}</TableCell>
              <TableCell>{p.year}</TableCell>
              <TableCell>{p.total_paid} €</TableCell>
              <TableCell>{p.payment_date}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier" : "Ajouter"} un bulletin de paie
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label>ID Employé</Label>
              <Input name="employee_id" value={form.employee_id} onChange={handleChange} />
            </div>
            <div>
              <Label>Mois</Label>
              <Input name="month" type="number" value={form.month} onChange={handleChange} />
            </div>
            <div>
              <Label>Année</Label>
              <Input name="year" type="number" value={form.year} onChange={handleChange} />
            </div>
            <div>
              <Label>Salaire de base</Label>
              <Input name="base_salary" type="number" value={form.base_salary} onChange={handleChange} />
            </div>
            <div>
              <Label>Bonus</Label>
              <Input name="bonus" type="number" value={form.bonus} onChange={handleChange} />
            </div>
            <div>
              <Label>Déduction</Label>
              <Input name="deduction" type="number" value={form.deduction} onChange={handleChange} />
            </div>
            <div>
              <Label>Total payé</Label>
              <Input name="total_paid" type="number" value={form.total_paid} onChange={handleChange} />
            </div>
            <div>
              <Label>Date de paiement</Label>
              <Input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label>Note</Label>
              <Input name="note" value={form.note || ""} onChange={handleChange} />
            </div>
          </div>

          <Button onClick={handleSubmit}>{editing ? "Mettre à jour" : "Créer"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
