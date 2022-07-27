import { useState } from "react";
import Modal from "react-bootstrap/Modal";
// import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function SignInModal({ show, setShow, showSignUp }) {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();
  // const navigate = useNavigate();
  // const location = useLocation();

  // let from = location.state?.from?.pathname || "/";

  const login = () => {
    const values = {
      userIdentifier,
      password,
    };

    auth.login(values, () => {
      setShow(false);
    });
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <div className='p-3 bg-600'>
          <div className='d-flex justify-content-center m-2'>
            <h3>Sign in to Brewable</h3>
          </div>
          <div className='m-3 border rounded'>
            <div className='form-group m-3'>
              <label>Email or phone</label>
              <input
                type='email'
                className='form-control'
                value={userIdentifier}
                onChange={(e) => {
                  setUserIdentifier(e.target.value);
                }}
              />
            </div>
            <div className='form-group m-3'>
              <label>Password</label>
              <div className='input-group'>
                <input
                  type={showPassword ? "text" : "password"}
                  className='form-control'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className='input-group-append'>
                  <button
                    className='btn btn-outline-secondary'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
            <div className='form-group m-3'>
              <button
                className='btn btn-success w-100 rounded-lg'
                onClick={login}
              >
                Sign in
              </button>
            </div>
          </div>
          <div className='m-3 border rounded p-3 d-flex justify-content-center align-items-center'>
            <div className='d-flex align-items-center'>
              <p className='m-0 p-0'>New to Brewable?</p>
              <button
                className='btn btn-link p-0 ms-1'
                onClick={() => {
                  setShow(false);
                  showSignUp();
                }}
              >
                Create an account
              </button>
              <p className='m-0 p-0'>.</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
