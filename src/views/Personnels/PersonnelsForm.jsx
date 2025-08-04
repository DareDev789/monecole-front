import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const PersonnelsForm = ({ selectedEmploye, onSuccess, showMap, setShowMap }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [hire_date, setHireDate] = useState("");

  const { url } = useContext(UrlContext);
  const popupRef = useRef(null);

  useEffect(() => {
    if (selectedEmploye) {
      setFirstName(selectedEmploye.first_name || "");
      setLastName(selectedEmploye.last_name || "");
      setEmail(selectedEmploye.email || "");
      setPhone(selectedEmploye.phone || "");
      setPosition(selectedEmploye.position || "");
      setSalary(selectedEmploye.salary || "");
      setHireDate(selectedEmploye.hire_date || "");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setSalary("");
      setHireDate("");
    }
  }, [selectedEmploye]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    nProgress.start();

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      first_name,
      last_name,
      email,
      phone,
      position,
      salary,
      hire_date,
    };

    try {
      if (selectedEmploye) {
        await axios.put(`${url}employees/${selectedEmploye.id}`, payload, { headers });
      } else {
        await axios.post(`${url}employees`, payload, { headers });
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
          Ajouter un employé
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
                <h2 className="text-2xl font-bold mb-6">{selectedEmploye ? "Modifier un employé" : "Ajouter un employé"}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input className="border rounded p-2 w-full" value={first_name} onChange={e => setFirstName(e.target.value)} required />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input className="border rounded p-2 w-full" value={last_name} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="border rounded p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input className="border rounded p-2 w-full" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                  <input className="border rounded p-2 w-full" value={position} onChange={e => setPosition(e.target.value)} required />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire (Ariary)</label>
                  <input type="number" className="border rounded p-2 w-full" value={salary} onChange={e => setSalary(e.target.value)} required />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                  <input type="date" className="border rounded p-2 w-full" value={hire_date} onChange={e => setHireDate(e.target.value)} required />
                </div>

                <div className="mt-4 flex justify-end w-full">
                  <button type="submit" className="bg-gray-800 text-white px-4 w-64 py-2 rounded hover:bg-gray-900">
                    {selectedEmploye ? "Mettre à jour" : "Créer"}
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

export default PersonnelsForm;
