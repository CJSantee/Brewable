import api from "../utils/api";

/**
 * @description Updates a user's name or bio
 * @param {object} user
 * @param {number} id
 * @param {number} user_id Alias for id
 * @param {string} user.name
 * @param {string} user.bio
 * @returns {object} user
 */
const updateUser = async ({ id, user_id = id, name, bio }) => {
  const { data: user, success } = await api.patch(`/users/${user_id}`, {
    user: {
      name,
      bio,
    },
  });
  return { user, success };
};

/**
 * @description
 */
const getAllUsers = async () => {
  const { data: users } = await api.get("/users");
  return users;
};

/**
 * @description Returns user data for given username
 * @param {string} username
 * @returns {object} user
 */
const getByUsername = async (username) => {
  const {
    data: [user],
  } = await api.get(`/users?username=${username}`);
  return user;
};

/**
 * @description Get all the followers of a user
 * @param {number} id
 * @param {number} user_id Alias for id
 * @returns
 */
const getFollowers = async (user_id) => {
  const { data: users, success } = await api.get(`/users/${user_id}/followers`);
  return { users, success };
};

/**
 * @description Get all the users following a given user
 * @param {number} id
 * @param {number} user_id Alias for id
 * @returns
 */
const getFollowing = async (user_id) => {
  const { data: users, success } = await api.get(`/users/${user_id}/following`);
  return { users, success };
};

/**
 * @description
 * @param {string} action - follow|unfollow
 */
const followAction = async (follower_id, followed_id, action) => {
  if (followed_id === follower_id) {
    return { error: { message: "Cannot follow yourself!" }, success: false };
  }
  return await api.post(`/users/${follower_id}/${action}`, {
    followed_id,
  });
};

const followUser = async (follower_id, followed_id) => {
  return await followAction(follower_id, followed_id, "follow");
};

const unfollowUser = async (follower_id, followed_id) => {
  return await followAction(follower_id, followed_id, "unfollow");
};

export {
  updateUser,
  getAllUsers,
  getByUsername,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};
