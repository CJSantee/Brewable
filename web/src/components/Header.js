// React
import { useState } from "react";
// Assets
import icon from "../assets/Brewable-Icon_1024x1024.png";
import { faBars } from "@fortawesome/free-solid-svg-icons";
// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Offcanvas from "react-bootstrap/Offcanvas";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
// Hooks
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { auth, logout } = useAuth();

  const closeWith = (fxn) => {
    setShowOffcanvas(false);
    fxn();
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    window.location.href = `/${searchInput}`;
  };

  const onSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      <nav className='navbar box-shadow bg-white justify-content-between justify-content-sm-start'>
        <a className='navbar-brand ms-3' href='/'>
          <img src={icon} width='55' height='55' alt='Brewable Icon' />
        </a>
        <form action='submit' onSubmit={onSubmitSearch} className='form-inline'>
          <input
            onChange={onSearchInput}
            type='text'
            className='form-control rounded-pill bg-light'
            placeholder='Search Brewable...'
          />
        </form>
        <button
          onClick={() => setShowOffcanvas(true)}
          className='btn btn-outline-secondary d-flex d-sm-none mx-3'
        >
          <FontAwesomeIcon icon={faBars} size='xl' />
        </button>
        <div className='d-none d-sm-flex ms-auto mx-3'>
          {auth.user ? (
            <>
              <button onClick={logout} className='btn btn-outline-primary'>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowSignIn(true)} className='btn mr-2'>
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className='btn btn-outline-primary'
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <SignInModal
        show={showSignIn}
        setShow={setShowSignIn}
        showSignUp={() => setShowSignUp(true)}
      />
      <SignUpModal
        show={showSignUp}
        setShow={setShowSignUp}
        showSignIn={() => setShowSignIn(true)}
      />
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        responsive='sm'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Brewable</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='d-flex flex-column'>
            {auth.user ? (
              <>
                <button
                  onClick={() => closeWith(logout)}
                  className='btn btn-outline-primary'
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => closeWith(() => setShowSignIn(true))}
                  className='btn mr-2'
                >
                  Sign In
                </button>
                <button
                  onClick={() => closeWith(() => setShowSignUp(true))}
                  className='btn btn-outline-primary'
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
