import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo_bleu from "/logo_bleu.png";
import Tippy from "@tippyjs/react";
import { faBars, faGears, faSignOutAlt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "../Contextes/UseShow";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from '../views/Dashboard/Dashboard';

import PersonnelsManager from '../views/Personnels/PersonnelsManager';
import ClassesManager from '../views/Classes/ClassesManager';

import VueOneClasse from '../views/Classes/VueOneClasse';
import MatieresManager from "../views/Matieres/MatieresManager";
import VueOneSubject from "../views/Matieres/VueOneSubject";
import EleveManager from "../views/ElevesComp/EleveManager";
import MonProfil from "../views/MonProfil/MonProfil";
import PreferencesManager from "../views/Preferences/PreferencesManager";
import PaymentManager from "../views/PaymentManager/PaymentManager";

import { configureApi } from '../services/api';
import { UrlContext } from '../Contextes/UseUrl';


function MainPage() {
    const { setShowLogout } = useContext(ShowContext);
    const navigate = useNavigate();
    const [showAllMenu, setShowAllMenu] = useState(false);

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

    return (
        <>
            <div className="w-full">
                {/* Header fixe */}
                <header className={`w-full shadow-lg px-4 py-2 fixed top-0 z-50 text-neutral-950 bg-white`}>
                    <div className="flex justify-between items-center h-[40px]">
                        <div className="h-[40px] cursor-pointer">
                            <img
                                onClick={() => navigate(`/HomePageConf`)}
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
                                        className="p-4 cursor-pointer focus:outline-none sm:hidden block "
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
                    <div className="w-full backdrop-blur-lg h-screen">
                        <div className="bg-white text-gray-900 gap-2 space-y-4 absolute top-0 right-0 w-64 max-w-full z-[60] shaddow-xl">
                            <nav className="block space-y-2 w-full list-none">
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
                        </div>
                    </div>
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

                <main className="flex-1 p-6 bg-gray-100 overflow-auto h-[calc(100vh-3.6em)] scrollbar-thin">
                    <Routes>
                        <Route path={`/dashboard`} element={<Dashboard />} />
                        <Route path={`/`} element={<Dashboard />} />
                        <Route path={`/personnels`} element={<PersonnelsManager />} />
                        <Route path="/classes" element={<ClassesManager />} />
                        <Route path="/view-one-classe/:id" element={<VueOneClasse />} />
                        <Route path="/matieres" element={<MatieresManager />} />
                        <Route path="/view-one-matiere/:id" element={<VueOneSubject />} />
                        <Route path="/gestion-eleves" element={<EleveManager />} />
                        <Route path="/mon-profil" element={<MonProfil />} />
                        <Route path="/preferences" element={<PreferencesManager />} />
                        <Route path="/paiements" element={<PaymentManager />} />
                        {/*<Route path="/room/create" element={<RoomForm />} />
                        <Route path="/room/:id/edit" element={<RoomForm />} /> */}
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainPage;
