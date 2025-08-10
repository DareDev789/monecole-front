import React, { useEffect, useState } from "react";
import PersonnelsList from "./PersonnelsList";
import PersonnelsForm from "./PersonnelsForm";
import { useNavigate, useParams } from "react-router-dom";
import nProgress from "nprogress";
import { personnelsApi } from "../../services/api";
import Pagination from "../../Components/ui/Pagination";
import Modal from "../../Components/ui/Modal";

const PersonnelsManager = () => {
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [employes, setEmployes] = useState([]);

  const [loading, setLoading] = useState(true);
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
  });

  const fetchEmployes = async () => {
    try {
      nProgress.start();
      setLoading(true);
      const res = await personnelsApi.getAll(currentPage);
      setEmployes(res.data.data || []);
      setPagination({
        total: res.data.pagination.total,
        per_page: res.data.pagination.per_page,
        current_page: res.data.pagination.current_page,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des employés :", err);
    } finally {
      nProgress.done();
      setLoading(false);
    }
  };

  const handleEdit = (employe) => {
    setSelectedEmploye(employe);
    setShowMap(true);
  };

  const NewPersonnal = () => {
    setSelectedEmploye(null);
    setShowMap(true);
  }

  const handleSuccess = () => {
    setSelectedEmploye(null);
    setRefreshKey(prev => prev + 1);
    fetchEmployes();
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  const closePopup = () => {
    setSelectedEmploye(null);
    setShowMap(false);
  }
  
  const handlePageChange = (newPage) => {
    navigate(`/personnels/page/${newPage}`);
  };


  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center w-full py-8">
            <div className="animate-spin rounded-full h-12 mx-auto w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full p-6 bg-white rounded-md mt-4 min-h-screen">

            <PersonnelsList key={refreshKey} employes={employes} onEdit={handleEdit} NewPersonnal={NewPersonnal} fetchEmployes={fetchEmployes}/>

            {pagination.total > pagination.per_page && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={Math.ceil(pagination.total / pagination.per_page)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
            <Modal isOpen={showMap}
              setIsOpen={() => closePopup()}
              title={selectedEmploye ? "Modifier un personnel" : "Ajouter un employé"}>
              <PersonnelsForm selectedEmploye={selectedEmploye} onSuccess={handleSuccess} onCancel={closePopup} />
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default PersonnelsManager;
