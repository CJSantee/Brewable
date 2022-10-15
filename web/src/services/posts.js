const { api } = require("../utils/api");

/**
 * @description Create a new post for a user
 * @param {number} user_id
 * @param {string} caption
 */
const newPost = async (user_id, caption) => {
  return await api.post(`/users/${user_id}/posts`, {
    caption,
  });
};

const getAllPostsForUser = async (user_id) => {
  const { data } = await api.get(`/users/${user_id}/posts`);
  return data;
};

export { newPost, getAllPostsForUser };
