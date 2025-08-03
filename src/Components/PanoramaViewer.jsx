import React, { useContext, useEffect, useRef } from 'react';
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const PanoramaViewer = ({ image, setImage }) => {
    const viewerRef = useRef(null);

    useEffect(() => {
        const viewer = new Viewer({
            container: viewerRef.current,
            panorama: image,
            loadingImg: '/loading.gif',
            defaultLong: Math.PI,
            navbar: ['zoom', 'fullscreen'],
        });

        return () => viewer.destroy();
    }, [image]);

    return (
        <div className='relative w-full'>
            <div ref={viewerRef} style={{ width: '100%', height: '400px' }} />
            {setImage && (
                <div className='absolute top-3 right-3 text-red-600 bg-white p-2 rounded text-xs shadow-sm'>
                    <FontAwesomeIcon icon={faTrash} onClick={setImage} />
                </div>
            )}
        </div>
    );
};

export default PanoramaViewer;
