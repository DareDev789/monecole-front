import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ReportCardManager() {
  const [reportCards, setReportCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    enrollment_id: "",
    term_id: "",
    average: "",
    rank: "",
    total_students: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get("/api/report-cards");
    setReportCards(res.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("/api/report-cards", form);
    fetchReports();
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Bulletins</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau bulletin</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Enrollment ID</Label>
                <Input name="enrollment_id" onChange={handleChange} />
              </div>
              <div>
                <Label>Term ID</Label>
                <Input name="term_id" onChange={handleChange} />
              </div>
              <div>
                <Label>Moyenne</Label>
                <Input name="average" onChange={handleChange} />
              </div>
              <div>
                <Label>Rang</Label>
                <Input name="rank" onChange={handleChange} />
              </div>
              <div>
                <Label>Total élèves</Label>
                <Input name="total_students" onChange={handleChange} />
              </div>
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Trimestre</TableHead>
            <TableHead>Moyenne</TableHead>
            <TableHead>Rang</TableHead>
            <TableHead>Effectif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportCards.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.enrollment.student?.name}</TableCell>
              <TableCell>{r.enrollment.class?.name}</TableCell>
              <TableCell>{r.term?.name}</TableCell>
              <TableCell>{r.average}</TableCell>
              <TableCell>{r.rank}</TableCell>
              <TableCell>{r.total_students}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
