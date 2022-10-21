// Assets
import placeholder from "../assets/image-placeholder-612x612.jpeg";

import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { archivePost } from "../services/posts";

export default function PostsList({ posts }) {
  return (
    <div className='d-flex flex-column align-items-center'>
      {posts.map((post) => (
        <Post key={post.post_id} post={post} />
      ))}
    </div>
  );
}

function Post({ post }) {
  return (
    <div className='d-flex justify-content-start align-items-start min-w-600px bg-hover-light p-2 rounded'>
      <img
        src={placeholder}
        className='border rounded-circle max-w-60px'
        alt=''
      />
      <div className='d-flex flex-fill flex-column mx-2'>
        <div className='d-flex justify-content-between mb-1'>
          <div className='d-flex'>
            <p className='fs-6 fw-bold m-0'>{post.name}</p>
            <p className='fs-6 text-muted m-0 ms-1'>@{post.username}</p>
            <p className='fs-6 text-muted m-0'>
              <span className='mx-2'>·</span>
              {post.display_time}
            </p>
            {post.edited && (
              <p className='fs-6 text-muted m-0 ms-1'>(edited)</p>
            )}
          </div>
          <PostOptions
            post_id={post.post_id}
            user_id={post.user_id}
            post_uuid={post.post_uuid}
          />
        </div>
        <p className='fs-6'>{post.caption}</p>
      </div>
    </div>
  );
}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    className='cursor-pointer'
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    ···
  </span>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className='mx-3 my-2 w-auto'
          placeholder='Type to filter...'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className='list-unstyled'>
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

function PostOptions({ user_id, post_id, post_uuid }) {
  const navigate = useNavigate();

  const onArchive = () => {
    archivePost(user_id, post_id);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components' />
      <Dropdown.Menu align='end'>
        <Dropdown.Item onClick={() => navigate(`/post/${post_uuid}`)}>
          Edit
        </Dropdown.Item>
        <Dropdown.Item eventKey='2'>Archive</Dropdown.Item>
        <Dropdown.Item eventKey='3'>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
