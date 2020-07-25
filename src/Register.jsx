import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Register.scss";
import { register } from "./slices/posts/userSlice";

function Register() {
  const dispatch = useDispatch();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="Register">
      <input
        className="handlebox"
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
          className="registerbutton"
          onClick={() =>
            dispatch(
              register({
                handle,
                password,
              })
            )
          }
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
