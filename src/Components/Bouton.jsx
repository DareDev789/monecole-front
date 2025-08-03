
export default function Bouton({title, disabled, onClick}) {
    return (
        <>
            <button disabled={disabled} onClick={onClick} className={`px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-3`}>
                {title}
            </button>
        </>
    );
}