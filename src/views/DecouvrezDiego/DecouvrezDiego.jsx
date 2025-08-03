import axios from "axios";
import nProgress from "nprogress";
import { useContext, useEffect, useRef, useState } from "react";
import { UrlContext } from "../../Contextes/UseUrl";
import EditorComp from "../../Components/EditorComp";
import ChercherImage from "../ChercherImage";

export default function DecouvrezDiego() {
    const { url } = useContext(UrlContext);
    const [content, setContent] = useState('');
    const DescriptionEditorRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false);

    const getAllConf = async () => {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);

        try {
            nProgress.start();
            const response = await axios.get(`${url}/api/decouvrez/1`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                const data = response.data.data;
                setContent(data.content);
            }
        } catch (err) {
            console.error(err);
        } finally {
            nProgress.done();
        }
    };

    const handleSave = async () => {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
        try {
            nProgress.start();
            const formData = {
               content: DescriptionEditorRef.current.getContent(),
            };

            const response = await axios.put(`${url}/api/decouvrez/1`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                alert("Enregistré avec succès !");
                getAllConf();
            }
        } catch (err) {
            console.error(err);
        } finally {
            nProgress.done();
        }
    };

    useEffect(() => {
        getAllConf();
    }, []);

    return (
        <>
            {showPopup && (
                <ChercherImage setShowPopup={setShowPopup}/>
            )}
            <div className="w-full p-6 bg-white rounded-md mt-4">
                <div className="w-full block md:flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-xl">Découvrez Diego Suarez</h1>
                    </div>
                    <div className="bg-gray-800 text-white px-2 py-1 rounded-sm">
                        <button onClick={()=> setShowPopup(true)} className="">Rechercher des images</button>
                    </div>
                </div>
                <div className="my-4">
                    <EditorComp Ref={DescriptionEditorRef} height={900} defaultvalue={content || null} />
                </div>
                <button onClick={handleSave} className="mt-8 bg-gray-800 text-white px-4 py-2 rounded">Enregistrer la configuration</button>
            </div>
        </>
    )
}