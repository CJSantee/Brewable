import { useEffect, useState } from "react";
import { api } from "../utils/api";

import placeholder from "../assets/image-placeholder-612x612.jpeg";
import { useAuth } from "../hooks/useAuth";
import { followUser, unfollowUser } from "../services/users";

export default function UserList({ user_id, list, updateUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      console.log("getUsers");
      const { data } = await api.get(`/users/${user_id}/${list}`);
      setUsers(data);
      setLoading(false);
    };
    getUsers();
  }, [user_id, list]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <div className='d-flex justify-content-center m-2'>
        <h2 className='text-muted text-uppercase fs-5'>{list}</h2>
      </div>
      {users.map((user) => (
        <User user={user} user_id={auth.user.user_id} updateUser={updateUser} />
      ))}
    </div>
  );
}

function User({ user, user_id, updateUser }) {
  const [following, setFollowing] = useState(user.following);

  const toggleFollowingAndUpdate = () => {
    setFollowing(!following);
    updateUser();
  };
  const follow = async () => {
    followUser(user_id, user.id).then(toggleFollowingAndUpdate);
  };
  const unfollow = async () => {
    unfollowUser(user_id, user.id).then(toggleFollowingAndUpdate);
  };

  return (
    <div
      key={user.id}
      className='d-flex justify-content-between align-items-center'
    >
      <div
        onClick={() => {
          window.location.href = `/${user.username}`;
        }}
        className='d-flex align-items-center cursor-pointer'
      >
        <img
          src={placeholder}
          className='border rounded-circle max-w-80px'
          alt='profile'
        />
        <div className='m-2'>
          <h2 className='fs-4 m-0'>{user.name}</h2>
          <h2 className='fs-5 m-0 text-muted me-1'>{user.username}</h2>
        </div>
      </div>
      {user_id !== user.id &&
        (following ? (
          <button onClick={unfollow} className='btn btn-outline-primary ms-1'>
            Unfollow
          </button>
        ) : (
          <button onClick={follow} className='btn btn-primary ms-1'>
            Follow
          </button>
        ))}
    </div>
  );
}
