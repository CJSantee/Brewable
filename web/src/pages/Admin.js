// Hooks
import { useEffect, useState } from "react";
// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserList from "../components/UserList";
// Assets
import { faShieldHalved, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getAllUsers } from "../services/users";
import Loading from "../components/Loading";

export default function Admin() {
  const [section, setSection] = useState("default");

  return (
    <div className='row m-0 p-0'>
      <div className='col-12 col-md-4 col-lg-3 p-2 border-end'>
        <div className='bg-hover-light rounded p-2 fs-5 cursor-pointer'>
          <FontAwesomeIcon icon={faShieldHalved} />
          <span className='ms-2'>Roles / Permissions</span>
        </div>
        <div
          onClick={() => setSection("all_users")}
          className='bg-hover-light rounded p-2 fs-5 cursor-pointer'
        >
          <FontAwesomeIcon icon={faUsers} />
          <span className='ms-2'>All Users</span>
        </div>
      </div>
      <div className='col-12 col-md-8 col-lg-9 vh-100 overflow-scroll'>
        <Section section={section} />
      </div>
    </div>
  );
}

function Section({ section }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setLoading(false);
    };
    if (section) {
      getUsers();
    }
  }, [section]);

  if (loading) {
    return (
      <div className='d-flex h-100 justify-content-center align-items-center'>
        <Loading size={"lg"} />
      </div>
    );
  }

  if (section === "all_users") {
    return <UserList users={users} />;
  }
  return <h3>{section}</h3>;
}
