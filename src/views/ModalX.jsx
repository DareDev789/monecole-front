import PropTypes from 'prop-types';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ModalX = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40`}></div> 
      <div className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md z-50 w-[400px] max-w-[90%] text-neutral-950 bg-white`}>
        <div className='text-right w-full fixed top-[-13px] right-[-5px]'><FontAwesomeIcon icon={faXmark} className=" cursor-pointer px-2.5 py-2 h-3 text-white bg-red-600 rounded-full" onClick={onClose}/></div>
        <div className='p-4 overflow-auto max-w-[90%]'>{children}</div>
      </div>
    </>
  );
};

ModalX.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ModalX;
