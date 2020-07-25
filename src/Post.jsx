import React from "react";
import "./Post.scss";
import { deletePost } from "./slices/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";

function Post({ text, image, author, time, _id }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loggedIn = !!user;
  const buttons = loggedIn ? (
    <div className="buttons">
      <button className="reply">Reply</button>
      <button className="like">Like</button>
      {author._id === user.sub ? (
        <button className="delete" onClick={() => dispatch(deletePost(_id))}>
          Delete
        </button>
      ) : (
        <button className="repost">Repost</button>
      )}
    </div>
  ) : null;
  console.log({ author, user });
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
      {buttons}
    </div>
  );
}

export default Post;
