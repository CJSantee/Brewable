// Hooks
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
// Utils
import { getPostByUuid, newPost, updatePost } from "../services/posts";
// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";

export default function Post() {
  const { uuid } = useParams();

  const { auth } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(uuid !== "new");
  const [post, setPost] = useState({
    caption: "",
  });

  useEffect(() => {
    const getPost = async () => {
      const data = await getPostByUuid(uuid);
      setPost(data);
    };
    if (uuid && uuid !== "new") {
      setEditing(true);
      getPost();
    }
  }, [uuid]);

  const onPost = async () => {
    const { success } = editing
      ? await updatePost(post)
      : await newPost(auth.user.user_id, post.caption);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className='row'>
      <div className='col-12 col-md-8 col-lg-9'>
        <div className='d-flex justify-content-start align-items-start m-3 my-md-3 ms-md-3 me-md-1'>
          <img
            src={placeholder}
            className='border rounded-circle w-75 max-w-60px d-none d-md-inline'
            alt='profile'
          />
          <div className='d-flex flex-column flex-fill border rounded m-0 ms-md-2'>
            <div className='d-flex'>
              <h2 className='fs-4 m-2 text-muted'>New Post</h2>
            </div>
            <div className='d-flex justify-content-start align-items-center my-2'>
              <ul className='nav nav-tabs w-100'>
                <li className='nav-item px-2'>
                  <button className='nav-link active'>Caption</button>
                </li>
              </ul>
            </div>
            <div className='d-flex'>
              <textarea
                name='caption'
                className='form-control bg-light m-1 rounded'
                value={post.caption}
                onChange={(e) => setPost({ ...post, caption: e.target.value })}
                cols='30'
                rows='10'
              />
            </div>
            <div className='d-flex justify-content-end align-items-center'>
              <button onClick={onPost} className='btn btn-primary m-1'>
                {editing ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='col-12 col-md-4 col-lg-3'>
        <div className='d-flex flex-column m-3 my-md-3 ms-md-1 me-md-3'>
          <div className='d-flex border-bottom'>
            <p className='text-muted'>Tags</p>
          </div>
          <div className='d-flex border-bottom'>
            <p className='text-muted'>Photo</p>
          </div>
          <div className='d-flex border-bottom'>
            <p className='text-muted'>Location</p>
          </div>
          <div className='d-flex border-bottom'>
            <p className='text-muted'>Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}