
import { ShowContext } from "../Contextes/UseShow.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../Contextes/UseUrl.jsx";
import NProgress from 'nprogress';
import React, { useState } from "react";
import { LoginApi } from "../services/api.js";
import Modal from "./ui/Modal.jsx";
import { motion } from "framer-motion";

export default function LogoutComponent() {
  const {
    showLogout,
    setShowLogout,
    setShowLoginPage,
    setShowMainPage,
  } = useContext(ShowContext);
  const navigate = useNavigate();
  const [isOpen, setIsopen] = useState(false);

  function closeLogout() {
    setShowLogout(false);
  }

  function logout() {
    NProgress.start();

    LoginApi.logout().then((response) => {
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
      <Modal isOpen={showLogout} setIsOpen={() => CloseModal()} title="Déconnexion">
        <motion.div
          className="p-4 "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-sm font-medium text-gray-800 mb-4 text-center">
            Voulez-vous vraiment quitter ?
          </p>

          <div className="flex justify-center gap-4">
            <motion.button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm rounded-lg shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Oui
            </motion.button>

            <motion.button
              onClick={closeLogout}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm rounded-lg shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Non
            </motion.button>
          </div>
        </motion.div>
      </Modal>
    </>
  );
}
