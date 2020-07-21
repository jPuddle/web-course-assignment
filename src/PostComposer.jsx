import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./PostComposer.scss";
import { createPost } from "./slices/posts/postsSlice";

function PostComposer() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  return (
    <div className="PostComposer">
      <input
        className="textbox"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="buttons">
        <button className="image_button">Add image</button>
        <button
          className="send"
          onClick={() => {
            dispatch(
              createPost({
                time: new Date().toISOString(),
                text,
              })
            );
            setText("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default PostComposer;
