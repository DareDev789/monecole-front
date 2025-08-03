import { useContext, useEffect, useRef, useState } from "react";
import NProgress from 'nprogress';
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../../Contextes/UseUrl";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faDownload, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import EditorComp from "../../Components/EditorComp";
import nProgress from "nprogress";
import Notiflix from 'notiflix';

export default function Dashboard() {
    const { url } = useContext(UrlContext);
    

    const navigate = useNavigate();

    return (
        <>
            <div className="w-full p-6 bg-white rounded-md min-h-screen mt-4">
                
            </div>
        </>
    );
}
