import React, { useState } from "react";
import ClassesList from "./ClassesList";
import ClassesForm from "./ClassesForm";

const ClassesManager = () => {
    const [selectedClasse, setSelectedClasse] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubject] = useState([]);

    const handleEdit = (classe) => {
        setSelectedClasse(classe);
        setSubject(classe.subjects || []);
        setShowMap(true);
    };

    const handleSuccess = () => {
        setSelectedClasse(null);
        setSubject([]);
        setRefreshKey(prev => prev + 1); 
    };

    return (
        <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">
            <ClassesForm selectedClasse={selectedClasse} onSuccess={handleSuccess} showMap={showMap} setShowMap={setShowMap} classes={classes} subjects={subjects} setSubject={setSubject} />
            <ClassesList key={refreshKey} onEdit={handleEdit} classes={classes} setClasses={setClasses} />
        </div>
    );
};

export default ClassesManager;
