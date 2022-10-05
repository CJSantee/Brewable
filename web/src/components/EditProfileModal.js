import Modal from "react-bootstrap/Modal";
import { useState } from "react";

export default function EditProfileModal({ show, setShow }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className='p-3 bg-600'>
        <div className='d-flex justify-content-center m-2'>
          <h3>Edit Profile</h3>
        </div>
        <div className='m-3 border rounded'>
          <div className='form-group m-3'>
            <label className='text-muted text-uppercase'>Name</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='form-group m-3'>
            <label className='text-muted text-uppercase'>Bio</label>
            <textarea className='form-control' />
          </div>
          <div className='form-group m-3'>
            <button
              className='btn btn-primary w-100 rounded-lg'
              onClick={() => {}}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
