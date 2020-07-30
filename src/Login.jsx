import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Login.scss";
import { login } from "./slices/userSlice";

function Login() {
  const dispatch = useDispatch();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="Login">
      <input
        className="handle"
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <input
        className="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="buttons">
        <button
          className="loginbutton"
          onClick={() =>
            dispatch(
              login({
                handle,
                password,
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
