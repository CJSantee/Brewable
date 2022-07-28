import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { api } from "../utils/api";
import Modal from "react-bootstrap/Modal";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth.userId) {
      api.get(`/users/${auth.userId}`, setUser);
    }
  }, [auth.userId]);

  const formatPhone = (phone) => {
    const areaCode = phone.substring(2, 5);
    const middleThree = phone.substring(5, 8);
    const lastFour = phone.substring(8);
    return `(${areaCode}) ${middleThree}-${lastFour}`;
  };

  return (
    <div className='container'>
      {user && (
        <>
          <div className='card my-4'>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>
                  Name: {user.first_name} {user.last_name}
                </p>
                <button
                  onClick={() => setShowNameModal(true)}
                  className='btn btn-outline-secondary m-2'
                >
                  Edit
                </button>
              </li>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>Email: {user.email}</p>
                <button className='btn btn-outline-secondary m-2'>Edit</button>
              </li>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>
                  Phone: {user.phone ? formatPhone(user.phone) : "UNKNOWN"}
                </p>
                <button className='btn btn-outline-secondary m-2'>Edit</button>
              </li>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>Password: ******</p>
                <button className='btn btn-outline-secondary m-2'>Edit</button>
              </li>
            </ul>
          </div>
          <NameModal
            first_name={user.first_name}
            last_name={user.last_name}
            show={showNameModal}
            setShow={setShowNameModal}
          />
        </>
      )}
    </div>
  );
}

function NameModal({ first_name, last_name, show, setShow }) {
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);

  const postUpdate = () => {};

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className='modal-body'>
        <div className='mb-3'>
          <label htmlFor='first_name' className='form-label'>
            First Name
          </label>
          <input
            type='text'
            className='form-control'
            id='first_name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='last_name' className='form-label'>
            Last Name
          </label>
          <input
            type='text'
            className='form-control'
            id='last-name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className='d-flex justify-content-center'>
          <button onClick={postUpdate} className='btn btn-primary'>
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}
