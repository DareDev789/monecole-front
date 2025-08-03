import React, { useRef } from "react";
import Notiflix from "notiflix";

export default function ImageGalleryUpload({ gallery, setGallery, existingGallery, setExistingGallery, deletedGallery, setDeletedGallery, toHttps }) {
  const fileInputRef = useRef(null);

  const compressImage = async (file, maxWidth = 800, quality = 0.7) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/avif' || file.size < 500000) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const ratio = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          if (file.type === "image/png") {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const outputFormat = file.type === "image/png" ? "image/png" : "image/jpeg";
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            resolve(new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now(),
            }));
          }, outputFormat, outputFormat === 'image/jpeg' ? quality : 1);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (!file.type.match("image.*") && !file.name.endsWith(".avif")) continue;

      try {
        let processedFile = file;
        const isAVIF = file.type === "image/avif" || file.name.endsWith(".avif");

        if (!isAVIF && file.size > 500000) {
          processedFile = await compressImage(file);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setGallery((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              url: e.target.result,
              file: processedFile,
            }
          ]);
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error("Erreur de traitement :", error);
        Notiflix.Notify.failure(`Erreur avec ${file.name}`);
      }
    }
  };

  const removeNewImage = (id) => {
    setGallery(prev => prev.filter(img => img.id !== id));
  };

  const removeExistingImage = (url) => {
    setExistingGallery(prev => prev.filter(img => img !== url));
    setDeletedGallery(prev => [...prev, url]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div>
        {[...existingGallery, ...gallery].length === 0 ? (
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg w-full h-52 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
          >
            <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="mt-2 text-gray-600">Ajouter une image</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 gap-2">
              {existingGallery?.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 p-1 px-2 bg-red-500 text-white rounded-full text-xs"
                  >✕</button>
                </div>
              ))}
              {gallery.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={toHttps(img.url)} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(img.id)}
                    className="absolute top-1 right-1 p-1 px-2 bg-red-500 text-white rounded-full text-xs"
                  >✕</button>
                </div>
              ))}
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed py-4 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition"
              >
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
