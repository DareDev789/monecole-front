import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Notiflix from "notiflix";

export default function ElevesForm({ selectedEleves, handleSuccess, showMap, setShowMap, setSelectedEleves }) {
    const { url } = useContext(UrlContext);
    const popupRef = useRef(null);

    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        parent_name: "",
        parent_phone: "",
        address: "",
        photo: "",
        enrollment_date: "",
    });

    const [meta, setMeta] = useState([
        { key: "", value: "" }
    ]);

    useEffect(() => {
        if (selectedEleves) {
            setStudent({
                first_name: selectedEleves.first_name,
                last_name: selectedEleves.last_name,
                gender: selectedEleves.gender,
                birth_date: selectedEleves.birth_date,
                parent_name: selectedEleves.parent_name,
                parent_phone: selectedEleves.parent_phone,
                address: selectedEleves.address,
                photo: selectedEleves.photo,
                enrollment_date: selectedEleves.enrollment_date,
            });
            setMeta(selectedEleves.meta);
        } else {
            setStudent({
                first_name: "",
                last_name: "",
                gender: "",
                birth_date: "",
                parent_name: "",
                parent_phone: "",
                address: "",
                photo: "",
                enrollment_date: "",
            });
            setMeta([
                { key: "", value: "" }
            ]);
        }
    }, [selectedEleves]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleMetaChange = (index, field, value) => {
        const updated = [...meta];
        updated[index][field] = value;
        setMeta(updated);
    };

    const addMetaField = () => {
        setMeta([...meta, { key: "", value: "" }]);
    };

    const removeMetaField = (index) => {
        const updated = meta.filter((_, i) => i !== index);
        setMeta(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            nProgress.start();
            if (selectedEleves) {
                await axios.put(`${url}students/${selectedEleves.id}`, {
                    ...student,
                    meta: meta.filter(m => m.key.trim() !== "" && m.value.trim() !== "")
                }, { headers });
            } else {
                await axios.post(`${url}students`, {
                    ...student,
                    meta: meta.filter(m => m.key.trim() !== "" && m.value.trim() !== "")
                }, { headers });
            }
            Notiflix.Notify.success('Étudiant créé avec succès !');
            handleSuccess();
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            nProgress.done;
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowMap(false);
                setSelectedEleves(null);
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
                <button className="bg-gray-800 px-4 py-1 rounded-md text-white font-semibold" onClick={() => { setShowMap(true); setSelectedEleves(null); }}>
                    Ajouter un élève
                </button>
            </div>
            {showMap && (
                <div className="w-full h-screen fixed top-0 left-0 bg-black/80 backdrop-blur-lg z-[60]">
                    <div ref={popupRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[95%] max-h-[90%] bg-white rounded-sm p-4 z-[65] cursor-pointer shadow-md overflow-y-auto">
                        <div className="w-full text-right absolute top-2 right-2">
                            <FontAwesomeIcon onClick={() => setShowMap(!showMap)} icon={faXmark} className="text-red-600 h-7 cursor-pointer" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-bold mb-6">{selectedEleves ? "Modifier un élève" : "Ajouter un élève"}</h2>
                            <h4 className="font-semibold my-4">Informations générales</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                <div>
                                    <label className="text-sm font-semibold">Nom</label>
                                    <input className="w-full mt-1 border px-2 py-1" name="last_name" value={student.last_name} onChange={handleChange} placeholder="Nom" required />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Prénom</label>
                                    <input className="w-full mt-1 border px-2 py-1" name="first_name" value={student.first_name} onChange={handleChange} placeholder="Prénom" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                <div>
                                    <label className="text-sm font-semibold">Genre</label>
                                    <select className="w-full mt-1 border px-2 py-1" name="gender" value={student.gender} onChange={handleChange} required>
                                        <option value="">Choisir un genre</option>
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Date de naissance</label>
                                    <input className="w-full mt-1 border px-2 py-1" type="date" name="birth_date" value={student.birth_date} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                <div>
                                    <label className="text-sm font-semibold">Nom du parent</label>
                                    <input className="w-full mt-1 border px-2 py-1" name="parent_name" value={student.parent_name} onChange={handleChange} placeholder="Nom du parent" required />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Téléphone du parent</label>
                                    <input className="w-full mt-1 border px-2 py-1" type="text" name="parent_phone" value={student.parent_phone} onChange={handleChange} placeholder="Téléphone du parent" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                <div>
                                    <label className="text-sm font-semibold">Adresse</label>
                                    <input className="w-full mt-1 border px-2 py-1" name="address" value={student.address} onChange={handleChange} placeholder="Adresse" required />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Chez nous depuis</label>
                                    <input className="w-full mt-1 border px-2 py-1" type="date" name="enrollment_date" value={student.enrollment_date} onChange={handleChange} required />
                                </div>
                            </div>

                            <input name="photo" className="hidden" value={student.photo} onChange={handleChange} placeholder="Lien photo" />

                            <h4 className="font-semibold my-4">Informations supplémentaires</h4>
                            {meta.map((item, index) => (
                                <div className="w-full grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-1" key={index}>
                                    <div className="mt-1">
                                        <input
                                            className="w-full mt-1 border px-2 py-1"
                                            placeholder="Label"
                                            value={item.key}
                                            onChange={(e) => handleMetaChange(index, "key", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            className="w-full mt-1 border px-2 py-1"
                                            placeholder="Valeur"
                                            value={item.value}
                                            onChange={(e) => handleMetaChange(index, "value", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mt-1 text-center">
                                        <button className="text-xs text-red-600 bg-white cursor-pointer py-2 shadow-md w-8" type="button" onClick={() => removeMetaField(index)}><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-2">
                                <button className="px-6 py-1 bg-blue-600 text-white shadow-md rounded-sm text-sm" type="button" onClick={addMetaField}>Ajouter un champ</button>
                            </div>

                            <div className="mt-2 flex items-end justify-end">
                                <button className="px-6 py-1 bg-gray-900 text-white shadow-md rounded-sm text-sm" type="submit">Créer l'étudiant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}