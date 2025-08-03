import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const PersonnelsList = ({ onEdit }) => {
  const [employes, setEmployes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selected, setSelected] = useState([]);
  const { url } = useContext(UrlContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const fetchEmployes = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      nProgress.start();
      const res = await axios.get(`${url}employees?page=${page}`, { headers });
      setEmployes(res.data.data || []);
      setPagination(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des employés :", err);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    fetchEmployes();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet employé ?")) return;
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      nProgress.start();
      await axios.delete(`${url}employees/${id}`, { headers });
      fetchEmployes();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      nProgress.done();
    }
  };

  const handleDeleteMany = async () => {
    if (!window.confirm("Supprimer les employés sélectionnés ?")) return;
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      nProgress.start();
      await axios.post(`${url}employees/destroy-many`, { ids: selected }, { headers });
      setSelected([]);
      fetchEmployes();
    } catch (error) {
      console.error("Erreur lors de la suppression multiple :", error);
    } finally {
      nProgress.done();
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const goToPage = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl mb-3">Liste des employés</h2>

      {selected.length > 0 && (
        <button
          onClick={handleDeleteMany}
          className="bg-red-600 text-white px-4 py-1 text-sm rounded mb-4"
        >
          Supprimer {selected.length} sélectionné(s)
        </button>
      )}

      {employes?.length === 0 ? (
        <p className="text-sm text-gray-700 text-center mt-6">
          <i>Aucun employé pour le moment !</i>
        </p>
      ) : (
        Array.isArray(employes) && employes.map((employe) => (
          <div
            key={employe.id}
            className="flex justify-between items-center border p-2 mb-2"
          >
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(employe.id)}
                onChange={() => toggleSelect(employe.id)}
              />
              <strong>{employe.first_name} {employe.last_name}</strong>
              <p className="text-sm text-gray-600">{employe.position}</p>
            </div>
            <div>
              <button
                className="bg-gray-800 text-white rounded px-3 py-1 mx-1"
                onClick={() => onEdit(employe)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="bg-red-500 text-white rounded px-3 py-1 mx-1"
                onClick={() => handleDelete(employe.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        {pagination.current_page > 1 && (
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => goToPage(pagination.current_page - 1)}
          >
            Précédent
          </button>
        )}

        {Array.from({ length: pagination.last_page }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded ${
              pagination.current_page === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {pagination.current_page < pagination.last_page && (
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => goToPage(pagination.current_page + 1)}
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonnelsList;
