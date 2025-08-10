import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PaiementApi, studentApi } from "../../services/api";

export default function PaiementEcolage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Espèces");
  const [note, setNote] = useState("");

  const monthsList = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const handleSearch = async (q) => {
    setSearchTerm(q);
    if (q.length > 2) {
      const res = await studentApi.search(q);
      setResults(res.data);
    }
  };

  const selectStudent = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setAmount(enrollment.class.monthly_fee);
    setResults([]);
    setSearchTerm(`${enrollment.student.first_name} ${enrollment.student.last_name}`);
  };

  const handleSubmit = async () => {
    if (!selectedEnrollment) return alert("Veuillez sélectionner un élève.");
    if (!month) return alert("Veuillez sélectionner un mois.");
    if (!amount || amount <= 0) return alert("Veuillez entrer un montant valide.");

    const payload = {
      enrollment_id: selectedEnrollment.id,
      type: "monthly_fee",
      amount,
      month_paid: month,
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: paymentMethod,
      note
    };

    try {
      await PaiementApi.save(payload);
      alert("Paiement enregistré avec succès !");
      setSelectedEnrollment(null);
      setAmount("");
      setMonth("");
      setNote("");
      setSearchTerm("");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-bold mb-4">Paiement des écolages</h2>

      {/* Recherche élève */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher un élève..."
          className="border p-2 rounded w-full"
        />
        {results.length > 0 && (
          <div className="absolute top-full mt-1 bg-white border rounded shadow max-h-48 overflow-auto w-full z-10">
            {results.map((r) => (
              <div
                key={r.id}
                onClick={() => selectStudent(r)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {r.student.first_name} {r.student.last_name} - {r.class.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mois */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded w-full mt-4"
      >
        <option value="">-- Mois payé --</option>
        {monthsList.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* Montant */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant"
        className="border p-2 rounded w-full mt-4"
      />

      {/* Méthode de paiement */}
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border p-2 rounded w-full mt-4"
      >
        <option>Espèces</option>
        <option>Mobile Money</option>
        <option>Virement</option>
      </select>

      {/* Note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (facultatif)"
        className="border p-2 rounded w-full mt-4"
      />

      {/* Bouton enregistrer */}
      <motion.button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Enregistrer le paiement
      </motion.button>
    </motion.div>
  );
}
