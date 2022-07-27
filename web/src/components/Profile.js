import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { api } from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.userId) {
      api.get(`/users/${auth.userId}`, setUser);
    }
  }, [auth.userId]);

  return (
    <div className='container'>
      {user && (
        <div className='card'>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item'>First Name: {user.first_name}</li>
            <li className='list-group-item'>Last Name: {user.last_name}</li>
            <li className='list-group-item'>Email: {user.email}</li>
            <li className='list-group-item'>Phone: {user.phone}</li>
            <li className='list-group-item'>Password: ******</li>
          </ul>
        </div>
      )}
    </div>
  );
}
