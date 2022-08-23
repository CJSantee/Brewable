import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";
import Modal from "react-bootstrap/Modal";
import { verifyEmail, verifyPhone } from "../utils/verify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [image, setImage] = useState(null);
  const [changesMade, setChangesMade] = useState(false);

  // Modals
  const [showNameModal, setShowNameModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(`/users/${auth.user?.user_id}`);
      setUser(data);
    };
    if (auth?.user) {
      fetchData();
    }
  }, [auth.user]);

  const formatPhone = (phone) => {
    const areaCode = phone.substring(2, 5);
    const middleThree = phone.substring(5, 8);
    const lastFour = phone.substring(8);
    return `(${areaCode}) ${middleThree}-${lastFour}`;
  };

  function onSelectAvatar(e) {
    const file = e.target.files[0];

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    setChangesMade(true);
  }

  async function onUpdateUser() {
    // Post New avatar image
    if (avatarFile) {
      const { name, type } = avatarFile;
      const directory = `avatars/${user.id}`;
      const {
        data: { presigned_url },
      } = await api.post(
        `/presigned_url?filename=${name}&fileType=${type}&directory=${directory}`
      );
      await api.postPhoto(presigned_url, avatarFile, type);
      const { data } = await api.patch(`/users/${user.id}`, {
        user: {
          image_uri: `${directory}/${name}`,
        },
      });
      console.log(data);
    }
  }

  if (!user) {
    return (
      <div className='container'>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-3'>
          <div className='h-100 py-4'>
            <div className='card h-100 justify-content-evenly align-items-center'>
              {user.image ? (
                <div className='w-75'>
                  <div className='square'>
                    <div className='square-content'>
                      <img
                        className='img-user'
                        src={image || user.image.sourceUrl}
                        alt={`${user.first_name}-${user.last_name}-avatar`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p>No Avatar</p>
              )}
              <div className='d-flex justify-content-center'>
                <input
                  type='file'
                  className='form-control w-75'
                  onChange={onSelectAvatar}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='col-9'>
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
                <button
                  className='btn btn-outline-secondary m-2'
                  onClick={() => setShowContactModal(true)}
                >
                  Edit
                </button>
              </li>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>
                  Phone: {user.phone ? formatPhone(user.phone) : "UNKNOWN"}
                </p>
                <button
                  className='btn btn-outline-secondary m-2'
                  onClick={() => setShowContactModal(true)}
                >
                  Edit
                </button>
              </li>
              <li className='list-group-item p-2 d-flex justify-content-between'>
                <p className='m-2'>Password: ******</p>
                <button
                  className='btn btn-outline-secondary m-2'
                  onClick={() => setShowPasswordModal(true)}
                >
                  Edit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-end'>
        <button
          className='btn btn-outline-secondary'
          onClick={onUpdateUser}
          disabled={!changesMade}
        >
          Update
        </button>
      </div>
      <NameModal
        user={user}
        show={showNameModal}
        setShow={setShowNameModal}
        onUpdate={({ first_name, last_name }) => {
          setUser({ ...user, first_name, last_name });
        }}
      />
      <ContactModal
        user={user}
        show={showContactModal}
        setShow={setShowContactModal}
        onUpdate={({ email, phone }) => {
          setUser({ ...user, email, phone });
        }}
      />
      <PasswordModal
        user={user}
        show={showPasswordModal}
        setShow={setShowPasswordModal}
        onUpdate={() => {}}
      />
    </div>
  );
}

function NameModal({
  user: { id: user_id, first_name, last_name },
  show,
  setShow,
  onUpdate,
}) {
  const [firstName, setFirstName] = useState(first_name || "");
  const [lastName, setLastName] = useState(last_name || "");
  const [contactError, setContactError] = useState("");

  const resetModal = () => {
    setShow(false); // Close Modal
    contactError("");
  };

  /**
   * @description Patch user first_name and last_name
   */
  const postUpdate = async () => {
    if (!firstName) {
      setContactError("First Name is Required.");
      return;
    }

    const { data, ok } = await api.patch(`/users/${user_id}`, {
      user: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (!ok) {
      return;
    }

    onUpdate(data); // Send updated user data
    resetModal();
  };

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
            value={firstName}
            onChange={(e) => {
              setContactError("");
              setFirstName(e.target.value);
            }}
          />
          {contactError && (
            <div className='invalid-feedback d-block'>{contactError}</div>
          )}
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
          <button
            onClick={postUpdate}
            className='btn btn-primary'
            disabled={firstName === first_name && lastName === last_name}
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ContactModal({
  user: { id: user_id, email, phone },
  show,
  setShow,
  onUpdate,
}) {
  const [userEmail, setUserEmail] = useState(email || "");
  const [emailError, setEmailError] = useState("");
  const [userPhone, setUserPhone] = useState(phone || "");
  const [phoneError, setPhoneError] = useState("");

  const resetModal = () => {
    setShow(false);
    setEmailError("");
    setPhoneError("");
  };

  const isValid = () => {
    let valid = true;
    if (userEmail && !verifyEmail(userEmail)) {
      setEmailError("Email is invalid.");
      valid = false;
    }
    if (userPhone && !verifyPhone(userPhone)) {
      setPhoneError("Phone is invalid.");
      valid = false;
    }
    return valid;
  };

  const postUpdate = async () => {
    if (!isValid()) {
      return;
    }

    const { data, ok } = await api.patch(`/users/${user_id}`, {
      user: {
        email: verifyEmail(userEmail),
        phone: verifyPhone(userPhone),
      },
    });

    if (!ok) {
      const { email, phone } = data;
      if (email) {
        let message;
        if (email[0] === "has already been taken") {
          message = "Email is already in use.";
        } else {
          message = email.join(", ");
        }
        setEmailError(message);
      }
      if (phone) {
        let message;
        if (phone[0] === "has already been taken") {
          message = "Email is already in use.";
        } else {
          message = phone.join(", ");
        }
        setPhoneError(message);
      }
      return;
    }

    onUpdate(data);
    resetModal();
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className='modal-body'>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            Email
          </label>
          <input
            type='email'
            className='form-control'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          {emailError && (
            <div className='invalid-feedback d-block'>{emailError}</div>
          )}
        </div>
        <div className='mb-3'>
          <label htmlFor='phone' className='form-lable'>
            Phone
          </label>
          <input
            type='tel'
            className='form-control'
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
          />
          {phoneError && (
            <div className='invalid-feedback d-block'>{phoneError}</div>
          )}
        </div>
        <div className='d-flex justify-content-center'>
          <button
            onClick={postUpdate}
            className='btn btn-primary'
            disabled={userEmail === email && userPhone === phone}
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PasswordModal({ user: { id: user_id }, show, setShow }) {
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const postUpdate = async () => {};

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className='modal-body'>
        <div className='mb-3'>
          <label htmlFor='old-password' className='form-label'>
            Old Password
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            className='form-control'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='new-password' className='form-label'>
            New Password
          </label>
          <input
            type='text'
            className='form-control'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='confirm-password' className='form-label'>
            Confirm Password
          </label>
          <input
            type='text'
            className='form-control'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-primary'>Update</button>
        </div>
      </div>
    </Modal>
  );
}
