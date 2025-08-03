
import { ShowContext } from "../Contextes/UseShow.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UrlContext } from "../Contextes/UseUrl.jsx";
import NProgress from 'nprogress';
import ModalX from "../views/ModalX.jsx";
import React, { useState } from "react";

export default function LogoutComponent() {
  const {
    showLogout,
    setShowLogout,
    setShowLoginPage,
    setShowMainPage,
  } = useContext(ShowContext);
  const navigate = useNavigate();
  const [isOpen, setIsopen] = useState(false);

  const { url } = useContext(UrlContext);

  function closeLogout() {
    setShowLogout(false);
  }

  function logout() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    NProgress.start();

    axios
      .post(`${url}logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setShowLogout(false);
        setShowMainPage(false);
        setShowLoginPage(true);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        NProgress.done();
      });
  }


  const CloseModal = () => {
    setIsopen(false);
    closeLogout();
  }

  return (
    <>
      <ModalX isOpen={showLogout} onClose={() => CloseModal()}
        children={
          <>
            <h6 className="text-bold text-xl">Déconnexion </h6>
            <p className="text-xs mt-2">Voulez-vous vraiment quitter ?</p>
            <div className="flex justify-between mt-3 p-2">
              <div>
                <button onClick={logout} className="bg-red-500 px-4 py-1 text-xs text-white">
                  OUI
                </button>
              </div>
              <div>
                <button onClick={closeLogout} className="bg-green-500 px-4 py-1 text-xs text-white">
                  NON
                </button>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}
