import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo_bleu from "/logo_bleu.png";
import Tippy from "@tippyjs/react";
import { faBars, faGears, faSignOutAlt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "../Contextes/UseShow";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from '../views/Dashboard/Dashboard';
import StudentModal from "../views/ElevesComp/StudentModal";

import PersonnelsManager from '../views/Personnels/PersonnelsManager';

import VueOneClasse from '../views/Classes/VueOneClasse';
import MatieresManager from "../views/Matieres/MatieresManager";
import VueOneSubject from "../views/Matieres/VueOneSubject";
import MonProfil from "../views/MonProfil/MonProfil";
import PreferencesManager from "../views/Preferences/PreferencesManager";
import PaymentManager from "../views/PaymentManager/PaymentManager";

import { configureApi } from '../services/api';
import { UrlContext } from '../Contextes/UseUrl';
import StudentManager from "../views/ElevesComp/StudentManager";
import ClassManager from "../views/Classes/ClassManager";
import { schoolYearApi } from '../services/api';
import MatiereToClassManager from "../views/Classes/MatiereToClassManager";
import Notiflix from "notiflix";
import GradeManager from "../views/Grades/GradeManager";
import AnnualReportManager from "../views/AnnualReport/AnnualReportManager";
import PaiementEcolage from "../views/PaymentManager/PaiementEcolage";

Notiflix.Confirm.init({
    width: "320px",
    borderRadius: "8px",
    titleColor: "#111",
    messageColor: "#555",
    okButtonBackground: "#ef4444", // rouge
    okButtonColor: "#fff",
    cancelButtonBackground: "#e5e7eb", // gris clair
    cancelButtonColor: "#111",
    plainText: false,
});

Notiflix.Notify.init({
    position: "right-top",
    distance: "10px",
    success: { background: "#16a34a", textColor: "#fff" },
    failure: { background: "#ef4444", textColor: "#fff" },
});

function MainPage() {
    const { setShowLogout } = useContext(ShowContext);
    const navigate = useNavigate();
    const [showAllMenu, setShowAllMenu] = useState(false);
    const [currentYear, setCurrentYear] = useState(null);

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    const { url } = useContext(UrlContext);

    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);

    const MenuRef = useRef(null);

    function logout() {
        setShowLogout(true);
    }

    useEffect(() => {
        configureApi(url, token);
    }, [url, token]);

    useEffect(() => {
        loadData();
    }, [url, token]);

    const loadData = async () => {
        const [currentYearRes] = await Promise.all([
            schoolYearApi.getCurrent()
        ]);
        setCurrentYear(currentYearRes.data);
    };


    return (
        <>
            <StudentModal />
            <div className="w-full">
                {/* Header fixe */}
                <header className={`w-full shadow-lg px-4 py-2 fixed top-0 z-50 text-neutral-950 bg-white`}>
                    <div className="flex justify-between items-center h-[40px]">
                        <div className="h-[40px] cursor-pointer">
                            <img
                                onClick={() => navigate(`/dashboard`)}
                                className="h-full"
                                src={logo_bleu}
                                alt=""
                            />
                        </div>
                        <div className="flex items-center">
                            <div
                                onClick={() => navigate(`/mon-profil`)}
                                className="mr-2 hidden sm:block cursor-pointer">
                                <span className="font-bold text-sm">{user?.name}</span>
                            </div>

                            <div>
                                <Tippy
                                    content="menus"
                                >
                                    <FontAwesomeIcon
                                        onClick={() => setShowAllMenu(!showAllMenu)}
                                        icon={!showAllMenu ? faBars : faXmark}
                                        className="p-4 cursor-pointer focus:outline-none md:hidden block "
                                    />
                                </Tippy>
                            </div>
                            <div>
                                <Tippy
                                    content="Preferences"
                                >
                                    <FontAwesomeIcon
                                        onClick={() => navigate(`/preferences`)}
                                        icon={faGears}
                                        className="p-4 cursor-pointer focus:outline-none"
                                    />
                                </Tippy>
                            </div>
                            <div>
                                <Tippy
                                    content="Se déconnecter"
                                >
                                    <FontAwesomeIcon
                                        onClick={logout}
                                        icon={faSignOutAlt}
                                        className="p-4 cursor-pointer focus:outline-none "
                                    />
                                </Tippy>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            <div className="container mx-auto flex flex-col md:flex-row mt-14 relative">
                {showAllMenu && (
                    <>  <div className="absolute w-full h-full backdrop-blur-md top-0 left-0" />
                        <div className="bg-white p-4 text-gray-900 gap-2 space-y-4 fixed top-15 right-0 w-96 max-w-full h-full z-[60] shaddow-xl">
                            <nav className="block space-y-2 w-full list-none">
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/dashboard`) }}
                                >
                                    Dashbord
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/personnels`) }}
                                >
                                    Personnels
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/classes`) }}
                                >
                                    Classes
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/matieres`) }}
                                >
                                    Matières
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/gestion-eleves`) }}
                                >
                                    Gestion des élèves
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/gestion-notes`) }}
                                >
                                    Gestion des notes
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/bulletins`) }}
                                >
                                    Bulletins
                                </li>
                                <li
                                    className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 hover:text-white font-medium text-sm cursor-pointer"
                                    onClick={() => { setShowAllMenu(false); navigate(`/paiements`) }}
                                >
                                    Paiements
                                </li>
                                {/* <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/reservation-to-validate`)}
                        >
                            Réservation à valider
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/reservations`)}
                        >
                            Réservations
                        </li> */}
                            </nav>
                        </div>
                    </>
                )}
                <aside className={`hidden md:block bg-gray-800 text-white w-full md:w-1/6 p-4 overflow-auto max-h-[calc(100vh-3.6em)] scrollbar-thin`}>
                    <nav className="flex flex-wrap gap-2 md:block md:space-y-2 w-full list-none">
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/dashboard`)}
                        >
                            Dashbord
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/personnels`)}
                        >
                            Personnels
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/classes`)}
                        >
                            Classes
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/matieres`)}
                        >
                            Matières
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/gestion-eleves`)}
                        >
                            Gestion des élèves
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/gestion-notes`)}
                        >
                            Gestion des notes
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/bulletins`)}
                        >
                            Bulletins
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/paiements`)}
                        >
                            Paiements
                        </li>
                        {/* <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/reservation-to-validate`)}
                        >
                            Réservation à valider
                        </li>
                        <li
                            className="w-[48%] md:w-full p-2 rounded hover:bg-gray-900 font-medium text-sm cursor-pointer"
                            onClick={() => navigate(`/reservations`)}
                        >
                            Réservations
                        </li> */}
                    </nav>
                </aside>

                <main className="flex-1 p-6 bg-white overflow-auto h-[calc(100vh-3.6em)] scrollbar-thin">
                    <Routes>
                        <Route path={`/dashboard`} element={<Dashboard />} />
                        <Route path={`/`} element={<Dashboard />} />
                        <Route path={`/personnels`} element={<PersonnelsManager />} />
                        <Route path={`/personnels/page/:page?`} element={<PersonnelsManager />} />
                        <Route path="/classes" element={<ClassManager />} />
                        <Route path="/view-one-classe/:id" element={<VueOneClasse />} />
                        <Route path="/view-one-classe/gerer/:id" element={<MatiereToClassManager />} />
                        <Route path="/matieres" element={<MatieresManager />} />
                        <Route path="/matieres/page/:page?" element={<MatieresManager />} />
                        <Route path="/view-one-matiere/:id" element={<VueOneSubject />} />
                        <Route path="/gestion-eleves" element={<StudentManager />} />
                        <Route path="/gestion-eleves/page/:page?" element={<StudentManager />} />
                        <Route path="/mon-profil" element={<MonProfil />} />
                        <Route path="/preferences" element={<PreferencesManager />} />
                        <Route path="/paiements" element={<PaymentManager />} />
                        <Route path="/gestion-notes" element={<GradeManager />} />
                        <Route path="/bulletins" element={<AnnualReportManager />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainPage;
