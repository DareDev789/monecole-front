
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { classApi } from '../../services/api';
import ClassCard from "./ClassCard";
import EmptyState from "../../Components/ui/EmptyState";

export default function ClassesList({ classes, loading, onEdit, loadClasses }) {
    const [selected, setSelected] = useState([]);
    const { url } = useContext(UrlContext);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette classe ?")) return;

        try {
            nProgress.start();
            await classApi.delete(id);
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
                {classes?.length === 0 ? (
                    <EmptyState
                        title="Aucune classe trouvée"
                        description="Commencez par ajouter une nouvelle classe"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(classes) && classes.map((classe) => (
                            <div key={classe.id}>
                                <ClassCard classe={classe}
                                    onEdit={() => onEdit(classe)}
                                    handleDelete={() => handleDelete(classe.id)}
                                     />
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </>
    );
}