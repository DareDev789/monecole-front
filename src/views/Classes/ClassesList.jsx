
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useSearchParams } from "react-router-dom";

export default function ClassesList({ classes, loading, onEdit, loadClasses }) {
    const [selected, setSelected] = useState([]);
    const { url } = useContext(UrlContext);


    useEffect(() => {
        loadClasses();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette classe ?")) return;

        try {
            nProgress.start();
            await classApi.getAll($id);
            loadClasses();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        } finally {
            nProgress.done();
        }
    };

    return (
        <>
            <div className="mt-6">
                <h2 className="font-bold text-xl mb-3">Liste des classes</h2>

                {classes?.length === 0 ? (
                    <p className="text-sm text-gray-700 text-center mt-6">
                        <i>Aucune classe pour le moment !</i>
                    </p>
                ) : (
                    Array.isArray(classes) && classes.map((classe) => (
                        <div
                            key={classe.id}
                            className="flex justify-between items-center border p-2 mb-2"
                        >
                            <div>
                                <Link to={`/view-one-classe/${classe.id}`}>
                                    <strong>{classe.name}</strong>
                                </Link>
                            </div>
                            <div>
                                <button
                                    className="bg-gray-800 text-white rounded px-3 py-1 mx-1"
                                    onClick={() => onEdit(classe)}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    className="bg-red-500 text-white rounded px-3 py-1 mx-1"
                                    onClick={() => handleDelete(classe.id)}
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
}