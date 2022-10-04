// Hooks
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
// Utils
import { api } from "../utils/api";
import { followUser, unfollowUser } from "../services/users";
// Components
import PageNotFound from "./ PageNotFound";
import UserList from "../components/UserList";
// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";
import { useAuth } from "../hooks/useAuth";

export default function User() {
  const params = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = async () => {
    const { data } = await api.get(`/users?query=${params.username}`);
    if (data?.length) {
      setUser(data[0]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      await updateUser();
      setLoading(false);
    };
    getUser();
  }, []);

  const follow = async () => {
    if (auth.user.user_id === user.id) {
      return;
    }
    followUser(auth.user.user_id, user.id).then(updateUser);
  };
  const unfollow = async () => {
    if (auth.user.user_id === user.id) {
      return;
    }
    unfollowUser(auth.user.user_id, user.id).then(updateUser);
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }
  if (!user) {
    return <PageNotFound />;
  }
  return (
    <div className='row m-0 p-0'>
      <div className='col-12 col-md-4 col-lg-3 p-2 vh-100 border-end'>
        <div className='d-flex justify-content-center'>
          <img
            src={placeholder}
            className='border rounded-circle w-75 max-w-260px m-2'
            alt=''
          />
        </div>
        <div className='m-2 d-flex justify-content-between align-items-center'>
          <div>
            <h2 className='fs-4 m-0'>
              {user.first_name} {user.last_name}
            </h2>
            <h2 className='fs-5 m-0 text-muted me-1'>{user.username}</h2>
          </div>
          {auth.user.user_id === user.id ? (
            <button className='btn btn-outline-secondary ms-1'>
              Edit profile
            </button>
          ) : user.following ? (
            <button onClick={unfollow} className='btn btn-outline-primary ms-1'>
              Unfollow
            </button>
          ) : (
            <button onClick={follow} className='btn btn-primary ms-1'>
              Follow
            </button>
          )}
        </div>
        <div className='d-flex m-2'>
          <p>Full-time software engineer, part-time coffee snob.</p>
        </div>
        <div className='d-flex justify-content-evenly'>
          <p
            onClick={() => navigate(`/${user.username}`)}
            className='text-muted text-decoration-none cursor-pointer'
          >
            <span className='text-dark'>513</span>
            {" brews"}
          </p>
          <p
            onClick={() => navigate(`/${user.username}/followers`)}
            className='text-muted text-decoration-none cursor-pointer'
          >
            <span className='text-dark'>{user.followers_count}</span>
            {" followers"}
          </p>
          <p
            onClick={() => navigate(`/${user.username}/following`)}
            className='text-muted text-decoration-none cursor-pointer'
          >
            <span className='text-dark'>{user.following_count}</span>
            {" following"}
          </p>
        </div>
      </div>
      <div className='col-12 col-md-8 col-lg-9'>
        <Routes>
          <Route path='/' element={<Posts />} />
          <Route
            path='/followers'
            element={
              <UserList
                user_id={user.id}
                list='followers'
                updateUser={updateUser}
              />
            }
          />
          <Route
            path='/following'
            element={
              <UserList
                user_id={user.id}
                list='following'
                updateUser={updateUser}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function Posts() {
  const [viewing, setViewing] = useState("feed");

  return (
    <div className='m-2'>
      <ul className='nav border-bottom border-2'>
        <li className='nav-item cursor-pointer'>
          <p
            onClick={() => setViewing("feed")}
            className={`nav-link ${
              viewing === "feed" ? "border-bottom border-2 border-primary" : ""
            } m-0`}
          >
            Feed
          </p>
        </li>
        <li className='nav-item cursor-pointer'>
          <p
            onClick={() => setViewing("photos")}
            className={`nav-link ${
              viewing === "photos"
                ? "border-bottom border-2 border-primary"
                : ""
            } m-0`}
          >
            Photos
          </p>
        </li>
        <li className='nav-item cursor-pointer'>
          <p
            onClick={() => setViewing("locations")}
            className={`nav-link ${
              viewing === "locations"
                ? "border-bottom border-2 border-primary"
                : ""
            } m-0`}
          >
            Locations
          </p>
        </li>
        <li className='nav-item cursor-pointer'>
          <p
            onClick={() => setViewing("reviews")}
            className={`nav-link ${
              viewing === "reviews"
                ? "border-bottom border-2 border-primary"
                : ""
            } m-0`}
          >
            Reviews
          </p>
        </li>
      </ul>
    </div>
  );
}
