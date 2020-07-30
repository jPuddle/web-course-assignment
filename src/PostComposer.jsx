import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./PostComposer.scss";
import { createPost } from "./slices/postsSlice";

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
        <button
          className="send"
          onClick={() => {
            dispatch(
              createPost({
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
