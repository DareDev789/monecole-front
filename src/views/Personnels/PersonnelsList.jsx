import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import nProgress from "nprogress";
import Button from "../../Components/ui/Button";
import EmptyState from "../../Components/ui/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import PersonnalCard from "./PersonnalCard";
import Notiflix from "notiflix";
import { personnelsApi } from "../../services/api";

const PersonnelsList = ({ employes, onEdit, NewPersonnal, fetchEmployes }) => {
  const [selected, setSelected] = useState([]);

  const handleDelete = async (id) => {
    try {
      Notiflix.Confirm.show(
        'Supprimer l\'employé',
        `Voulez-vous vraiment supprimer cet employé ?`,
        'Oui, Supprimer',
        'Annuler',
        async () => {
          try {
            nProgress.start()
            await personnelsApi.delete(id);
            Notiflix.Notify.success('Employé supprimé avec succès');
            fetchEmployes();
          } catch (error) {
            console.log(error);
          } finally {
            nProgress.done();
          }
        }
      );
    } catch (error) {
      Notiflix.Notify.failure('Une erreur est survenue');
    }
  };

  const handleDeleteMany = async () => {
    const ids = selected;
    try {
      Notiflix.Confirm.show(
        'Supprimer l\'employé',
        `Voulez-vous vraiment supprimer les employés séléctionnés ?`,
        'Oui, Supprimer',
        'Annuler',
        async () => {
          try {
            nProgress.start()
            await personnelsApi.DeleteMany(ids);
            Notiflix.Notify.success('Employés supprimés avec succès');
            fetchEmployes();
          } catch (error) {
            console.log(error);
          } finally {
            nProgress.done();
          }
        }
      );
    } catch (error) {
      Notiflix.Notify.failure('Une erreur est survenue');
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="">
      <h2 className="font-bold text-2xl mb-3">Liste des employés</h2>
      <div className="flex items-end justify-end">
        <Button
          type="button"
          onClick={NewPersonnal}
          className="bg-gray-800 hover:bg-gray-900"
        >
          Ajouter un employé
        </Button>
      </div>

      {selected.length > 0 && (
        <button
          onClick={handleDeleteMany}
          className="bg-red-600 text-white px-4 py-1 text-sm rounded mb-4"
        >
          Supprimer {selected.length} sélectionné(s)
        </button>
      )}

      {employes?.length === 0 ? (
        <EmptyState
          title="Aucun employé trouvé"
          description={`Commencez par ajouter un emplyé.`}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {employes.map((employe) => (
              <PersonnalCard key={employe.id} employe={employe}
                selected={selected}
                toggleSelect={toggleSelect}
                onEdit={onEdit}
                handleDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};

export default PersonnelsList;
