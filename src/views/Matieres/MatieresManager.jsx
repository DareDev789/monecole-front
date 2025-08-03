import { useState } from "react";
import MatieresForm from "./MatieresForm";
import MatieresList from "./MatieresList";

export default function MatieresManager() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubject] = useState([]);

    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setClasses(subject.classe || []);
        setShowMap(true);
    };

    const handleSuccess = () => {
        setSelectedSubject(null);
        setSubject([]);
        setRefreshKey(prev => prev + 1);
    };
    return (
        <>
            <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">
                <MatieresForm selectedSubject={selectedSubject} onSuccess={handleSuccess} showMap={showMap} setShowMap={setShowMap} classes={classes} subjects={subjects} setClasses={setClasses} />
                <MatieresList key={refreshKey} onEdit={handleEdit} subjects={subjects} setSubject={setSubject} />
            </div>
        </>
    )
}