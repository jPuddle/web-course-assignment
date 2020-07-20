import React from "react";
import "./Post.scss";
import { createSpam, deletePost } from "./slices/posts/postsSlice";
import { useDispatch } from "react-redux";

function Post({ text, image, author = {}, time, id }) {
  const dispatch = useDispatch();
  return (
    <div className="Post">
      <div className="header">
        <div className="profile_picture">{author.profile_picture}</div>
        <div className="handle">{author.handle}</div>
        <div className="time">{time}</div>
      </div>
      <div className="content">
        <div className="text_content">{text}</div>
        <div className="image_content">{image}</div>
      </div>
      <div className="buttons">
        <button className="reply">Reply</button>
        <button className="like" onClick={() => dispatch(createSpam({}))}>
          Like
        </button>
        <button className="repost">Repost</button>
        <button className="delete" onClick={() => dispatch(deletePost(id))}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Post;
