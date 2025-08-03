import { faCopy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { UrlContext } from "../Contextes/UseUrl";
import nProgress from "nprogress";
import axios from "axios";
import Notiflix from "notiflix";

export default function ChercherImage({ setShowPopup }) {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const { url } = useContext(UrlContext);
    const [ajouter, setAjouter] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 20;
    const [newPhoto, setNewPhoto] = useState(false);
    const [desc, setDesc] = useState('');

    const getAllConf = async () => {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);

        try {
            nProgress.start();
            const response = await axios.get(`${url}/api/image`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                const data = response.data.data;
                setImages(data);
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

    useEffect(() => {
        const searchTerm = search.toLowerCase();
        if (searchTerm.trim() !== '') {
            const results = images.filter(img =>
                img.desc?.toLowerCase().includes(searchTerm)
            );
            setFilteredImages(results);
            setCurrentPage(1);
        }else{
            setFilteredImages(images);
            setCurrentPage(1);
        }
    }, [search, images]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            Notiflix.Notify.success("Lien copié dans le presse-papiers !");
        });
    };

    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

    const saveImage = async () => {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
        try {
            nProgress.start();
            const data = {
                desc,
                guid: newPhoto[0],
            };
            console.log(data);

            const response = await axios.post(`${url}/api/image`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.data) {
                alert("Enregistré avec succès !");
                setNewPhoto(null);
                setDesc('');
                setAjouter(false);
                getAllConf();
            }
        } catch (err) {
            console.error(err);
        } finally {
            nProgress.done();
        }
    }

    return (
        <>
            <div onClick={() => setShowPopup(false)} className={`fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40`}></div>
            <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md z-50 w-[1000px] max-w-[90%] text-neutral-950 bg-white`}>
                <div className='text-right w-full fixed top-[-13px] right-[-5px]'>
                    <FontAwesomeIcon icon={faXmark} className=" cursor-pointer px-2.5 py-2 h-3 text-white bg-red-600 rounded-full" onClick={() => setShowPopup(false)} /></div>
                <div className='p-4 overflow-auto max-w-[90%]'>
                    {ajouter ? (
                        <>
                            <h1 className="text-xl font-bold mb-2">Ajouter une image</h1>
                            {newPhoto ? (
                                <>
                                    <div className="w-64 h-64 relative overflow-hidden my-4">
                                        <img
                                            src={URL.createObjectURL(newPhoto[0])}
                                            alt="aperçu"
                                            className="object-cover w-full h-full rounded-lg"
                                        />

                                    </div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'image</label>
                                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-64 mb-4 p-2 border rounded focus:outline-none focus:border-gray-800" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <button onClick={saveImage} className="bg-gray-900 text-white px-2 py-1 rounded-sm">Enregistrer</button>
                                        </div>
                                        <div>
                                            <button onClick={()=>setAjouter(false)} className="bg-red-600 text-white px-2 py-1 rounded-sm">Annuler</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 my-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setNewPhoto(e.target.files)}
                                                className="hidden"
                                            />
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg w-full h-52 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
                                            >
                                                <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="mt-2 text-gray-600">Ajouter une image</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <button className="bg-red-600 text-white px-2 py-1 rounded-sm">Annuler</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="p-4 max-h-[70vh] overflow-y-auto">
                                {/* 🔍 Champ de recherche */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Rechercher par description..."
                                        className="w-full border px-3 py-2 rounded shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {currentImages.map((img, index) => (
                                        <div key={index} className="border rounded-md overflow-hidden shadow-sm text-center p-2 bg-gray-50">
                                            <img src={img.guid} alt="miniature" className="w-full h-[120px] object-cover rounded-md mb-2" />
                                            <p className="text-sm text-gray-600 truncate mb-1">{img.desc || "Sans description"}</p>
                                            <button
                                                onClick={() => copyToClipboard(img.guid)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                <FontAwesomeIcon icon={faCopy} className="mr-1" />
                                                Copier le lien
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-4">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`px-3 py-1 text-sm rounded ${currentPage === i + 1
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button className="bg-gray-900 text-white px-2 py-1 rounded-sm mt-4" onClick={() => setAjouter(true)}>Ajouter une image</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}