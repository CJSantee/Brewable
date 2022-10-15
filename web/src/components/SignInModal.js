import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import ResponsiveModal from "./ResponsiveModal";

export default function SignInModal({ show, setShow, showSignUp }) {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const auth = useAuth();

  const navigate = useNavigate();

  const togglePersist = () => {
    auth.setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", auth.persist);
  }, [auth.persist]);

  const login = async () => {
    const values = {
      userIdentifier,
      password,
    };

    const { redirect_url, alerts: login_alerts } = await auth.login(values);
    if (redirect_url) {
      setShow(false);
      navigate(redirect_url, { replace: true });
    }
    if (login_alerts) {
      setAlerts(login_alerts);
    }
  };

  // Reset State Variables
  const resetModal = () => {
    setShow(false);
    setUserIdentifier("");
    setPassword("");
    setShowPassword(false);
    setAlerts([]);
  };

  return (
    <>
      <ResponsiveModal show={show} onHide={resetModal}>
        <div className='p-3 bg-600'>
          <div className='d-flex justify-content-center m-2'>
            <h3>Sign in to Brewable</h3>
          </div>
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`d-flex m-3 bg-${alert.type} bg-opacity-10 border border-${alert.type} rounded justify-content-between align-items-center`}
            >
              <p className='m-3'>{alert.message}</p>
              <span
                className='cursor-pointer p-3'
                onClick={() =>
                  setAlerts(
                    alerts.filter((alt) => alt.message !== alert.message)
                  )
                }
              >
                <FontAwesomeIcon icon={faX} size='sm' />
              </span>
            </div>
          ))}
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
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={auth.persist}
                  onChange={togglePersist}
                  id='flexCheckDefault'
                />
                <label className='form-check-label' htmlFor='flexCheckDefault'>
                  Remember me
                </label>
              </div>
            </div>
            <div className='form-group m-3'>
              <button
                className='btn btn-primary w-100 rounded-lg'
                onClick={login}
              >
                Sign In
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
      </ResponsiveModal>
    </>
  );
}
