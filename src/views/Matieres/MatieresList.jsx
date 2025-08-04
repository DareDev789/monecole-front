import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useSearchParams } from "react-router-dom";

const MatieresList = ({ onEdit, subjects, setSubject }) => {
  const [selected, setSelected] = useState([]);
  const { url } = useContext(UrlContext);

  const fetchSubjects = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      nProgress.start();
      const res = await axios.get(`${url}subjects`, { headers });
      setSubject(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des classes :", err);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      nProgress.start();
      await axios.delete(`${url}subjects/${id}`, { headers });
      fetchSubjects();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      nProgress.done();
    }
  };

  return (
    <>
      <div className="mt-6">
        <h2 className="font-bold text-xl mb-3">Liste des matièrers</h2>

        {subjects?.length === 0 ? (
          <p className="text-sm text-gray-700 text-center mt-6">
            <i>Aucune matière pour le moment !</i>
          </p>
        ) : (
          Array.isArray(subjects) && subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex justify-between items-center border p-2 mb-2"
            >
              <div className="text-sm">
                <Link to={`/view-one-matiere/${subject.id}`}>
                  <strong>{subject.name}</strong> <span className="text-gray-700 text-xs"> - Coef : {subject.coefficient}</span>
                </Link>
              </div>
              <div>
                <button
                  className="bg-gray-800 text-white rounded px-3 py-1 mx-1"
                  onClick={() => onEdit(subject)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="bg-red-500 text-white rounded px-3 py-1 mx-1"
                  onClick={() => handleDelete(subject.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MatieresList;
