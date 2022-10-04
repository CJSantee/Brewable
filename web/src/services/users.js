const { api } = require("../utils/api");

/**
 * @description
 * @param {string} action - follow|unfollow
 */
const followAction = async (follower_id, followed_id, action) => {
  const response = await api.post(`/users/${follower_id}/${action}`, {
    followed_id,
  });
  return response;
};

const followUser = async (follower_id, followed_id) => {
  return await followAction(follower_id, followed_id, "follow");
};

const unfollowUser = async (follower_id, followed_id) => {
  return await followAction(follower_id, followed_id, "unfollow");
};

export { followUser, unfollowUser };
