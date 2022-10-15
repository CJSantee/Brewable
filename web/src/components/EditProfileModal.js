// Hooks
import { useState } from "react";
// Services
import { updateUser } from "../services/users";
// Components
import ResponsiveModal from "./ResponsiveModal";

export default function EditProfileModal({ show, setShow, user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");

  const hideModal = () => {
    setShow(false);
  };

  const update = async () => {
    const { success } = await updateUser({ user_id: user.user_id, name, bio });
    if (success) {
      hideModal();
      onUpdate();
    }
  };

  return (
    <ResponsiveModal show={show} onHide={hideModal}>
      <div className='w-100 p-3'>
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
            <textarea
              className='form-control'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className='form-group m-3'>
            <button
              className='btn btn-primary w-100 rounded-lg'
              onClick={update}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
