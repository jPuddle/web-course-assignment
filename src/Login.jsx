import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Login.scss";
import { login } from "./slices/posts/userSlice";

function Login() {
  const dispatch = useDispatch();
  const [handle, setHandle] = useState("");
  return (
    <div className="Login">
      <input
        className="handlebox"
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <div className="buttons">
        <button
          className="loginbutton"
          onClick={() =>
            dispatch(
              login({
                handle,
              })
            )
          }
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
