import api from "../utils/api";

const getAllPosts = async () => {
  const { data: posts } = await api.get("/posts");
  return posts;
};

/**
 * @description Get a post with it's uuid
 * @param {string} post_uuid
 * @returns
 */
const getPostByUuid = async (post_uuid) => {
  const { data: post } = await api.get(`/posts/${post_uuid}`);
  return post;
};

/**
 * @description Create a new post for a user
 * @param {number} user_id
 * @param {string} caption
 * @returns
 */
const newPost = async (user_id, caption) => {
  return await api.post(`/users/${user_id}/posts`, {
    caption,
  });
};

/**
 * @description Edit a post
 * @param {object} post
 * @returns
 */
const updatePost = async (post) => {
  return await api.patch(`/users/${post.user_id}/posts/${post.post_id}`, post);
};

/**
 * @description Get all posts for a user_id
 * @param {number} user_id
 * @returns
 */
const getAllPostsForUser = async (user_id) => {
  const { data } = await api.get(`/users/${user_id}/posts`);
  return data;
};

/**
 * @description archives a post
 * @param {number} user_id
 * @param {number} post_id
 * @returns
 */
const archivePost = async (user_id, post_id) => {
  return await api.delete(`/users/${user_id}/posts/${post_id}`);
};

export {
  getAllPosts,
  getPostByUuid,
  newPost,
  updatePost,
  getAllPostsForUser,
  archivePost,
};
