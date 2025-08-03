import React, { useState } from "react";
import PersonnelsList from "./PersonnelsList";
import PersonnelsForm from "./PersonnelsForm";

const PersonnelsManager = () => {
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const handleEdit = (employe) => {
    setSelectedEmploye(employe);
    setShowMap(true);
  };

  const handleSuccess = () => {
    setSelectedEmploye(null);
    setRefreshKey(prev => prev + 1); // Refresh la liste
  };

  return (
    <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">
      <PersonnelsForm selectedEmploye={selectedEmploye} onSuccess={handleSuccess} showMap={showMap} setShowMap={setShowMap}/>
      <PersonnelsList key={refreshKey} onEdit={handleEdit}  />
    </div>
  );
};

export default PersonnelsManager;
