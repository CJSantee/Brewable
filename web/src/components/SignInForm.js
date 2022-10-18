import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function SignInForm({ onSignIn, onSignUp }) {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [rememberMe, setRememberMe] = useState(true);

  const auth = useAuth();

  const navigate = useNavigate();

  const login = async () => {
    const values = {
      userIdentifier,
      password,
      rememberMe,
    };

    const { redirect_url, alerts: login_alerts } = await auth.login(values);
    if (redirect_url) {
      navigate(redirect_url, { replace: true });
      if (typeof onSignIn === "function") {
        onSignIn();
      }
    }
    if (login_alerts) {
      setAlerts(login_alerts);
    }
  };

  return (
    <div className='p-3 min-w-400px'>
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
              setAlerts(alerts.filter((alt) => alt.message !== alert.message))
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
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              id='flexCheckDefault'
            />
            <label className='form-check-label' htmlFor='flexCheckDefault'>
              Remember me
            </label>
          </div>
        </div>
        <div className='form-group m-3'>
          <button className='btn btn-primary w-100 rounded-lg' onClick={login}>
            Sign In
          </button>
        </div>
      </div>
      <div className='m-3 border rounded p-3 d-flex justify-content-center align-items-center'>
        <div className='d-flex align-items-center'>
          <p className='m-0 p-0'>New to Brewable?</p>
          <button className='btn btn-link p-0 ms-1' onClick={onSignUp}>
            Create an account
          </button>
          <p className='m-0 p-0'>.</p>
        </div>
      </div>
    </div>
  );
}
