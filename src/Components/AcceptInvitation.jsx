import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UrlContext } from "../Contextes/UseUrl";
import { ShowContext } from "../Contextes/UseShow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Notiflix from 'notiflix';

function AcceptInvitation() {
    const [isValidToken, setIsValidToken] = useState(false);
    const {
        setShowSpinner,
        setShowLoginPage,
        setShowMainPage,
        setShowAdmin,
        setUser,
        setShowInvitationPage,
      } = useContext(ShowContext);

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [samePassword, setSamePassword] = useState(false);

    const navigate = useNavigate();
    const { url } = useContext(UrlContext);

    const queryParams = new URLSearchParams(location.search);
    const invitationToken = queryParams.get("token");

    useEffect(() => {
        setSamePassword(password.trim() !== "" && password2.trim() !== "" && password === password2);
    }, [password, password2]);
    
    

    useEffect(() => {
        const validateToken = async () => {
            setShowSpinner(true);
            try { 
                const response = await axios.get(`${url}/api/validate-invitation/${invitationToken}`, {
                    headers: { 'Content-Type': 'application/json' }, });
                     if (response.data.valid) {
                         setIsValidToken(true);
                        }else{
                            navigate('/login');
                        }
                    } catch (error) {
                         console.error(error);
            } finally { 
                setShowSpinner(false); 
            }
        };
        validateToken();
    }, [invitationToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!samePassword){
            return;
        }
        setShowSpinner(true);
        let formData = {
            token : invitationToken,
            password : password,
        }
        try { 
            const response = await axios.post(`${url}/api/accept-invitation`, formData, {
            headers: { 'Content-Type': 'application/json' }, });
            if(response.status === 200){
                const { utilisateur, nom_entreprise, token, rôle } = response.data;
    
                localStorage.setItem("user", JSON.stringify(utilisateur));
                localStorage.setItem("entity", JSON.stringify(nom_entreprise));
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("role", JSON.stringify(rôle));
                let entity = localStorage.setItem("entity", JSON.stringify(nom_entreprise));
        
                Notiflix.Notify.success('Compte mis à jour avec succès !');
                setShowLoginPage(false);
                setShowMainPage(true);
        
                if (rôle === "adminSuper") {
                setShowAdmin(false);
                setShowInvitationPage(false);
                navigate("/gestionEntity");
                } else if (rôle === "admin") {
                localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
                navigate(`${entity}/AllProject`);
                setShowAdmin(true);
                setShowInvitationPage(false);
                } else if (rôle === "employe") {
                localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
                navigate(`${entity}/AllProject`);
                setShowAdmin(false);
                setUser(true);
                setShowInvitationPage(false);
                }
            }
        } catch (error) {
                console.error(error);
        } finally { 
            setShowSpinner(false); 
        }
    };

    return (
        <>
            {isValidToken ? (
                <>
                    <div className='main w-full h-full relative'>
                        <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center'>
                            <img className="w-60 m-auto mb-2" src={logosofticeo} alt="Sofiticeo" />
                            <h1 className="titreLogin">Votre nouveau mot de passe !</h1>
                            <p className='text-white'>Votre adresse email a été verifié, veuillez saisir votre nouveau mot de passe pour se connecter.</p>
                            <div className="inputs mt-6">
                                <div className="relative w-full mt-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
                                        placeholder="Mot de passe"
                                        aria-label="Mot de passe"
                                        />
                                        <span
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </span>
                                </div>
                                <div className="relative w-full mt-10">
                                    <input
                                    type={showPassword2 ? "text" : "password"}
                                    value={password2}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    className="input w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
                                    placeholder="Retaper votre Mot de passe"
                                    aria-label="Mot de passe retapé"
                                    />
                                    <span
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    >
                                    <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} />
                                    </span>
                                </div>
                                {!samePassword && password && (<><span className='text-red-500 text-left'><i>Les mots de passe doivent être identiques</i></span></>)}
                                <button
                                    className="btn mt-10"
                                    disabled={!password2 || !password}
                                    onClick={handleSubmit}
                                >
                                    Se connecter
                                </button>
                                </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='main w-full h-full relative'>
                        <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center mb-1'>
                            <img className="w-60 m-auto mb-2" src={logosofticeo} alt="Sofiticeo" />
                            <p className='text-white'>Token d'invitation invalide ou expiré ! </p>
                            <button className='mt-4 bg-blue-500 text-white px-4 py-2' onClick={()=>navigate('/login')}>Revenir à la page de connexion</button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AcceptInvitation;
