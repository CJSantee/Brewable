// Hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// Utils
import {
  followUser,
  getByUsername,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../services/users";
// Components
import PageNotFound from "./PageNotFound";
import UserList from "../components/UserList";
import EditProfileModal from "../components/EditProfileModal";
import Loading from "../components/Loading";
import { Route, Routes } from "react-router-dom";
// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";
// Services
import { getAllPostsForUser } from "../services/posts";
import PostsList from "../components/PostsList";

export default function User() {
  const { username } = useParams();
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const updateUser = async () => {
    const user = await getByUsername(username);
    setUser(user);
  };

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const user = await getByUsername(username);
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [username]);

  const follow = async () => {
    if (!auth.user) {
      navigate("/signin");
      return;
    }
    if (auth.user?.user_id === user.user_id) {
      return;
    }
    followUser(auth.user?.user_id, user.user_id).then(updateUser);
  };
  const unfollow = async () => {
    if (auth.user.user_id === user.user_id) {
      return;
    }
    unfollowUser(auth.user?.user_id, user.user_id).then(updateUser);
  };

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!user) {
      return;
    }
    const getUsers = async (section) => {
      switch (section) {
        case "following":
          const { users: following } = await getFollowing(user.user_id);
          setUsers(following);
          return;
        case "followers":
          const { users: followers } = await getFollowers(user.user_id);
          setUsers(followers);
          return;
        default:
          return [];
      }
    };
    const loc = location.pathname.split("/");
    const section = loc[loc.length - 1];
    getUsers(section);
  }, [location]);

  if (loading) {
    return (
      <div className='d-flex h-100 justify-content-center align-items-center'>
        <Loading size={"lg"} />
      </div>
    );
  }
  if (!user) {
    return <PageNotFound />;
  }
  return (
    <>
      <div className='row h-100 m-0 p-0'>
        <div className='col-12 col-md-4 col-lg-3 p-2 border-end'>
          <div className='d-flex justify-content-center'>
            <img
              src={placeholder}
              className='border rounded-circle w-75 max-w-260px m-2'
              alt=''
            />
          </div>
          <div className='m-2 d-flex justify-content-between align-items-center'>
            <div>
              <h2 className='fs-4 m-0'>{user.name}</h2>
              <h2 className='fs-5 m-0 text-muted me-1'>{user.username}</h2>
            </div>
            {auth.user?.user_id === user.user_id ? (
              <button
                onClick={() => setShowEditProfile(true)}
                className='btn btn-outline-secondary ms-1'
              >
                Edit profile
              </button>
            ) : user.following ? (
              <button
                onClick={unfollow}
                className='btn btn-outline-primary ms-1'
              >
                Unfollow
              </button>
            ) : (
              <button onClick={follow} className='btn btn-primary ms-1'>
                Follow
              </button>
            )}
          </div>
          <div className='d-flex m-2'>
            <p>{user.bio}</p>
          </div>
          <div className='d-flex justify-content-evenly'>
            <p
              onClick={() => navigate(`/${user.username}`)}
              className='text-muted text-decoration-none cursor-pointer'
            >
              <span className='text-dark'>{user.posts_count}</span>
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
            <Route path='/' element={<Posts user_id={user?.user_id} />} />
            <Route
              path='/followers'
              element={
                <UserList
                  users={users}
                  title='followers'
                  onUpdate={updateUser}
                />
              }
            />
            <Route
              path='/following'
              element={
                <UserList
                  users={users}
                  title='following'
                  onUpdate={updateUser}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <EditProfileModal
        show={showEditProfile}
        setShow={setShowEditProfile}
        user={user}
        onUpdate={updateUser}
      />
    </>
  );
}

function Posts({ user_id }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getAllPostsForUser(user_id);
      if (posts) {
        setPosts(posts);
      }
    };
    getPosts();
  }, []);

  return <PostsList posts={posts} />;
}
