import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const MatieresForm = ({ selectedSubject, onSuccess, showMap, setShowMap, classes, subjects, setClasses }) => {
  const [name, setName] = useState("");
  const [coefficient, setCoefficient] = useState("");

  const { url } = useContext(UrlContext);
  const popupRef = useRef(null);

  useEffect(() => {
    if (selectedSubject) {
      setName(selectedSubject.name || "");
      setCoefficient(selectedSubject.coefficient || "");
    } else {
      setName("");
      setCoefficient("");
    }
  }, [selectedSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    nProgress.start();

    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      name,
      coefficient,
      classes,
    };

    try {
      if (selectedSubject) {
        await axios.put(`${url}subjects/${selectedSubject.id}`, payload, { headers });
      } else {
        await axios.post(`${url}subjects`, payload, { headers });
      }

      onSuccess();
      setShowMap(false);
    } catch (err) {
      console.error("Erreur lors de la soumission", err);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMap(false);
      }
    }

    if (showMap) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMap]);


  return (
    <>
      <div className="flex justify-end">
        <button className="bg-gray-800 px-4 py-1 rounded-md text-white font-semibold" onClick={() => setShowMap(true)}>
          Ajouter une matière
        </button>
      </div>
      {showMap && (
        <div>
          <div className="w-full h-screen fixed top-0 left-0 bg-black/80 backdrop-blur-lg z-[60]">
            <div ref={popupRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[95%] max-h-[90%] bg-white rounded-sm p-4 z-[65] cursor-pointer shadow-md overflow-y-auto">
              <div className="w-full text-right absolute top-2 right-2">
                <FontAwesomeIcon onClick={() => setShowMap(!showMap)} icon={faXmark} className="text-red-600 h-7 cursor-pointer" />
              </div>
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">{selectedSubject ? "Modifier une matière" : "Ajouter une matière"}</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Désignation</label>
                  <input type="text" className="border rounded p-2 w-full" value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                  <input className="border rounded p-2 w-full" type="number" step={0.5} value={coefficient} onChange={e => setCoefficient(e.target.value)} required />
                </div>


                <div className="mt-4 flex justify-end w-full">
                  <button type="submit" className="bg-gray-800 text-white px-4 w-64 py-2 rounded hover:bg-gray-900">
                    {selectedSubject ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatieresForm;
