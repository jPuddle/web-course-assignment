import React from "react";
import "./Post.scss";
import { deletePost } from "./slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";

function Post({ text, author, time, _id }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loggedIn = !!user;
  const buttons = loggedIn ? (
    <div className="buttons">
      {author._id === user.sub && (
        <button className="delete" onClick={() => dispatch(deletePost(_id))}>
          Delete
        </button>
      )}
    </div>
  ) : null;
  return (
    <div className="Post">
      <div className="header">
        <div className="handle">{author.handle}</div>
        <div className="time">{time}</div>
      </div>
      <div className="content">
        <div className="text_content">{text}</div>
      </div>
      {buttons}
    </div>
  );
}

export default Post;
