import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ClassesForm({ selectedClasse, onSuccess, showMap, setShowMap, classes, subjects }) {
    const [name, setName] = useState("");
    const [registration_fee, setRegistrationFee] = useState("");
    const [monthly_fee, setMonthlyFee] = useState("");
    const [next_class_id, setNextClassId] = useState(""); 
    

    const { url } = useContext(UrlContext);
    const popupRef = useRef(null);

    useEffect(() => {
        if (selectedClasse) {
            setName(selectedClasse.name || "");
            setRegistrationFee(selectedClasse.registration_fee || "");
            setMonthlyFee(selectedClasse.monthly_fee || "");
            setNextClassId(selectedClasse.next_class_id || "");
        } else {
            setName("");
            setRegistrationFee("");
            setMonthlyFee("");
            setNextClassId("");
        }
    }, [selectedClasse]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        nProgress.start();

        const token = JSON.parse(localStorage.getItem("token"));
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const payload = {
            name,
            registration_fee,
            monthly_fee,
            next_class_id,
            subjects,
        };

        try {
            if (selectedClasse) {
                await axios.put(`${url}classes/${selectedClasse.id}`, payload, { headers });
            } else {
                await axios.post(`${url}classes`, payload, { headers });
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
                    Ajouter une classe
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
                                <h2 className="text-2xl font-bold mb-6">{selectedClasse ? "Modifier un employé" : "Ajouter un employé"}</h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Désignation</label>
                                    <input type="text" className="border rounded p-2 w-full" value={name} onChange={e => setName(e.target.value)} required />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Droit d'inscription (Ariary)</label>
                                    <input className="border rounded p-2 w-full" value={registration_fee} onChange={e => setRegistrationFee(e.target.value)} required />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ecolage (Ariary)</label>
                                    <input className="border rounded p-2 w-full" value={monthly_fee} onChange={e => setMonthlyFee(e.target.value)} required />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Classe suivant</label>
                                    <select className="border rounded p-2 w-full" value={next_class_id} onChange={(e) => setNextClassId(e.target.value)}>
                                        <option value="">Choisir la classe supérieure</option>
                                        {Array.isArray(classes) && classes.map((classe) => (
                                        <option
                                            key={classe.id} value={classe.id}
                                            className="flex justify-between items-center border p-2 mb-2"
                                        >
                                            {classe.name}
                                        </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="mt-4 flex justify-end w-full">
                                    <button type="submit" className="bg-gray-800 text-white px-4 w-64 py-2 rounded hover:bg-gray-900">
                                        {selectedClasse ? "Mettre à jour" : "Créer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}