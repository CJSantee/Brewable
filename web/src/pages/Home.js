import { useEffect, useState } from "react";
import PostsList from "../components/PostsList";
import { getAllPosts } from "../services/posts";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getAllPosts();
      setPosts(data);
    };
    getPosts();
  }, []);

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <PostsList posts={posts} />
    </div>
  );
}
