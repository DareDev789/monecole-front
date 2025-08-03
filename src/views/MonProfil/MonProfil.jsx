import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UrlContext } from "../../Contextes/UseUrl";
import nProgress from "nprogress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

export default function MonProfil() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        is_active : false,
    });
    const [password, setPassword] = useState("");
    const [verifPassword, setVerifPassWord] = useState("");
    return (
        <>

        </>
    )
}