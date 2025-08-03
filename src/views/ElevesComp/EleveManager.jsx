import { useState } from "react";
import ElevesForm from "./ElevesForm";
import ElevesList from "./ElevesList";

export default function EleveManager() {
    const [eleves, setEleves] = useState([]);
    const [selectedEleves, setSelectedEleves] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showMap, setShowMap] = useState(false);

    const handleEdit = (eleve) => {
        setSelectedEleves(eleve);
        setShowMap(true);
    };

    const handleSuccess = () => {
        setSelectedEleves(null);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">
                <ElevesForm selectedEleves={selectedEleves} onSuccess={handleSuccess} showMap={showMap} setShowMap={setShowMap} setSelectedEleves={setSelectedEleves}/>
                <ElevesList key={refreshKey} onEdit={handleEdit} eleves={eleves} setEleves={setEleves}/>
            </div>
        </>
    );
}