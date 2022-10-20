// Hooks
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";
// Services
import { followUser, unfollowUser } from "../services/users";
// Components
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";

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
          showAdminOptions={auth.user.roles.includes("admin")}
        />
      ))}
    </div>
  );
}

function User({ user, user_id, onUpdate, showAdminOptions }) {
  const [following, setFollowing] = useState(user.following);
  const navigate = useNavigate();

  const toggleFollowing = () => {
    if (following) {
      unfollowUser(user_id, user.user_id);
    } else {
      followUser(user_id, user.user_id);
    }
    setFollowing(!following);
    onUpdate();
  };

  return (
    <div className='d-flex justify-content-between align-items-center bg-hover-light p-2 rounded'>
      <div
        onClick={() => navigate(`/${user.username}`)}
        className='d-flex align-items-center cursor-pointer'
      >
        <img
          src={placeholder}
          className='border rounded-circle max-w-60px'
          alt='profile'
        />
        <div className='m-2'>
          <h2 className='fs-5 m-0'>{user.name}</h2>
          <h2 className='fs-6 m-0 text-muted me-1'>{user.username}</h2>
        </div>
      </div>
      {user_id !== user.user_id && (
        <FollowButton
          user={user}
          following={following}
          showAdminOptions={showAdminOptions}
          toggleFollowing={toggleFollowing}
        />
      )}
    </div>
  );
}

function FollowButton({ user, following, showAdminOptions, toggleFollowing }) {
  const { switchLogin } = useAuth();
  const navigate = useNavigate();

  const login = async () => {
    const { redirect_url } = await switchLogin(user);
    if (redirect_url) {
      navigate(redirect_url);
    }
  };

  if (showAdminOptions) {
    return (
      <SplitButton
        onClick={toggleFollowing}
        title={following ? "Unfollow" : "Follow"}
        variant='primary'
      >
        <Dropdown.Item onClick={login}>Log In</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Archive</Dropdown.Item>
        <Dropdown.Item>Delete</Dropdown.Item>
      </SplitButton>
    );
  } else {
    return (
      <button className={`btn btn-${following ? "outline" : null}primary`}>
        {following ? "Unfollow" : "Follow"}
      </button>
    );
  }
}
