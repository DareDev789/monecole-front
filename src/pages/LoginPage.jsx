
import { ShowContext } from "../Contextes/UseShow";
import { useContext, useState } from "react";
import logo_bleu from "/logo_bleu.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import NProgress from 'nprogress';
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../Contextes/UseUrl";
import axios from "axios";
import Bouton from "../Components/Bouton";

export function LoginPage() {
    const { showLoginPage } = useContext(ShowContext);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { url } = useContext(UrlContext);

    const {
        setShowLoginPage,
        setShowMainPage,
        setShowAdmin,
        setShowUser,
    } = useContext(ShowContext);
    const navigate = useNavigate();

    const loginFunction = async () => {
        try {
            NProgress.start();
            const formData = { email, password };
            const response = await axios.post(`${url}login`, formData);
            setEmail("");
            setPassword("");

            if (response.data.message === "Login successful.") {
                const { user, token } = response.data;


                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", JSON.stringify(token));

                setShowLoginPage(false);
                setShowMainPage(true);

                if (user.grade === "admin") {
                    setShowAdmin(true);
                } else {
                    setShowAdmin(false);
                    setShowUser(true);
                }
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        } finally {
            NProgress.done();
        }
    }

    return (
        <>
            {showLoginPage && (
                <>
                    <div className="w-full min-h-[100vh] bg-gray-950 text-white">
                        <div className="absolute max-w-[90%] w-[400px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-gray-900 rounded-2xl shadow-md">
                            <div className="p-2 rounded-t-2xl">
                                <div className="m-auto w-44 mt-4">
                                    <img src={logo_bleu} alt="logo" />
                                </div>
                            </div>
                            <div className="p-6">
                                <div>
                                    <label>Email : </label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label="Adresse Email"
                                        className="w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500" type="text" />
                                </div>
                                <div className="relative mt-2">
                                    <label className="">Mot de passe : </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        aria-label="Mot de passe"
                                        onKeyDown={(e) => e.key === "Enter" && loginFunction()}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent 
                                        placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
                                    />
                                    <span
                                        className="absolute right-2 top-1/2 mt-2 transform -translate-y-1/2 cursor-pointer text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </span>
                                </div>
                                <div className="text-sm text-right mt-1">
                                    Mot de passe oublié ?
                                </div>
                                <div>
                                    <Bouton
                                        disabled={!email || !password}
                                        onClick={loginFunction}
                                        title={'Se connecter'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>

    );
}
