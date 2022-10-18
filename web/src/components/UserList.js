// Hooks
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";
// Services
import { followUser, unfollowUser } from "../services/users";
// Components
import Loading from "./Loading";

export default function UserList({ users, title, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();

  if (loading) {
    return (
      <div className='d-flex h-100 justify-content-center align-items-center'>
        <Loading size={"lg"} />
      </div>
    );
  }

  return (
    <div>
      <div className='d-flex justify-content-center m-2'>
        <h2 className='text-muted text-uppercase fs-5'>{title}</h2>
      </div>
      {users?.map((user) => (
        <User
          key={user.user_id}
          user={user}
          user_id={auth.user.user_id}
          onUpdate={onUpdate}
        />
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
    followUser(user_id, user.user_id).then(toggleFollowingAndUpdate);
  };
  const unfollow = async () => {
    unfollowUser(user_id, user.user_id).then(toggleFollowingAndUpdate);
  };

  return (
    <div className='d-flex justify-content-between align-items-center'>
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
      {user_id !== user.user_id &&
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
