// Hooks
import useWindowDimensions from "../hooks/useWindowDimensions";
// Components
import Modal from "react-bootstrap/Modal";
// Constants
import { BOOTSTRAP_BREAKPOINTS } from "../constants";

export default function ResponsiveModal({ show, onHide, children }) {
  const { width } = useWindowDimensions();

  if (width >= BOOTSTRAP_BREAKPOINTS["sm"]) {
    return (
      <Modal show={show} onHide={onHide}>
        {children}
      </Modal>
    );
  } else {
    return (
      <div
        onClick={onHide}
        className={
          show
            ? "position-absolute bg-dark-transparent w-100 h-100 d-flex justify-content-center align-items-center"
            : "d-none"
        }
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className='bg-white rounded w-100 max-w-400px'
        >
          {children}
        </div>
      </div>
    );
  }
}
